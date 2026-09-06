// PrioLens v0.4 detail host.
// Presentation-only contract: the 12x12 matrix is the participant result; this host contains only A/B detail views.

export const RESULT_WORLD_CSS=`.result{padding-top:22px}.result h1{font-size:clamp(32px,8.7vw,46px);line-height:1.01;margin-bottom:8px}.resultLead{font-size:15px;line-height:1.45;max-width:620px;margin:0 0 6px;color:#696965}.result #saveStatus{font-size:12px;margin:7px 0 14px}
.resultWorld{margin-top:8px}.worldDetail{border-left:2px solid #d7d7d1;padding:4px 0 2px 12px;margin:16px 2px 0}.worldDetail h3{font-size:20px;margin:10px 0}.worldDetailBlock{background:#fff;border:1px solid var(--line);border-radius:15px;padding:12px;margin:8px 0}.worldDetailName{font-size:17px;font-weight:800;line-height:1.3}.worldDetailText{font-size:14px;line-height:1.5;color:#5f5f5f;margin-top:5px}.worldDetailImages{display:grid;grid-template-columns:repeat(auto-fit,minmax(78px,1fr));gap:7px;margin-bottom:10px;max-width:360px}.worldDetailImages img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:11px;border:1px solid #e2e2dd}.compactReflection{margin-top:8px}.compactReflection .reflectionQuestion{margin-top:8px}.reflectionAnswer{border:1px solid var(--line);background:#fff;border-radius:14px;padding:12px 14px}.reflectionAnswerLabel{font-size:11px;font-weight:820;letter-spacing:.08em;text-transform:uppercase;color:#77736d;margin-bottom:4px}.reflectionAnswerValue{font-size:16px;font-weight:780;line-height:1.35;color:#181818}.worldDetail .perspectiveLabel{margin-top:18px}.backgroundDetail{margin-top:30px;padding-top:4px;border-top:1px solid var(--line)}.backgroundDetail #leastHeading{font-size:18px;color:#555;margin:8px 0}.backgroundDetail .worldDetailBlock{padding:10px}.backgroundDetail .worldDetailName{font-size:15px}.backgroundDetail .worldDetailText{font-size:13px}.backgroundDetail .worldDetailImages{max-width:320px}.detailBack{border:0;background:transparent;padding:0;margin:0 0 18px;color:#555;font-size:14px;font-weight:760;cursor:pointer}.detailBack:focus-visible{outline:2px solid #181818;outline-offset:4px}.result.detailMode>h1,.result.detailMode>#resultLead,.result.detailMode>#saveStatus,.result.detailMode .resultActions{display:none!important}.result.detailMode .resultWorld{margin-top:0}.result.detailOnlyHost>h1,.result.detailOnlyHost>#resultLead,.result.detailOnlyHost>#saveStatus,.result.detailOnlyHost .resultActions{display:none!important}.result.detailOnlyHost .resultWorld{margin-top:0}.result.detailMode .worldDetail,.result.detailOnlyHost .worldDetail{border-left:0;padding:0;margin:0}.worldRenderError{margin:18px 0;padding:16px;border:1px solid #c9c7c1;border-radius:16px;background:#fff7f2;font-size:14px;line-height:1.5;color:#4f433d}.suffSheetBackdrop{position:fixed;inset:0;z-index:40;height:100dvh;background:rgba(24,24,24,.28);display:flex;align-items:flex-end;justify-content:center;padding:0}.suffSheetBackdrop.hidden{display:none}.suffSheet{width:min(100%,620px);max-height:min(78dvh,calc(100dvh - 12px));overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;background:#fff;border-radius:24px 24px 0 0;padding:18px 18px calc(26px + env(safe-area-inset-bottom));scroll-padding-bottom:calc(26px + env(safe-area-inset-bottom));box-shadow:0 -10px 34px rgba(0,0,0,.14)}.suffSheetHead{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:6px}.suffSheetHead h3{margin:0;font-size:22px}.suffSheetClose{border:1px solid var(--line);background:#fff;border-radius:999px;padding:8px 12px;font-weight:760}.suffSheet .worldDetailBlock{margin-top:12px}.detailWhy{margin-top:12px;padding-top:12px;border-top:1px solid var(--line)}.repeatSubheading{font-size:14px;margin:18px 2px 8px;color:#4f5f68}.repeatedMostDetail.repeat3{border-left:4px solid #2f7654}.repeatedMostDetail.repeat2{border-left:4px solid #82b89b}.researchParallel{margin:18px 0 4px;border:1px solid var(--line);border-radius:14px;background:#f7fafb;padding:0 12px}.researchParallel summary{cursor:pointer;font-weight:800;padding:12px 0;color:#1d3a4c}.researchParallel p{margin:0 0 10px;font-size:13px;line-height:1.55;color:#52636d}.researchRefs{display:grid;gap:5px;padding:0 0 12px}.researchRefs a{font-size:12px;line-height:1.35;color:#315f74;text-decoration:underline;text-underline-offset:2px}body.suffSheetOpen{overflow:hidden}
`;

export const RESULT_WORLD_HTML=`  <section id="result" class="screen result">
    <h1>Pirmas žvilgsnis. Antras atsakymas.</h1>
    <p id="resultLead" class="resultLead"></p>
    <p id="saveStatus" class="note">Sesijos išsaugojimas tikrinamas…</p>

    <div class="resultWorld">
      <div id="attentionDetail" class="worldDetail detailPagePanel hidden">
        <button id="attentionBack" class="detailBack" type="button">← Grįžti į rezultatą</button>
        <h3 id="attentionDetailTitle"></h3>
        <div id="repeatRows" class="rows"></div>
        <p id="attentionNote" class="resultNote hidden"></p>
        <p id="compareLabel" class="perspectiveLabel">Pažiūrėk atidžiau</p>
        <h3 id="compareHeading"></h3>
        <div id="compareRows" class="rows"></div>
        <div id="attentionResearch"></div>
        <div class="backgroundDetail">
          <p id="leastLabel" class="perspectiveLabel"></p>
          <h3 id="leastHeading">Kas liko antrame plane?</h3>
          <div id="leastRows" class="rows"></div>
          <p id="leastNote" class="rankLeastNote"></p>
        </div>
      </div>

      <div id="suffDetail" class="suffSheetBackdrop hidden" role="presentation">
        <section class="suffSheet" role="dialog" aria-modal="true" aria-labelledby="suffDetailTitle">
          <div class="suffSheetHead"><h3 id="suffDetailTitle"></h3><button id="suffDetailClose" class="suffSheetClose" type="button">Uždaryti</button></div>
          <div id="suffRows" class="rows"></div>
          <p id="suffResultNote" class="resultNote hidden"></p>
          <div id="suffResearch"></div>
        </section>
      </div>
    </div>

    <div class="actions resultActions"><button id="restart" class="primary">Atlikti dar kartą</button><button id="resultPdf" class="secondary">Išsaugoti PDF</button><a id="back2rasi" class="secondary actionLink" href="https://2rasi.lt/#experiments">Grįžti į 2rasi</a><button id="export" class="secondary hidden"></button></div>
    <p id="exportStatus" class="note hidden"></p>
    <details id="debugDetails" class="perspective hidden"><summary></summary><pre id="debug" class="debug"></pre></details>
  </section>
`;
