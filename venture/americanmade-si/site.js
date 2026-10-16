// americanmade.si shared JS: mobile nav, data center filter, newsletter form
(function () {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () { nav.classList.toggle("open"); });
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      toggle.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
    });
  }
})();

(function () {
  var q = document.getElementById("dc-search");
  var st = document.getElementById("dc-state");
  var table = document.getElementById("dc-table");
  if (!q || !st || !table) return;
  var rows = Array.prototype.slice.call(table.querySelectorAll("tbody tr"));
  var count = document.getElementById("dc-count");
  function apply() {
    var term = (q.value || "").toLowerCase();
    var s = st.value;
    var n = 0;
    rows.forEach(function (r) {
      var okState = !s || r.getAttribute("data-state") === s;
      var okTerm = !term || (r.getAttribute("data-search") || "").toLowerCase().indexOf(term) > -1;
      var ok = okState && okTerm;
      r.style.display = ok ? "" : "none";
      if (ok) n++;
    });
    if (count) count.textContent = n + " of " + rows.length + " projects shown";
  }
  q.addEventListener("input", apply);
  st.addEventListener("change", apply);
})();

// Newsletter form handler. Posts JSON to window.SITE_CONFIG.newsletterEndpoint
// (set in a <script> tag near the bottom of each page). No endpoint = polite
// notice, nothing breaks. See PUBLISH.md for how to get an endpoint.
(function () {
  var form = document.getElementById("newsletter-form");
  if (!form) return;
  var status = document.getElementById("newsletter-status");
  function show(ok, msg) {
    status.className = "form-status " + (ok ? "ok" : "err");
    status.textContent = msg;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = (form.email.value || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      show(false, "Please enter a valid email address.");
      return;
    }
    var cfg = window.SITE_CONFIG || {};
    var endpoint = (cfg.newsletterEndpoint || "").trim();
    if (!endpoint) {
      show(false, "Our signup form is not connected yet. Please check back soon.");
      return;
    }
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email: email, page: window.location.pathname, submitted_at: new Date().toISOString() })
    }).then(function (r) {
      if (r.ok) {
        form.reset();
        show(true, "You are on the list. Watch for one email when the SIF report drops, plus monthly recaps.");
      } else {
        show(false, "Something went wrong. Please try again later.");
      }
    }).catch(function () {
      show(false, "Something went wrong. Please try again later.");
    });
  });
})();
