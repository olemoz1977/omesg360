export class TechnicalPreloadError extends Error {
  constructor(message, { path = null, cause = null } = {}) {
    super(message, { cause });
    this.name = 'TechnicalPreloadError';
    this.path = path;
  }
}

function uniquePaths(paths) {
  if (!Array.isArray(paths) || paths.length === 0) {
    throw new TechnicalPreloadError('preload path list must be non-empty');
  }
  const seen = new Set();
  const out = [];
  for (const path of paths) {
    if (typeof path !== 'string' || !path) {
      throw new TechnicalPreloadError('preload paths must be non-empty strings');
    }
    if (!seen.has(path)) {
      seen.add(path);
      out.push(path);
    }
  }
  return out;
}

async function defaultDecodeObjectUrl(objectUrl) {
  if (typeof Image === 'undefined') {
    throw new Error('Image is unavailable; provide decodeObjectUrl outside a browser');
  }
  const image = new Image();
  image.decoding = 'async';
  image.src = objectUrl;
  if (typeof image.decode === 'function') {
    await image.decode();
  } else {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error('image decode failed'));
    });
  }
  return image;
}

export async function preloadAssetBundle(paths, {
  fetchFn = globalThis.fetch,
  createObjectURL = globalThis.URL?.createObjectURL?.bind(globalThis.URL),
  revokeObjectURL = globalThis.URL?.revokeObjectURL?.bind(globalThis.URL),
  decodeObjectUrl = defaultDecodeObjectUrl,
} = {}) {
  const requested = uniquePaths(paths);
  if (typeof fetchFn !== 'function') throw new TechnicalPreloadError('fetch is unavailable');
  if (typeof createObjectURL !== 'function') throw new TechnicalPreloadError('URL.createObjectURL is unavailable');
  if (typeof revokeObjectURL !== 'function') throw new TechnicalPreloadError('URL.revokeObjectURL is unavailable');
  if (typeof decodeObjectUrl !== 'function') throw new TechnicalPreloadError('decodeObjectUrl must be a function');

  const handles = new Map();
  const createdUrls = [];

  try {
    for (const path of requested) {
      let response;
      try {
        response = await fetchFn(path, { cache: 'force-cache', credentials: 'same-origin' });
      } catch (cause) {
        throw new TechnicalPreloadError(`asset fetch failed: ${path}`, { path, cause });
      }

      if (!response || response.ok !== true || typeof response.blob !== 'function') {
        throw new TechnicalPreloadError(`asset fetch returned non-success response: ${path}`, { path });
      }

      let blob;
      try {
        blob = await response.blob();
      } catch (cause) {
        throw new TechnicalPreloadError(`asset blob read failed: ${path}`, { path, cause });
      }

      const objectUrl = createObjectURL(blob);
      createdUrls.push(objectUrl);

      let decodedImage;
      try {
        decodedImage = await decodeObjectUrl(objectUrl, { path, blob });
      } catch (cause) {
        throw new TechnicalPreloadError(`asset decode failed: ${path}`, { path, cause });
      }

      handles.set(path, {
        path,
        objectUrl,
        decodedImage,
        byteSize: Number.isFinite(blob.size) ? blob.size : null,
        mimeType: typeof blob.type === 'string' && blob.type ? blob.type : null,
      });
    }
  } catch (error) {
    for (const objectUrl of createdUrls) {
      try { revokeObjectURL(objectUrl); } catch { /* best-effort cleanup */ }
    }
    if (error instanceof TechnicalPreloadError) throw error;
    throw new TechnicalPreloadError('unexpected asset preload failure', { cause: error });
  }

  let released = false;
  return {
    status: 'READY',
    handles,
    get(path) {
      if (released) throw new TechnicalPreloadError('preload bundle already released');
      const handle = handles.get(path);
      if (!handle) throw new TechnicalPreloadError(`asset was not preloaded: ${path}`, { path });
      return handle;
    },
    release() {
      if (released) return;
      released = true;
      for (const { objectUrl } of handles.values()) {
        try { revokeObjectURL(objectUrl); } catch { /* best-effort cleanup */ }
      }
      handles.clear();
    },
  };
}
