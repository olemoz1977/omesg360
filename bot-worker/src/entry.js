import worker, { ReminderHub } from "./plan-sync.js";

export { ReminderHub };

export default {
  async fetch(request, env, ctx) {
    try {
      return await worker.fetch(request, env, ctx);
    } catch (error) {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/admin/") || url.pathname.startsWith("/plan/")) {
        return Response.json(
          {
            ok: false,
            error: error instanceof Error ? error.message : String(error)
          },
          { status: 500 }
        );
      }
      throw error;
    }
  }
};
