// ── Section visibility ─────────────────────────────────────────────────────
function handleTypChange(val) {
  document.getElementById('section-pp').classList.remove('active');
  document.getElementById('section-kein').classList.remove('active');
  document.getElementById('submit-section').style.display = 'none';

  if (['neu', 'verlaengert', 'mutation'].includes(val)) {
    document.getElementById('section-pp').classList.add('active');
    document.getElementById('submit-section').style.display = 'block';
  } else if (val === 'kein') {
    document.getElementById('section-kein').classList.add('active');
    document.getElementById('submit-section').style.display = 'block';
  }
}

// ── Custom checkbox tiles ──────────────────────────────────────────────────
// Intercept clicks on .check-item labels, manually toggle the checkbox and
// update the visual .is-checked class. Prevents any double-fire edge cases
// from browser-native label<->checkbox association.
document.addEventListener('click', function (e) {
  const tile = e.target.closest('.check-item');
  if (!tile) return;

  // Prevent the browser from firing a second synthetic click on the checkbox
  e.preventDefault();

  const cb = tile.querySelector('input[type=checkbox]');
  if (!cb) return;

  cb.checked = !cb.checked;
  tile.classList.toggle('is-checked', cb.checked);
});

// ── Validation helpers ─────────────────────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('show', show);
}

function markField(id, hasError) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('error', hasError);
}

// ── Submit ─────────────────────────────────────────────────────────────────
function handleSubmit() {
  const typ = document.getElementById('antrag-typ').value;
  let valid = true;

  if (['neu', 'verlaengert', 'mutation'].includes(typ)) {

    // Standort – at least one must be checked
    const standorte = document.querySelectorAll('input[name=standort]:checked');
    const noStandort = standorte.length === 0;
    setError('err-standort', noStandort);
    if (noStandort) valid = false;

    // Datum
    const datum = document.getElementById('datum').value;
    markField('datum', !datum);
    if (!datum) valid = false;

    // Beschäftigungsgrad
    const bgVal = document.getElementById('beschaeftigung').value;
    const bg = parseInt(bgVal, 10);
    const bgErr = bgVal === '' || isNaN(bg) || bg < 0 || bg > 100;
    markField('beschaeftigung', bgErr);
    setError('err-beschaeftigung', bgErr);
    if (bgErr) valid = false;

    // Name / Vorname
    const name = document.getElementById('name').value.trim();
    const vorname = document.getElementById('vorname').value.trim();
    markField('name', !name);
    markField('vorname', !vorname);
    if (!name || !vorname) valid = false;

    // E-Mail
    const email = document.getElementById('email').value.trim();
    const emailErr = !validateEmail(email);
    markField('email', emailErr);
    setError('err-email', emailErr);
    if (emailErr) valid = false;

    // Funktion
    const funktion = document.getElementById('funktion').value.trim();
    markField('funktion', !funktion);
    if (!funktion) valid = false;

    // Abteilung
    const abt = document.getElementById('abteilung').value.trim();
    markField('abteilung', !abt);
    if (!abt) valid = false;

  } else if (typ === 'kein') {

    // Mobilitätsbonus confirmation
    const confirmed = document.getElementById('confirm-cb').checked;
    setError('err-confirm', !confirmed);
    if (!confirmed) valid = false;

  }

  if (!valid) return;

  // All good – show success state
  document.getElementById('main-form').classList.add('hidden');
  document.getElementById('success-card').classList.add('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
