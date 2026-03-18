// ============================================================
// OMESG360 – Language Switcher (LT / EN)
// ============================================================
// How it works:
//   1. Every HTML element that needs translation has a data-i18n="key" attribute.
//   2. This file holds all translations for every key.
//   3. On page load we read localStorage to remember the chosen language.
//   4. applyLang() swaps the text of every [data-i18n] element.
// ============================================================

const translations = {

  // ── NAVIGATION (shared across all pages) ──────────────────
  "nav.home":          { lt: "Pradžia",        en: "Home" },
  "nav.services":      { lt: "Paslaugos",      en: "Services" },
  "nav.approach":      { lt: "Metodika",       en: "Approach" },
  "nav.esg":           { lt: "ESG ataskaitos", en: "ESG Reports" },
  "nav.about":         { lt: "Apie",           en: "About" },
  "nav.contact":       { lt: "Kontaktai",      en: "Contact" },
  "nav.blog":          { lt: "Įžvalgos",       en: "Insights" },
  "nav.reviews":       { lt: "Atsiliepimai",   en: "Testimonials" },

  // ── FOOTER (shared) ───────────────────────────────────────
  "footer.tagline":    { lt: "Procesų optimizacija gamybai su ESG integracija. Nuo žaliavų iki sandėlio – su žmonėmis ir dėl žmonių.", en: "Process optimisation for manufacturing with ESG integration. From raw materials to warehouse – with people and for people." },
  "footer.contacts":   { lt: "Kontaktai",      en: "Contacts" },
  "footer.legal":      { lt: "Teisinė informacija", en: "Legal" },
  "footer.privacy":    { lt: "Privatumo politika",  en: "Privacy Policy" },

  // ── INDEX PAGE ────────────────────────────────────────────
  "index.hero.h1":     { lt: "Konsultacijos gamybai", en: "Manufacturing Consulting" },
  "index.hero.p":      { lt: "Padedu gamybinėms įmonėms sutvarkyti procesus nuo žaliavų iki sandėlio, įtraukiant žmones ir atitinkant ESG reikalavimus.", en: "I help manufacturing companies organise their processes from raw materials to warehouse, engaging people and meeting ESG requirements." },
  "index.hero.dark":   { lt: "Kodėl šio puslapio fonas tamsus? Dabar kai Jūs tai skaitot – Jūsų telefono AMOLED ekranas naudoja mažiau energijos su dark mode, ypač jei ryškumas nėra maksimalus. Sutaupymas gali būti nuo ~10% iki 30% realiame naudojime.", en: "Why is this page dark? Right now as you read this – your phone's AMOLED screen uses less energy in dark mode, especially when brightness isn't at maximum. Savings can range from ~10% to 30% in real use." },
  "index.hero.btn1":   { lt: "Peržiūrėti paslaugas", en: "View Services" },
  "index.hero.btn2":   { lt: "Susisiekti",     en: "Contact Us" },
  "index.stat1":       { lt: "metai gamyboje", en: "years in manufacturing" },
  "index.stat2":       { lt: "metai vadovaujant", en: "years in leadership" },
  "index.stat3":       { lt: "praktinė patirtis", en: "hands-on experience" },
  "index.value.h2":    { lt: "Vertės pasiūlymas", en: "Value Proposition" },
  "index.card1.h3":    { lt: "Nuo žaliavų iki sandėlio", en: "From Raw Materials to Warehouse" },
  "index.card1.p":     { lt: "Visos srauto grandinės peržiūra: pirkimai, gamyba, kokybė, logistika, sandėlis.", en: "Full value-stream review: purchasing, production, quality, logistics, warehouse." },
  "index.card2.h3":    { lt: "Žmonės", en: "People" },
  "index.card2.p":     { lt: "Darbuotojų įtraukimas, standartizuotas darbas.", en: "Employee engagement, standardised work." },
  "index.card3.h3":    { lt: "ESG integracija", en: "ESG Integration" },
  "index.card3.p":     { lt: "Tvari veikla ir ataskaitos: energija, atliekos, CO₂, sauga, mokymai, valdymas.", en: "Sustainable operations and reports: energy, waste, CO₂, safety, training, governance." },
  "index.process.h2":  { lt: "Kaip dirbame", en: "How We Work" },
  "index.step1":       { lt: "<strong>Diagnozė</strong> – duomenys, srautas, butelio kakleliai (TOC)...", en: "<strong>Diagnosis</strong> – data, flow, bottlenecks (TOC)..." },
  "index.step2":       { lt: "<strong>Stabilizacija</strong> – standartizuotas darbas, 5S, sauga...", en: "<strong>Stabilisation</strong> – standardised work, 5S, safety..." },
  "index.step3":       { lt: "<strong>Optimizacija</strong> – Kaizen, SMED, vizualus valdymas, OEE, Kanban...", en: "<strong>Optimisation</strong> – Kaizen, SMED, visual management, OEE, Kanban..." },
  "index.step4":       { lt: "<strong>Skaitmenizavimas</strong> – paprasti KPI dashboard'ai (Excel/Power BI).", en: "<strong>Digitalisation</strong> – simple KPI dashboards (Excel / Power BI)." },
  "index.step5":       { lt: "<strong>ESG ataskaitos</strong> – duomenų surinkimas ir pateikimas klientams/ES reikalavimams.", en: "<strong>ESG Reports</strong> – data collection and presentation for clients / EU requirements." },
  "index.cta.h2":      { lt: "Pradėkime nuo greito audito", en: "Let's Start with a Quick Audit" },
  "index.cta.p":       { lt: "Per 2–3 savaites pateiksiu aiškų planą su KPI, rizikomis ir greitais laimėjimais.", en: "Within 2–3 weeks I'll deliver a clear plan with KPIs, risks, and quick wins." },
  "index.cta.btn":     { lt: "Rezervuoti pokalbį", en: "Book a Call" },

  // ── SERVICES PAGE ─────────────────────────────────────────
  "services.h1":       { lt: "Paslaugos", en: "Services" },
  "services.s1.h3":    { lt: "Greitas nemokamas auditas (2–3 sav.)", en: "Free Quick Audit (2–3 wks)" },
  "services.s1.li1":   { lt: "Srauto žemėlapis nuo žaliavų iki sandėlio", en: "Value stream map from raw materials to warehouse" },
  "services.s1.li2":   { lt: "Butelio kaklelių identifikavimas (TOC)", en: "Bottleneck identification (TOC)" },
  "services.s1.li3":   { lt: "KPI bazinė linija (OEE, nuostoliai, sauga)", en: "KPI baseline (OEE, losses, safety)" },
  "services.s1.li4":   { lt: "Veiksmų planas 30–60–90 dienų", en: "30–60–90 day action plan" },
  "services.s2.h3":    { lt: "Procesų diegimas (12 savaičių)", en: "Process Implementation (12 weeks)" },
  "services.s2.li1":   { lt: "Darbuotojų apmokymo standartizavimas, 5S, standartizuotas darbas", en: "Training standardisation, 5S, standardised work" },
  "services.s2.li2":   { lt: "SMED, Kanban...", en: "SMED, Kanban..." },
  "services.s2.li3":   { lt: "KPI lentos, kasdienės apžvalgos, AAR", en: "KPI boards, daily reviews, AAR" },
  "services.s2.li4":   { lt: "Pokyčių valdymas su komandomis", en: "Change management with teams" },
  "services.s3.h3":    { lt: "ESG integracija ir ataskaitos (2–3 sav.)", en: "ESG Integration & Reports (2–3 wks)" },
  "services.s3.li1":   { lt: "Duomenų rinkimas: energija, vanduo, atliekos, CO₂", en: "Data collection: energy, water, waste, CO₂" },
  "services.s3.li2":   { lt: "Socialiniai ir valdymo rodikliai: sauga, mokymai, etika", en: "Social & governance indicators: safety, training, ethics" },
  "services.s3.li3":   { lt: "Ataskaitų paruošimas pagal ES reikalavimus", en: "Report preparation per EU requirements" },
  "services.s3.li4":   { lt: "Vizualūs dashboard'ai vadovybei", en: "Visual dashboards for management" },
  "services.s4.h3":    { lt: "Mokymai ir dirbtuvės", en: "Training & Workshops" },
  "services.s4.li1":   { lt: "TOC+LEAN+Six Sigma", en: "TOC+LEAN+Six Sigma" },
  "services.s4.li3":   { lt: "Komandų įgalinimas ir sauga", en: "Team empowerment and safety" },
  "services.s4.li4":   { lt: "Vadovų įgūdžiai: ryšiai, grįžtamasis ryšys", en: "Leadership skills: communication, feedback" },
  "services.s4.li5":   { lt: "Praktiniai šablonai ir protokolai", en: "Practical templates and protocols" },

  // ── APPROACH PAGE ─────────────────────────────────────────
  "approach.h1":       { lt: "Metodika", en: "Approach" },
  "approach.p":        { lt: "Sujungiame <strong>TOC</strong> butelio kaklelių valdymą, <strong>LEAN + Six Sigma</strong> nuostolių mažinimą, kokybės gerinimą ir <strong>Organizacijos kultūra</strong> žmonių įgalinimą, kad pasiektume tvarią, saugią ir efektyvią gamybą.", en: "We combine <strong>TOC</strong> bottleneck management, <strong>LEAN + Six Sigma</strong> waste reduction and quality improvement, and <strong>Organisational Culture</strong> people empowerment to achieve sustainable, safe, and efficient manufacturing." },
  "approach.c1.h3":    { lt: "Žmonės pirma", en: "People First" },
  "approach.c1.p":     { lt: "žmonių apmokymo struktūra – pagarba, aiškumas ir nuoseklumas.", en: "A people-training structure built on respect, clarity, and consistency." },
  "approach.c2.h3":    { lt: "Duomenys ir srautas", en: "Data & Flow" },
  "approach.c2.p":     { lt: "VSM + TOC, KPI, OEE, taktinis ir operatyvinis valdymas per kasdienes apžvalgas.", en: "VSM + TOC, KPI, OEE, tactical and operational management through daily reviews." },
  "approach.c3.h3":    { lt: "PDCA ir DIMAC disciplina", en: "PDCA & DMAIC Discipline" },
  "approach.c3.p":     { lt: "Plan–Do–Check–Act ciklas su AAR ir vizualiais valdymo įrankiais DIMAC gilioms, įsišaknijusioms problemoms spręsti.", en: "Plan–Do–Check–Act cycle with AAR and visual management tools; DMAIC for deep-rooted problems." },

  // ── ESG PAGE ──────────────────────────────────────────────
  "esg.h1":            { lt: "ESG ataskaitos", en: "ESG Reports" },
  "esg.p":             { lt: "Padedame sisteminti ir pateikti ESG duomenis – aiškiai, patikimai ir naudingai vadovybei.", en: "We help systematise and present ESG data – clearly, reliably, and usefully for management." },
  "esg.e.h3":          { lt: "Aplinkos (E)", en: "Environmental (E)" },
  "esg.e.p":           { lt: "Energijos suvartojimas, atliekos, vanduo, CO₂. Duomenų rinkimo protokolai ir dashboard'ai.", en: "Energy consumption, waste, water, CO₂. Data collection protocols and dashboards." },
  "esg.s.h3":          { lt: "Socialiniai (S)", en: "Social (S)" },
  "esg.s.p":           { lt: "Sauga, mokymų valandos, darbuotojų įsitraukimas, incidentai ir prevencija.", en: "Safety, training hours, employee engagement, incidents and prevention." },
  "esg.g.h3":          { lt: "Valdymas (G)", en: "Governance (G)" },
  "esg.g.p":           { lt: "Etikos politika, atitiktis, tiekėjų vertinimas, rizikų valdymas.", en: "Ethics policy, compliance, supplier assessment, risk management." },
  "esg.note":          { lt: "<em>Pastaba:</em> ataskaitos pritaikomos pagal kliento reikalavimus ir galiojančius ES standartus.", en: "<em>Note:</em> reports are tailored to client requirements and applicable EU standards." },

  // ── ABOUT PAGE ────────────────────────────────────────────
  "about.h1":          { lt: "Apie Oleg Mozochin", en: "About Oleg Mozochin" },
  "about.p":           { lt: "Esu INTJ-A, pAEI tipo žmogus su 27+ metų patirtimi gamyboje. Nuo operatoriaus iki pamainos vadovo. 26 metų vadovavimo, praktinė TOC, LEAN, Six Sigma patirtis ir realūs rezultatai.", en: "I am INTJ-A, pAEI type with 27+ years of manufacturing experience – from operator to shift manager. 26 years in leadership with hands-on TOC, LEAN, Six Sigma practice and real results." },
  "about.li1":         { lt: "Patirtis plasitkinių pakuočių gamyboje", en: "Experience in plastic packaging manufacturing" },
  "about.li2":         { lt: "Komandų formavimas ir mokymai", en: "Team building and training" },
  "about.li3":         { lt: "Procesų stabilizavimas ir optimizavimas", en: "Process stabilisation and optimisation" },
  "about.li4":         { lt: "ESG duomenų surinkimas ir ataskaitos", en: "ESG data collection and reporting" },

  // ── CONTACT PAGE ──────────────────────────────────────────
  "contact.h1":        { lt: "Kontaktai", en: "Contact" },
  "contact.p":         { lt: "Užpildykite formą ir susisieksiu per 1–2 darbo dienas.", en: "Fill in the form and I'll get back to you within 1–2 working days." },
  "contact.name":      { lt: "Vardas ir pavardė", en: "Full name" },
  "contact.name.ph":   { lt: "Jūsų vardas", en: "Your name" },
  "contact.email.ph":  { lt: "jusu@imone.lt", en: "you@company.com" },
  "contact.company":   { lt: "Įmonė", en: "Company" },
  "contact.company.ph":{ lt: "Įmonės pavadinimas", en: "Company name" },
  "contact.msg":       { lt: "Žinutė", en: "Message" },
  "contact.msg.ph":    { lt: "Trumpai apibūdinkite poreikį", en: "Briefly describe your need" },
  "contact.send":      { lt: "Siųsti", en: "Send" },
  "contact.or":        { lt: "Arba rašykite tiesiogiai:", en: "Or write directly:" },

  // ── BLOG PAGE ─────────────────────────────────────────────
  "blog.h1":           { lt: "Įžvalgos", en: "Insights" },
  "blog.p":            { lt: "Dalinuosi pamokomis iš 27 metų gamyboje: sauga, komandos, procesai, ESG...", en: "Sharing lessons from 27 years in manufacturing: safety, teams, processes, ESG..." },
  "blog.a1.h3":        { lt: "#1 – Nuo operatoriaus iki pamainos vadovo", en: "#1 – From Operator to Shift Manager" },
  "blog.a1.p":         { lt: "Autentiška kelionė, pamokos ir praktika, kurią taikau konsultacijose.", en: "An authentic journey, lessons, and practice I apply in consulting." },

  // ── TESTIMONIALS PAGE ─────────────────────────────────────
  "reviews.h1":        { lt: "Atsiliepimai", en: "Testimonials" },
  "reviews.p":         { lt: "Autentiškos mūsų klientų ir partnerių patirtys.", en: "Authentic experiences from our clients and partners." },
  "reviews.h2":        { lt: "Ką sako klientai", en: "What Clients Say" },
  "reviews.c1.h3":     { lt: "Neužilgo", en: "Coming soon" },
  "reviews.c1.p":      { lt: ".....", en: "....." },
  "reviews.cta.h2":    { lt: "Norite sužinoti daugiau?", en: "Want to Find Out More?" },
  "reviews.cta.p":     { lt: "Susisiekite ir trumpai aptarsime jūsų situaciją. Pateiksiu aiškų veiksmų planą su KPI ir greitais laimėjimais.", en: "Get in touch and we'll briefly discuss your situation. I'll provide a clear action plan with KPIs and quick wins." },
  "reviews.cta.btn":   { lt: "Rezervuoti pokalbį", en: "Book a Call" },

  // ── PRIVACY PAGE ──────────────────────────────────────────
  "privacy.h1":        { lt: "Privatumo politika", en: "Privacy Policy" },
  "privacy.intro":     { lt: "Ši privatumo politika taikoma OM ESG360 teikiamoms paslaugoms Europos Sąjungoje ir reglamentuoja, kaip tvarkome asmens duomenis pagal Bendrąjį duomenų apsaugos reglamentą (GDPR).", en: "This privacy policy applies to services provided by OM ESG360 in the European Union and governs how we process personal data under the General Data Protection Regulation (GDPR)." },
  "privacy.s1.h2":     { lt: "1. Įvadas", en: "1. Introduction" },
  "privacy.s1.p":      { lt: "Mes gerbiame jūsų privatumą ir įsipareigojame saugoti jūsų asmens duomenis. Ši politika paaiškina, kokius duomenis renkame, kaip juos naudojame ir kokias teises turite.", en: "We respect your privacy and are committed to protecting your personal data. This policy explains what data we collect, how we use it, and what rights you have." },
  "privacy.s2.h2":     { lt: "2. Kokius duomenis renkame", en: "2. Data We Collect" },
  "privacy.s2.li1":    { lt: "Vardas ir pavardė", en: "Full name" },
  "privacy.s2.li2":    { lt: "El. pašto adresas", en: "Email address" },
  "privacy.s2.li3":    { lt: "Įmonės pavadinimas", en: "Company name" },
  "privacy.s2.li4":    { lt: "Žinutės turinys (kontaktų forma)", en: "Message content (contact form)" },
  "privacy.s3.h2":     { lt: "3. Kaip naudojame duomenis", en: "3. How We Use Data" },
  "privacy.s3.p":      { lt: "Jūsų duomenis naudojame tik šiais tikslais:", en: "We use your data only for the following purposes:" },
  "privacy.s3.li1":    { lt: "Atsakyti į jūsų užklausas", en: "Responding to your enquiries" },
  "privacy.s3.li2":    { lt: "Parengti pasiūlymus ir teikti paslaugas", en: "Preparing proposals and providing services" },
  "privacy.s3.li3":    { lt: "Užtikrinti teisinių reikalavimų laikymąsi", en: "Ensuring compliance with legal requirements" },
  "privacy.s4.h2":     { lt: "4. Teisinis pagrindas", en: "4. Legal Basis" },
  "privacy.s4.p":      { lt: "Duomenis tvarkome remdamiesi jūsų sutikimu arba sutarties vykdymu pagal GDPR.", en: "We process data based on your consent or contract performance under GDPR." },
  "privacy.s5.h2":     { lt: "5. Duomenų saugojimo laikotarpis", en: "5. Retention Period" },
  "privacy.s5.p":      { lt: "Jūsų duomenis saugome ne ilgiau kaip 12 mėnesių po užklausos išsprendimo, nebent teisės aktai numato kitaip.", en: "We retain your data for no longer than 12 months after the enquiry is resolved, unless legislation requires otherwise." },
  "privacy.s6.h2":     { lt: "6. Duomenų saugumas", en: "6. Data Security" },
  "privacy.s6.p":      { lt: "Naudojame technines ir organizacines priemones, kad apsaugotume jūsų duomenis nuo neteisėtos prieigos, praradimo ar atskleidimo.", en: "We use technical and organisational measures to protect your data from unauthorised access, loss, or disclosure." },
  "privacy.s7.h2":     { lt: "7. Jūsų teisės", en: "7. Your Rights" },
  "privacy.s7.p":      { lt: "Pagal GDPR turite teisę:", en: "Under GDPR you have the right to:" },
  "privacy.s7.li1":    { lt: "Gauti informaciją apie tvarkomus duomenis", en: "Receive information about processed data" },
  "privacy.s7.li2":    { lt: "Ištaisyti netikslius duomenis", en: "Rectify inaccurate data" },
  "privacy.s7.li3":    { lt: "Pareikalauti ištrinti duomenis", en: "Request erasure of data" },
  "privacy.s7.li4":    { lt: "Apriboti duomenų tvarkymą", en: "Restrict processing of data" },
  "privacy.s7.li5":    { lt: "Perleisti duomenis kitam valdytojui", en: "Transfer data to another controller" },
  "privacy.s8.h2":     { lt: "8. Kontaktai", en: "8. Contact" },
  "privacy.s8.p":      { lt: "Klausimams dėl privatumo kreipkitės el. paštu:", en: "For privacy enquiries, please contact us by email:" },
};

// ── Core switcher logic ────────────────────────────────────

function applyLang(lang) {
  // Update every element that carries a data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] && translations[key][lang] !== undefined) {
      // Use innerHTML so <strong> tags inside translations render correctly
      el.innerHTML = translations[key][lang];
    }
  });

  // Also update placeholder attributes (inputs / textareas)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key] && translations[key][lang] !== undefined) {
      el.placeholder = translations[key][lang];
    }
  });

  // Reflect current language on <html> tag
  document.documentElement.lang = lang;

  // Highlight active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Remember choice
  localStorage.setItem('lang', lang);
}

function initLangSwitcher() {
  const savedLang = localStorage.getItem('lang') || 'lt';
  applyLang(savedLang);

  // Wire up all language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
}

// Run after DOM is ready — works whether script loads before or after DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLangSwitcher);
} else {
  initLangSwitcher();
}
