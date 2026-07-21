/* Launchly — Course Sales-Page Conversion-Readiness Audit engine (client-side, zero cost)
 * Scores a course / digital-product sales page on the seven signals that decide
 * conversion: headline & outcome, pain hook, social proof, benefit clarity,
 * CTA strength, pricing & packaging, and SEO / keyword targeting.
 * Weights sum to 100. All logic runs in-browser; no network calls for scoring.
 */
(function () {
  "use strict";


  // ---- centralized audit counter (fire-and-forget) ----
  var COUNTER_NS = "launchly-ai";
  function trackAudit() {
    try {
      fetch("https://api.counterapi.dev/v1/" + COUNTER_NS + "/audit_completed/up", {
        method: "GET",
        mode: "cors",
        cache: "no-store"
      });
    } catch (e) {}
  }
  var form = document.getElementById("auditForm");
  var result = document.getElementById("auditResult");
  var heroScore = document.getElementById("heroScore");
  var heroGrade = document.getElementById("heroGrade");

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function gradeFor(score) {
    if (score >= 85) return { g: "A", color: "var(--good)" };
    if (score >= 70) return { g: "B", color: "var(--brand)" };
    if (score >= 55) return { g: "C", color: "var(--warn)" };
    return { g: "D", color: "var(--bad)" };
  }

  // ---- scoring ----
  function scorePage(input) {
    var tips = [];
    var dims = {};

    // 1) Headline & outcome (15)
    var hlen = (input.headline || "").trim().length;
    var sHead;
    if (input.outcome === "yes") { sHead = 15; if (hlen < 12) tips.push("Your headline promises an outcome but is short — add a number or timeframe (e.g. 'in 30 days') to make it concrete."); }
    else if (input.outcome === "partial") { sHead = 10; tips.push("Your headline hints at a benefit but isn't specific. Name the exact result the buyer gets (role, skill, outcome)."); }
    else { sHead = 5; tips.push("Your headline just names the topic. Rewrite it to promise a specific outcome the buyer wants — that single change lifts conversion most."); }
    if (hlen > 90) tips.push("Headlines over ~90 chars get cut in search and ads. Tighten to one punchy promise.");
    dims["Headline & outcome"] = { score: sHead, max: 15 };

    // 2) Pain hook (13)
    var sPain;
    if (input.pain === "yes") { sPain = 13; }
    else if (input.pain === "sometimes") { sPain = 8; tips.push("You sometimes open with the buyer's problem. Lead every page with the pain they feel today, then pitch the fix."); }
    else { sPain = 4; tips.push("You jump straight to features. Open with the specific problem your buyer is stuck on — pain first, pitch second."); }
    dims["Pain hook"] = { score: sPain, max: 13 };

    // 3) Social proof (15)
    var sProof;
    if (input.proof === "strong") { sProof = 15; }
    else if (input.proof === "some") { sProof = 10; tips.push("A few testimonials help, but add real numbers (results, before/after) — specificity is what kills doubt."); }
    else { sProof = 5; tips.push("No social proof yet. Even one specific result or student quote dramatically lifts trust. Add it above the fold."); }
    dims["Social proof"] = { score: sProof, max: 15 };

    // 4) Benefit clarity (13)
    var sBen;
    if (input.benefit === "yes") { sBen = 13; }
    else if (input.benefit === "partial") { sBen = 8; tips.push("Mix feature and benefit copy. Reframe each feature as a buyer outcome ('so you can…')."); }
    else { sBen = 4; tips.push("Your page reads like a feature list. Buyers buy outcomes — rewrite bullets as the result each feature delivers."); }
    dims["Benefit clarity"] = { score: sBen, max: 13 };

    // 5) CTA strength (14)
    var sCta;
    if (input.cta === "yes") { sCta = 14; }
    else if (input.cta === "sometimes") { sCta = 9; tips.push("Competing CTAs dilute action. Give the page one job and repeat that single ask."); }
    else { sCta = 4; tips.push("No clear above-the-fold CTA. Put one obvious, action-led button ('Get the course') where the eye lands first."); }
    dims["CTA strength"] = { score: sCta, max: 14 };

    // 6) Pricing & packaging (15)
    var sPrice;
    if (input.price === "freepaid") { sPrice = 15; }
    else if (input.price === "tiers") { sPrice = 14; }
    else if (input.price === "single") { sPrice = 10; tips.push("A single price works, but a free lead-magnet + paid tier builds the funnel that compounds — and lifts paid conversion."); }
    else { sPrice = 5; tips.push("Unclear or hidden pricing kills trust. Show the price plainly; $30–49 converts 28% better than under-$10 for info products."); }
    dims["Pricing & packaging"] = { score: sPrice, max: 15 };

    // 7) SEO / keyword targeting (15)
    var sSeo;
    if (input.seo === "yes") { sSeo = 15; }
    else if (input.seo === "partial") { sSeo = 10; tips.push("You loosely target a keyword. Pick one clear search intent and put it in the title, H1, and first paragraph."); }
    else { sSeo = 5; tips.push("Your page isn't optimized for search. Pick the one phrase buyers search ('[topic] course') and weave it into title + H1."); }
    dims["SEO & keyword"] = { score: sSeo, max: 15 };

    var total = sHead + sPain + sProof + sBen + sCta + sPrice + sSeo;
    if (tips.length === 0) tips.push("Strong page across the board — now A/B test your headline and CTA as traffic grows.");
    return { total: total, dims: dims, tips: tips };
  }

  // ---- render ----
  function ring(el, score) {
    var deg = (score / 100) * 360;
    el.style.background = "conic-gradient(var(--brand) " + deg + "deg, #e6e6f4 " + deg + "deg)";
  }

  function render(res) {
    var gr = gradeFor(res.total);
    document.getElementById("resScore").textContent = res.total;
    var gEl = document.getElementById("resGrade");
    gEl.textContent = "Grade " + gr.g;
    gEl.style.background = gr.color;
    gEl.style.color = "#fff";
    document.getElementById("resSummary").textContent =
      res.total >= 85 ? "Top-decile page — minor tweaks only."
      : res.total >= 70 ? "Good foundation, a few quick wins left."
      : res.total >= 55 ? "Workable, but leaving sales on the table."
      : "Needs real work before it can convert.";

    ring(document.querySelector("#auditResult .score-ring"), res.total);

    var bars = document.getElementById("resBars");
    bars.innerHTML = "";
    Object.keys(res.dims).forEach(function (k) {
      var d = res.dims[k];
      var pct = Math.round((d.score / d.max) * 100);
      var row = document.createElement("div");
      row.className = "bar-row";
      row.innerHTML =
        '<span>' + k + '</span>' +
        '<span class="bar-track"><span class="bar-fill" style="width:' + pct + '%"></span></span>' +
        '<span class="bar-val">' + d.score + '/' + d.max + '</span>';
      bars.appendChild(row);
    });

    var tipsEl = document.getElementById("resTips");
    tipsEl.innerHTML = "";
    res.tips.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      tipsEl.appendChild(li);
    });

    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var res = scorePage({
      headline: document.getElementById("fHeadline").value,
      outcome: document.getElementById("fOutcome").value,
      pain: document.getElementById("fPain").value,
      proof: document.getElementById("fProof").value,
      benefit: document.getElementById("fBenefit").value,
      cta: document.getElementById("fCta").value,
      price: document.getElementById("fPrice").value,
      seo: document.getElementById("fSeo").value
    });
    render(res);
    trackAudit();
  });

  // hero demo score (static illustrative until user runs audit)
  heroScore.textContent = 64;
  heroGrade.textContent = "C";

  // ---- email capture (Formspree free tier, graceful demo fallback) ----
  var emailForm = document.getElementById("emailForm");
  var FORMSPREE_ID = "meeyzkdp"; // free form ID from formspree.io (no payment)
  emailForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("fEmail").value;
    var note = document.getElementById("emailNote");
    if (FORMSPREE_ID.indexOf("YOUR_") === 0) {
      try {
        var store = JSON.parse(localStorage.getItem("launchly_leads") || "[]");
        store.push({ email: email, ts: new Date().toISOString() });
        localStorage.setItem("launchly_leads", JSON.stringify(store));
      } catch (err) {}
      note.textContent = "✓ Demo mode: lead saved locally (" + email + "). Add a free Formspree ID to receive real emails.";
      note.style.color = "var(--good)";
    } else {
      fetch("https://formspree.io/f/" + FORMSPREE_ID, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, subject: "Launchly audit lead", source: "Launchly landing" })
      })
        .then(function (r) {
          if (r.ok) { note.textContent = "✓ Subscribed! We'll email you launch + conversion tips."; note.style.color = "var(--good)"; }
          else { note.textContent = "Couldn't send — try again or email us."; note.style.color = "var(--bad)"; }
        })
        .catch(function () { note.textContent = "Couldn't send — try again or email us."; note.style.color = "var(--bad)"; });
    }
    emailForm.reset();
  });
})();
