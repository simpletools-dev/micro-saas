// Quote form handler.
// The form POSTs JSON to window.SITE_CONFIG.formEndpoint (set in a <script> tag
// near the bottom of each page). The endpoint is a Google Apps Script web app
// that emails each lead. The request uses no-cors + text/plain so it works
// from the static site without a CORS preflight; the response is opaque, so
// success is assumed once the request resolves.
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
      show(false, "Thanks — our online form isn't switched on yet. Please tap the call button above and we'll take your details by phone.");
      return;
    }
    fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(data)
    }).then(function () {
      form.reset();
      show(true, "Request received — we'll call you back shortly to confirm your appointment window.");
    }).catch(function () {
      show(false, "Something went wrong sending your request. Please call us instead — tap the call button above.");
    });
  });
})();
