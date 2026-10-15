/* VIGNOVATE — honest contact form.
   - If CONFIG.formEndpoint is set, the form is posted to that provider and success is shown only on a confirmed response.
   - Otherwise the visitor's email app (or WhatsApp) opens with the message prefilled. Nothing is "sent" until the visitor sends it there. */
(function () {
  'use strict';
  var C = window.VIGNOVATE_CONFIG || { email: 'vignovate@gmail.com', whatsapp: '918974016672', formEndpoint: '' };
  var form = document.getElementById('contactForm');
  if (!form) return;
  var status = document.getElementById('formStatus');
  function say(t) { if (status) status.textContent = t; }
  function val(n) { var el = form.elements[n]; return el ? (el.value || '').trim() : ''; }

  var q = new URLSearchParams(location.search).get('service');
  if (q && form.elements.service) {
    for (var i = 0; i < form.elements.service.options.length; i++) {
      if (form.elements.service.options[i].value === q) form.elements.service.selectedIndex = i;
    }
  }

  function validate() {
    var ok = true;
    form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('invalid'); });
    ['name', 'email', 'service', 'message'].forEach(function (n) {
      var el = form.elements[n];
      if (!el || !el.checkValidity()) { ok = false; if (el) { el.closest('.field').classList.add('invalid'); el.setAttribute('aria-invalid', 'true'); } }
      else if (el) el.removeAttribute('aria-invalid');
    });
    var c = form.elements.consent;
    if (c && !c.checked) { ok = false; c.closest('.field').classList.add('invalid'); }
    if (!ok) { var firstBad = form.querySelector('.invalid input, .invalid select, .invalid textarea'); if (firstBad) firstBad.focus(); say('Please complete the highlighted fields.'); }
    return ok;
  }
  function text() {
    return 'Hello VIGNOVATE,\n\nName: ' + val('name') + '\nEmail: ' + val('email') + '\nCompany / project: ' + (val('company') || '-') +
      '\nService of interest: ' + val('service') + '\nEstimated budget: ' + (val('budget') || '-') + '\n\nProject description:\n' + val('message');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    if (C.formEndpoint) {
      say('Sending…');
      fetch(C.formEndpoint, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ name: val('name'), email: val('email'), company: val('company'), service: val('service'), budget: val('budget'), message: val('message') }) })
        .then(function (r) { if (!r.ok) throw new Error('bad status'); say('Thank you. Your enquiry was received and we will reply by email.'); form.reset(); })
        .catch(function () { say('We could not send your enquiry from this page. Please use the email or WhatsApp buttons instead.'); });
      return;
    }
    var url = 'mailto:' + C.email + '?subject=' + encodeURIComponent('Project enquiry: ' + val('service') + ' (' + val('name') + ')') + '&body=' + encodeURIComponent(text());
    say('Your email app should open with the message ready. Nothing has been sent until you press send there. If nothing opens, email ' + C.email + ' or use WhatsApp.');
    window.location.href = url;
  });

  var wa = document.getElementById('waSend');
  if (wa) wa.addEventListener('click', function () {
    if (!validate()) return;
    window.open('https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(text()), '_blank', 'noopener');
    say('WhatsApp opened in a new tab with your message ready to send.');
  });
})();
