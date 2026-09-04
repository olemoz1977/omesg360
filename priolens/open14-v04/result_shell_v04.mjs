// PrioLens v0.4 result shell.
// Presentation-only contract: keep result semantics in result_renderer_v04.mjs.

export const RESULT_WORLD_CSS=`.result{padding-top:22px}.result h1{font-size:clamp(32px,8.7vw,46px);line-height:1.01;margin-bottom:8px}.resultLead{font-size:15px;line-height:1.45;max-width:620px;margin:0 0 6px;color:#696965}.result #saveStatus{font-size:12px;margin:7px 0 14px}
.resultWorld{margin-top:8px}.resultScene{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:26px;background:#fff;min-height:660px}.sceneZone{width:100%;border:0;color:#181818;text-align:left;display:block;position:relative}.sceneDetailButton{position:absolute;z-index:4;border:1px solid rgba(24,24,24,.18);background:rgba(255,255,255,.9);color:#181818;border-radius:999px;padding:9px 13px;font-size:12px;font-weight:780;line-height:1;box-shadow:0 3px 12px rgba(0,0,0,.06)}.sceneDetailButton:focus-visible{outline:3px solid #181818;outline-offset:2px}.shipDetailButton{right:2px;bottom:0}.mapDetailButton{left:0;bottom:0}.shipZone{height:285px;padding:18px 18px 0;background:linear-gradient(#fbfbf8 0%,#f8faf8 60%,#e7f1f2 60%,#d7eaed 100%)}.sceneEyebrow{font-size:11px;font-weight:850;letter-spacing:.15em;text-transform:uppercase;color:#72726e}.shipStage{position:absolute;left:15px;right:15px;bottom:12px;height:208px}.shipStage:before,.shipStage:after{content:"";position:absolute;left:7%;right:7%;height:18px;border-top:1px solid rgba(89,134,142,.18);border-radius:50%;z-index:0}.shipStage:before{bottom:18px}.shipStage:after{bottom:5px;left:18%;right:18%;opacity:.7}.shipVisual{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);width:min(92%,360px);height:176px}.shipVisual svg{display:block;width:100%;height:100%;overflow:visible}.shipHullShape{fill:rgba(255,255,255,.76);stroke:#778281;stroke-width:2;stroke-linejoin:round}.shipMastLine,.shipBoomLine{fill:none;stroke:#778281;stroke-width:2;stroke-linecap:round}.shipSailShape{fill:rgba(255,255,255,.9);stroke:#778281;stroke-width:2;stroke-linejoin:round}.shipKeelLine{fill:none;stroke:#9aa4a2;stroke-width:1.2;opacity:.65}.shipFocus{position:absolute;z-index:2;left:53%;top:58px;width:38%;font-size:clamp(18px,5.4vw,24px);font-weight:850;letter-spacing:-.03em;line-height:1.05;text-align:center;overflow-wrap:anywhere}.shipHint{position:absolute;right:4px;bottom:1px;font-size:11px;color:#72726e}
.waterBand{height:62px;position:relative;background:linear-gradient(#dcecef,#c4e0e5 48%,#eef2ee 49%,#f6f3eb 100%)}.waterBand:before,.waterBand:after{content:"";position:absolute;left:-5%;width:110%;border-top:1px solid rgba(70,115,125,.25);border-radius:50%}.waterBand:before{top:16px;height:18px}.waterBand:after{top:24px;height:20px}.waterlineLabel{position:absolute;left:18px;top:10px;font-size:10px;font-weight:800;letter-spacing:.13em;color:#5e7b80;text-transform:uppercase}
.mapZone{min-height:332px;padding:20px 16px 18px;background:#f7f3e9}.mapTop{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:4px}.mapRouteSummary{max-width:70%;font-size:17px;font-weight:830;line-height:1.14;letter-spacing:-.02em;text-align:right}.mapStage{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;min-height:236px;isolation:isolate;overflow:hidden;background:radial-gradient(ellipse at 50% 49%,rgba(230,241,241,.94) 0%,rgba(221,237,239,.76) 54%,rgba(247,243,233,0) 88%)}.mapStage.routeLands1{grid-template-columns:minmax(0,1fr);max-width:320px;margin:0 auto;align-items:start}.mapStage.routeLands2{grid-template-columns:repeat(2,minmax(0,1fr));max-width:530px;margin:5px auto 0;align-items:start}.mapStage.routeLandsMany{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:5px;align-items:start}.mapStage.routeLands0{display:flex;align-items:center;justify-content:center;min-height:190px;background:none}.mapEmpty{max-width:250px;text-align:center;font-size:14px;line-height:1.45;color:#77726a}.mapRoutes{position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none;overflow:hidden}.routePath{fill:none;stroke:#5f625f;stroke-width:1.65;stroke-dasharray:3 6;stroke-linecap:round;opacity:.82}.continent{position:relative;z-index:1;min-height:148px;padding:25px 18px 20px;display:flex;flex-direction:column;justify-content:center;gap:7px;text-align:center;overflow:visible}.routeLands1 .continent{min-height:190px}.routeLands2 .continent,.routeLandsMany .continent{min-height:132px;padding:18px 10px 16px}.landShape{position:absolute;inset:0;width:100%;height:100%;z-index:0;overflow:visible;filter:drop-shadow(0 5px 8px rgba(55,48,37,.045))}.landShoreHaloOuter{fill:none;stroke:#d5e8e9;stroke-width:9;opacity:.75;vector-effect:non-scaling-stroke}.landShoreHaloInner{fill:none;stroke:#eff4f0;stroke-width:5;opacity:.96;vector-effect:non-scaling-stroke}.landFill{fill:#ece7d8;stroke:#aaa89f;stroke-width:1.35;vector-effect:non-scaling-stroke}.landCoastDetail{fill:none;stroke:#bebbac;stroke-width:.78;opacity:.52;vector-effect:non-scaling-stroke}.landTerrain{fill:none;stroke:#aeb0a5;stroke-width:1;opacity:.55;vector-effect:non-scaling-stroke}.landTerrainFill{fill:#cfd3bd;stroke:none;opacity:.5}.landWater{fill:#d9eaeb;stroke:#b7cccd;stroke-width:.8;opacity:.9;vector-effect:non-scaling-stroke}.landIslet{fill:#ece7d8;stroke:#aaa89f;stroke-width:1.05;opacity:.96;vector-effect:non-scaling-stroke}.continentTitle,.needNode{position:relative;z-index:5}.continentTitle{font-size:9px;font-weight:840;line-height:1.2;letter-spacing:.09em;text-transform:uppercase;color:#726e64}.needNode{font-size:10.5px;line-height:1.22;color:#343431}.needNode.routeTarget{display:flex;align-items:flex-start;gap:6px;align-self:center;max-width:90%;font-weight:820;color:#181818;background:rgba(249,247,240,.84);padding:4px 7px;border-radius:7px;text-decoration:none;text-align:left;box-shadow:0 1px 0 rgba(255,255,255,.5)}.mapPin{position:relative;flex:0 0 auto;width:12px;height:12px;border:1.6px solid #575a57;border-radius:50%;background:#f6f2e8;box-shadow:0 0 0 4px rgba(246,242,232,.72);margin-top:1px}.mapPin:after{content:"";position:absolute;inset:2.6px;border-radius:50%;background:#575a57}.needText{display:block}.routeLands1 .continent:not(.multiTargets) .continentTitle{position:absolute;left:34%;top:40%;transform:translate(-50%,-50%);width:46%;text-align:center}.routeLands1 .continent:not(.multiTargets) .needNode{position:absolute;left:48%;top:51%;max-width:46%;transform:translateY(-50%)}.mapHint{font-size:11px;color:#77726a;margin-top:8px;text-align:right}.routeKey{display:none}
.worldDetail{border-left:2px solid #d7d7d1;padding:4px 0 2px 12px;margin:16px 2px 0}.worldDetail h3{font-size:20px;margin:10px 0}.worldDetailBlock{background:#fff;border:1px solid var(--line);border-radius:15px;padding:12px;margin:8px 0}.worldDetailName{font-size:17px;font-weight:800;line-height:1.3}.worldDetailText{font-size:14px;line-height:1.5;color:#5f5f5f;margin-top:5px}.worldDetailImages{display:grid;grid-template-columns:repeat(auto-fit,minmax(78px,1fr));gap:7px;margin-bottom:10px;max-width:360px}.worldDetailImages img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:11px;border:1px solid #e2e2dd}.worldSeparation{font-size:11px;line-height:1.45;color:#77736d;margin:11px 5px 0}.compactReflection{margin-top:8px}.compactReflection .reflectionQuestion{margin-top:8px}.reflectionAnswer{border:1px solid var(--line);background:#fff;border-radius:14px;padding:12px 14px}.reflectionAnswerLabel{font-size:11px;font-weight:820;letter-spacing:.08em;text-transform:uppercase;color:#77736d;margin-bottom:4px}.reflectionAnswerValue{font-size:16px;font-weight:780;line-height:1.35;color:#181818}.worldDetail .perspectiveLabel{margin-top:18px}.backgroundDetail{margin-top:30px;padding-top:4px;border-top:1px solid var(--line)}.backgroundDetail #leastHeading{font-size:18px;color:#555;margin:8px 0}.backgroundDetail .worldDetailBlock{padding:10px}.backgroundDetail .worldDetailName{font-size:15px}.backgroundDetail .worldDetailText{font-size:13px}.backgroundDetail .worldDetailImages{max-width:320px}.detailBack{border:0;background:transparent;padding:0;margin:0 0 18px;color:#555;font-size:14px;font-weight:760;cursor:pointer}.detailBack:focus-visible{outline:2px solid #181818;outline-offset:4px}.result.detailMode>h1,.result.detailMode>#resultLead,.result.detailMode>#saveStatus,.result.detailMode .resultScene,.result.detailMode #worldSeparationNote,.result.detailMode .resultActions{display:none!important}.result.detailMode .resultWorld{margin-top:0}.result.detailMode .worldDetail{border-left:0;padding:0;margin:0}.worldRenderError{margin:18px 0;padding:16px;border:1px solid #c9c7c1;border-radius:16px;background:#fff7f2;font-size:14px;line-height:1.5;color:#4f433d}.suffSheetBackdrop{position:fixed;inset:0;z-index:40;background:rgba(24,24,24,.28);display:flex;align-items:flex-end;justify-content:center;padding:0}.suffSheetBackdrop.hidden{display:none}.suffSheet{width:min(100%,620px);max-height:78vh;overflow:auto;background:#fff;border-radius:24px 24px 0 0;padding:18px 18px 26px;box-shadow:0 -10px 34px rgba(0,0,0,.14)}.suffSheetHead{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:6px}.suffSheetHead h3{margin:0;font-size:22px}.suffSheetClose{border:1px solid var(--line);background:#fff;border-radius:999px;padding:8px 12px;font-weight:760}.suffSheet .worldDetailBlock{margin-top:12px}.detailWhy{margin-top:12px;padding-top:12px;border-top:1px solid var(--line)}body.suffSheetOpen{overflow:hidden}
@media(max-width:420px){.resultScene{min-height:674px}.shipZone{height:284px}.shipStage{height:204px}.shipVisual{width:min(96%,360px);height:170px}.shipFocus{left:53%;top:58px;width:39%;font-size:clamp(17px,5vw,22px)}.waterBand{height:58px}.mapZone{min-height:332px}.mapStage{gap:9px;min-height:232px}.routeLands1{width:min(92vw,320px)}.routeLands1 .continent{min-height:188px}.routeLands2 .continent,.routeLandsMany .continent{min-height:126px;padding:16px 8px}.continentTitle{font-size:8px}.needNode{font-size:9.5px}.routeLands1 .continent:not(.multiTargets) .continentTitle{left:33%;top:40%;width:45%}.routeLands1 .continent:not(.multiTargets) .needNode{left:47%;top:52%;max-width:48%}}

`;

export const RESULT_WORLD_HTML=`  <section id="result" class="screen result">
    <h1>Pirmas žvilgsnis. Antras atsakymas.</h1>
    <p id="resultLead" class="resultLead"></p>
    <p id="saveStatus" class="note">Sesijos išsaugojimas tikrinamas…</p>

    <div class="resultWorld">
      <div class="resultScene">
        <div id="shipCard" class="sceneZone shipZone">
          <span id="firstLabel" class="sceneEyebrow">Pirmas žvilgsnis</span>
          <span id="firstHeading" class="hidden">Kas iškilo?</span>
          <span class="shipStage">
            <span class="shipVisual" aria-hidden="true">
              <svg viewBox="0 0 360 190" role="img">
                <path class="shipSailShape" d="M182 24 C228 38 274 74 292 126 L182 126 Z"></path>
                <path class="shipMastLine" d="M180 22 L180 132"></path>
                <path class="shipBoomLine" d="M180 126 L293 126"></path>
                <path class="shipHullShape" d="M50 130 C91 132 139 133 184 133 C228 133 275 132 316 130 C308 151 294 163 274 169 C226 177 136 177 88 169 C68 162 57 150 50 130 Z"></path>
                <path class="shipKeelLine" d="M113 171 C151 179 214 179 251 171"></path>
              </svg>
            </span>
            <span id="shipFocus" class="shipFocus"></span>
            <span id="shipPlaceholder" class="hidden">LAIVAS</span>
            <button id="shipDetailsButton" class="sceneDetailButton shipDetailButton" type="button" aria-controls="attentionDetail" aria-expanded="false"><span id="shipTap">Detalės</span></button>
          </span>
        </div>

        <div class="waterBand" aria-hidden="true"></div>

        <div id="mapCard" class="sceneZone mapZone">
          <span class="mapTop">
            <span id="secondLabel" class="sceneEyebrow">Antras atsakymas</span>
            <span id="mapRoute" class="mapRouteSummary"></span>
          </span>
          <span id="secondHeading" class="hidden">Kur dabar mažiausiai pakanka?</span>
          <span id="mapPlaceholder" class="hidden">ŽEMĖLAPIS</span>
          <span id="needsMapStage" class="mapStage"></span>
          <button id="mapDetailsButton" class="sceneDetailButton mapDetailButton" type="button" aria-controls="suffDetail" aria-expanded="false"><span id="mapTap">Detalės</span></button>
        </div>
      </div>

      <div id="attentionDetail" class="worldDetail detailPagePanel hidden">
        <button id="attentionBack" class="detailBack" type="button">← Grįžti į rezultatą</button>
        <h3 id="attentionDetailTitle"></h3>
        <div id="repeatRows" class="rows"></div>
        <p id="attentionNote" class="resultNote hidden"></p>
        <p id="compareLabel" class="perspectiveLabel">Pažiūrėk atidžiau</p>
        <h3 id="compareHeading"></h3>
        <div id="compareRows" class="rows"></div>
        <div class="backgroundDetail">
          <p id="leastLabel" class="perspectiveLabel">Channel A detalė</p>
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
        </section>
      </div>

      <p id="worldSeparationNote" class="worldSeparation"></p>
    </div>

    <div class="actions resultActions"><button id="restart" class="primary">Atlikti dar kartą</button><a id="back2rasi" class="secondary actionLink" href="https://2rasi.lt/#experiments">Grįžti į 2rasi</a><button id="export" class="secondary hidden">Eksportuoti JSON</button></div>
    <p id="exportStatus" class="note hidden"></p>
    <details id="debugDetails" class="perspective hidden"><summary>Tyrimo diagnostika</summary><pre id="debug" class="debug"></pre></details>
  </section>
`;
