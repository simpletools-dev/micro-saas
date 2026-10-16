// americausa.si shared site JS
(function(){
  // State explorer filtering (index page)
  var grid = document.getElementById('state-grid');
  if(grid){
    var search = document.getElementById('state-search');
    var tierSel = document.getElementById('tier-filter');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.state-card'));
    var empty = document.getElementById('no-results');
    function apply(){
      var q = search.value.trim().toLowerCase();
      var t = tierSel.value;
      var n = 0;
      cards.forEach(function(c){
        var okName = !q || c.getAttribute('data-name').indexOf(q) !== -1;
        var okTier = !t || c.getAttribute('data-tier') === t;
        var ok = okName && okTier;
        c.style.display = ok ? '' : 'none';
        if(ok){ n++; }
      });
      if(empty){ empty.style.display = n ? 'none' : 'block'; }
    }
    search.addEventListener('input', apply);
    tierSel.addEventListener('change', apply);
  }

  // Newsletter forms: post to window.SITE_CONFIG.newsletterEndpoint
  var forms = document.querySelectorAll('form.newsletter-form');
  Array.prototype.forEach.call(forms, function(f){
    f.addEventListener('submit', function(ev){
      ev.preventDefault();
      var input = f.querySelector('input[type="email"]');
      var msg = f.querySelector('.form-msg');
      var email = input.value.trim();
      var endpoint = (window.SITE_CONFIG && window.SITE_CONFIG.newsletterEndpoint) || '';
      function say(t){ if(msg){ msg.textContent = t; } }
      if(!email){ say('Please enter your email address.'); input.focus(); return; }
      if(endpoint.indexOf('{{NEWSLETTER_ENDPOINT}}') !== -1 || !endpoint){
        say('Thanks for your interest. Newsletter signup opens soon, please check back shortly.');
        return;
      }
      say('Subscribing...');
      fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: email})
      }).then(function(r){
        if(!r.ok){ throw new Error('request failed'); }
        say('You are on the list. Welcome to the SI Era.');
        f.reset();
      }).catch(function(){
        say('Something went wrong. Please try again later.');
      });
    });
  });
})();
