// Quote form handler — front-end only.
// The form POSTs JSON to window.SITE_CONFIG.formEndpoint (set in a <script> tag
// near the bottom of each page). See README.md for where to get an endpoint
// (e.g. a free form-backend service). No endpoint = polite error, nothing breaks.
(function () {
  var form = document.getElementById("quote-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var cfg = window.SITE_CONFIG || {};
    var endpoint = (cfg.formEndpoint || "").trim();
    var data = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      service: form.service.value,
      area: form.area ? form.area.value : "",
      details: form.details.value.trim(),
      page: window.location.pathname,
      submitted_at: new Date().toISOString()
    };
    function show(ok, msg) {
      status.className = "form-status " + (ok ? "ok" : "err");
      status.textContent = msg;
    }
    if (!data.name || !data.phone) {
      show(false, "Please add your name and a callback number so we can reach you.");
      return;
    }
    if (!endpoint) {
      show(false, "Thanks — our online form isn't switched on yet. Please try again in a moment.");
      return;
    }
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (r.ok) {
        form.reset();
        show(true, "Request received — we'll call you back shortly to confirm your appointment window.");
      } else {
        show(false, "Something went wrong sending your request. Please try again in a moment.");
      }
    }).catch(function () {
      show(false, "Something went wrong sending your request. Please try again in a moment.");
    });
  });
})();
