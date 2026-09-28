// Quote form handler v2.
// Submits the lead as a classic url-encoded form POST into a hidden iframe.
// This is the most reliable way to reach a Google Apps Script web app from a
// static page: the browser follows Google's redirect chain with the body
// intact, and there is no CORS preflight. The iframe load event confirms the
// round trip completed.
(function () {
  var form = document.getElementById("quote-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var cfg = window.SITE_CONFIG || {};
    var endpoint = (cfg.formEndpoint || "").trim();
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    function show(ok, msg) {
      status.className = "form-status " + (ok ? "ok" : "err");
      status.textContent = msg;
    }
    if (!name || !phone) {
      show(false, "Please add your name and a callback number so we can reach you.");
      return;
    }
    if (!endpoint) {
      show(false, "Thanks — our online form isn't switched on yet. Please tap the call button above and we'll take your details by phone.");
      return;
    }
    // Build a hidden iframe + form and submit it.
    var iframeName = "lead-iframe-" + Date.now();
    var iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.style.display = "none";
    var done = false;
    iframe.addEventListener("load", function () {
      if (done) return;
      done = true;
      form.reset();
      show(true, "Request received — we'll call you back shortly to confirm your appointment window.");
      setTimeout(function () { iframe.remove(); }, 5000);
    });
    document.body.appendChild(iframe);
    var f = document.createElement("form");
    f.method = "POST";
    f.action = endpoint;
    f.target = iframeName;
    f.style.display = "none";
    var fields = {
      name: name,
      phone: phone,
      service: form.service.value,
      area: form.area ? form.area.value : "",
      details: form.details.value.trim(),
      page: window.location.pathname,
      submitted_at: new Date().toISOString()
    };
    Object.keys(fields).forEach(function (k) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = fields[k];
      f.appendChild(input);
    });
    document.body.appendChild(f);
    f.submit();
    // Safety net: if the iframe never loads (blocked?), show the call fallback.
    setTimeout(function () {
      if (!done) {
        show(false, "Something went wrong sending your request. Please call us instead — tap the call button above.");
        iframe.remove(); f.remove();
      }
    }, 15000);
  });
})();
