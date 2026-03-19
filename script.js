// ── Standort data ────────────────────────────────────────────────────────────
// options with length > 1 → sub-selection tiles are shown
const STANDORT_DATA = {
  'Heerbrugg': {
    mapQ: 'Schlosstrasse+203a+9435+Heerbrugg+Switzerland',
    options: [
      { value: 'Heerbrugg Schloss', label: 'Schloss / Schlosstr. 203a', price: 'CHF 720.– / Jahr' },
      { value: 'Heerbrugg Erlen',   label: 'Erlen / Bahnhofstr. 18',   price: 'CHF 720.– / Jahr' }
    ]
  },
  'Pfäfers': {
    mapQ: 'Psychiatrische+Klinik+Pfäfers+7312',
    options: [
      { value: 'Pfäfers aussen',        label: 'Parkplatz aussen', price: 'CHF 120.– / Jahr' },
      { value: 'Pfäfers Unterstand B3', label: 'Unterstand B3',    price: 'CHF 480.– / Jahr' },
      { value: 'Pfäfers Tiefgarage',    label: 'Tiefgarage',       price: 'CHF 600.– / Jahr' }
    ]
  },
  'Rapperswil': {
    mapQ: 'Psychiatrische+Klinik+Rapperswil+SG',
    options: [
      { value: 'Rapperswil', label: 'Rapperswil', price: 'CHF 720.– / Jahr' }
    ]
  },
  'Rorschach': {
    mapQ: 'Psychiatrie+Rorschach+SG',
    options: [
      { value: 'Rorschach', label: 'Rorschach', price: 'CHF 720.– / Jahr' }
    ]
  },
  'Sargans': {
    mapQ: 'Psychiatrie+Sargans+SG',
    options: [
      { value: 'Sargans', label: 'Sargans (geteilt)', price: 'CHF 720.– / Jahr' }
    ]
  },
  'St.Gallen': {
    mapQ: 'Psychiatrie+St.Gallen+Rorschacher+Strasse+69',
    options: [
      { value: 'St.Gallen', label: 'St.Gallen', price: 'CHF 720.– / Jahr' }
    ]
  },
  'Uznach': {
    mapQ: 'Psychiatrie+Uznach+SG',
    options: [
      { value: 'Uznach', label: 'Uznach', price: 'CHF 660.– / Jahr' }
    ]
  },
  'Wattwil': {
    mapQ: 'Spital+Wattwil+SG',
    options: [
      { value: 'Wattwil', label: 'Wattwil', price: 'CHF 720.– / Jahr' }
    ]
  },
  'Wil': {
    mapQ: 'Psychiatrische+Dienste+Wil+SG',
    options: [
      { value: 'Wil P2/P3', label: 'P2 / P3 (geteilt)',  price: 'CHF 450.– / Jahr' },
      { value: 'Wil P1',    label: 'P1 bei C05 / A02', price: 'CHF 600.– / Jahr' }
    ]
  }
};

// ── Section visibility ────────────────────────────────────────────────────────
function handleTypChange(val) {
  document.getElementById('section-pp').classList.remove('active');
  document.getElementById('submit-section').style.display = 'none';

  if (val === 'neu') {
    document.getElementById('section-pp').classList.add('active');
    document.getElementById('submit-section').style.display = 'block';
  }
}

// ── Standort dropdown change ──────────────────────────────────────────────────
function handleStandortChange(val) {
  var data     = STANDORT_DATA[val];
  var subDiv   = document.getElementById('standort-suboptions');
  var mapDiv   = document.getElementById('standort-map');
  var mapFrame = document.getElementById('map-iframe');
  var notice   = document.getElementById('wil-wattwil-notice');

  if (!val || !data) {
    subDiv.style.display  = 'none';
    mapDiv.style.display  = 'none';
    notice.style.display  = 'none';
    return;
  }

  // Wil / Wattwil special notice
  notice.style.display = (val === 'Wil' || val === 'Wattwil') ? 'block' : 'none';

  // Google Maps embed
  mapFrame.src = 'https://maps.google.com/maps?q=' + data.mapQ + '&output=embed&z=16&hl=de';
  mapDiv.style.display = 'block';

  // Sub-options (only when location has multiple parking spots)
  if (data.options.length > 1) {
    var grid = document.getElementById('suboptions-grid');
    grid.innerHTML = data.options.map(function (opt) {
      return (
        '<label class="check-item">' +
          '<input type="checkbox" name="suboption" value="' + opt.value + '">' +
          '<span class="check-box"><span class="check-mark"></span></span>' +
          '<span class="check-content">' +
            '<span class="check-label">'  + opt.label + '</span>' +
            '<span class="check-price">'  + opt.price + '</span>' +
          '</span>' +
        '</label>'
      );
    }).join('');
    subDiv.style.display = 'block';
    setError('err-suboption', false);
  } else {
    subDiv.style.display = 'none';
  }

  setError('err-standort', false);
}

// ── Custom checkbox tiles (event-delegated) ───────────────────────────────────
// Handles both static tiles (reglement) and dynamically generated sub-option tiles.
document.addEventListener('click', function (e) {
  var tile = e.target.closest('.check-item');
  if (!tile) return;

  e.preventDefault();

  var cb = tile.querySelector('input[type=checkbox]');
  if (!cb) return;

  cb.checked = !cb.checked;
  tile.classList.toggle('is-checked', cb.checked);
});

// ── Validation helpers ────────────────────────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(id, show) {
  var el = document.getElementById(id);
  if (el) el.classList.toggle('show', show);
}

function markField(id, hasError) {
  var el = document.getElementById(id);
  if (el) el.classList.toggle('error', hasError);
}

// ── Submit ────────────────────────────────────────────────────────────────────
function handleSubmit() {
  var typ   = document.getElementById('antrag-typ').value;
  var valid = true;

  if (typ === 'neu') {

    // Standort dropdown
    var standortVal = document.getElementById('standort-select').value;
    var noStandort  = !standortVal;
    setError('err-standort', noStandort);
    if (noStandort) valid = false;

    // Sub-option (required when location has multiple parking spots)
    if (standortVal && STANDORT_DATA[standortVal] && STANDORT_DATA[standortVal].options.length > 1) {
      var subChecked = document.querySelectorAll('input[name=suboption]:checked');
      var noSub = subChecked.length === 0;
      setError('err-suboption', noSub);
      if (noSub) valid = false;
    }

    // Datum
    var datum = document.getElementById('datum').value;
    markField('datum', !datum);
    if (!datum) valid = false;

    // Beschäftigungsgrad
    var bgVal = document.getElementById('beschaeftigung').value;
    var bg    = parseInt(bgVal, 10);
    var bgErr = bgVal === '' || isNaN(bg) || bg < 0 || bg > 100;
    markField('beschaeftigung', bgErr);
    setError('err-beschaeftigung', bgErr);
    if (bgErr) valid = false;

    // Name / Vorname
    var name    = document.getElementById('name').value.trim();
    var vorname = document.getElementById('vorname').value.trim();
    markField('name',    !name);
    markField('vorname', !vorname);
    if (!name || !vorname) valid = false;

    // E-Mail
    var email    = document.getElementById('email').value.trim();
    var emailErr = !validateEmail(email);
    markField('email', emailErr);
    setError('err-email', emailErr);
    if (emailErr) valid = false;

    // Funktion
    var funktion = document.getElementById('funktion').value.trim();
    markField('funktion', !funktion);
    if (!funktion) valid = false;

    // Abteilung
    var abt = document.getElementById('abteilung').value.trim();
    markField('abteilung', !abt);
    if (!abt) valid = false;

  }

  // Parkplatzreglement consent (always required)
  var reglementOk = document.getElementById('reglement-cb').checked;
  setError('err-reglement', !reglementOk);
  if (!reglementOk) valid = false;

  if (!valid) return;

  // All good – show success state
  document.getElementById('main-form').classList.add('hidden');
  document.getElementById('success-card').classList.add('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
