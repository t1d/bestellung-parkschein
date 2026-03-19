// ── Arealplan PDFs (only for locations that have one) ─────────────────────────
const AREALPLAN = {
  'Heerbrugg': 'files/Arealplan_A4_quer_Heerbrugg_aktuell.pdf',
  'Pfäfers':   'files/Arealplan_A4_quer_Pfaefers_aktuell.pdf',
  'Wil':       'files/Arealplan_A4_quer_Wil_aktuell.pdf'
};

// ── Standort data ─────────────────────────────────────────────────────────────
// payment: 'parkingpay' | 'salär'
// geteilt: true = geteilter Parkplatz, false = fix zugeteilt
const STANDORT_DATA = {
  'Heerbrugg': {
    payment: 'salär',
    options: [
      { value: 'Heerbrugg Schloss', label: 'Schloss / Schlosstr. 203a', price: 'CHF 720.– / Jahr', geteilt: false },
      { value: 'Heerbrugg Erlen',   label: 'Erlen / Bahnhofstr. 18',   price: 'CHF 720.– / Jahr', geteilt: false }
    ]
  },
  'Pfäfers': {
    payment: 'parkingpay',
    options: [
      { value: 'Pfäfers aussen',        label: 'Parkplatz aussen', price: 'CHF 120.– / Jahr', geteilt: true },
      { value: 'Pfäfers Unterstand B3', label: 'Unterstand B3',    price: 'CHF 480.– / Jahr', geteilt: true },
      { value: 'Pfäfers Tiefgarage',    label: 'Tiefgarage',       price: 'CHF 600.– / Jahr', geteilt: true }
    ]
  },
  'Rapperswil': {
    payment: 'salär',
    options: [
      { value: 'Rapperswil', label: 'Rapperswil', price: 'CHF 720.– / Jahr', geteilt: false }
    ]
  },
  'Rorschach': {
    payment: 'parkingpay',
    options: [
      { value: 'Rorschach', label: 'Rorschach', price: 'CHF 720.– / Jahr', geteilt: false }
    ]
  },
  'Sargans': {
    payment: 'salär',
    options: [
      { value: 'Sargans', label: 'Sargans (Parkplatz Sharing)', price: 'CHF 720.– / Jahr', geteilt: true }
    ]
  },
  'St.Gallen': {
    payment: 'parkingpay',
    options: [
      { value: 'St.Gallen', label: 'St.Gallen', price: 'CHF 720.– / Jahr', geteilt: false }
    ]
  },
  'Uznach': {
    payment: 'salär',
    options: [
      { value: 'Uznach', label: 'Uznach', price: 'CHF 660.– / Jahr', geteilt: false }
    ]
  },
  'Wattwil': {
    payment: 'parkingpay',
    options: [
      { value: 'Wattwil', label: 'Wattwil', price: 'CHF 720.– / Jahr', geteilt: true }
    ]
  },
  'Wil': {
    payment: 'parkingpay',
    options: [
      { value: 'Wil P2/P3', label: 'P2 / P3 (Parkplatz Sharing)', price: 'CHF 450.– / Jahr', geteilt: true  },
      { value: 'Wil P1',    label: 'P1 bei C05 / A02', price: 'CHF 600.– / Jahr', geteilt: false }
    ]
  }
};

// ── Standort dropdown change ───────────────────────────────────────────────────
function handleStandortChange(val) {
  var data     = STANDORT_DATA[val];
  var subDiv   = document.getElementById('standort-suboptions');
  var notice   = document.getElementById('wil-wattwil-notice');

  if (!val || !data) {
    subDiv.style.display = 'none';
    notice.style.display = 'none';
    document.getElementById('standort-info').style.display = 'none';
    document.getElementById('arealplan').style.display = 'none';
    return;
  }

  // Wil / Wattwil special notice
  notice.style.display = (val === 'Wil' || val === 'Wattwil') ? 'block' : 'none';

  // Sub-options – radio (single selection), auto-select when only one option
  var autoSelect = data.options.length === 1;
  var grid = document.getElementById('suboptions-grid');
  grid.innerHTML = data.options.map(function (opt) {
    var checked = autoSelect ? ' checked' : '';
    var tileClass = autoSelect ? ' is-checked' : '';
    return (
      '<label class="check-item' + tileClass + '">' +
        '<input type="radio" name="suboption" value="' + opt.value + '"' + checked + '>' +
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

  // Arealplan PDF
  var arealDiv = document.getElementById('arealplan');
  var arealFrame = document.getElementById('arealplan-iframe');
  if (AREALPLAN[val]) {
    arealFrame.src = AREALPLAN[val];
    arealDiv.style.display = 'block';
  } else {
    arealDiv.style.display = 'none';
  }

  setError('err-standort', false);
  updateLocationInfo();
}

// ── Location info badge (payment method) ──────────────────────────────────────
function updateLocationInfo() {
  var val  = document.getElementById('standort-select').value;
  var data = STANDORT_DATA[val];
  var infoDiv   = document.getElementById('standort-info');
  var paymentEl = document.getElementById('info-payment');

  if (!val || !data) {
    infoDiv.style.display = 'none';
    return;
  }

  paymentEl.textContent = data.payment === 'parkingpay'
    ? 'Parkplatz über Parking Pay'
    : 'Abzug über Salär';

  infoDiv.style.display = 'flex';
}

// ── Custom checkbox tiles (event-delegated) ────────────────────────────────────
document.addEventListener('click', function (e) {
  var tile = e.target.closest('.check-item');
  if (!tile) return;

  e.preventDefault();

  var cb = tile.querySelector('input[type=checkbox]');
  if (!cb) return;

  if (cb.type === 'radio') {
    // Deselect all tiles in this group first
    document.querySelectorAll('input[name="' + cb.name + '"]').forEach(function (r) {
      r.checked = false;
      r.closest('.check-item').classList.remove('is-checked');
    });
    cb.checked = true;
    tile.classList.add('is-checked');
  } else {
    cb.checked = !cb.checked;
    tile.classList.toggle('is-checked', cb.checked);
  }

});

// ── Validation helpers ─────────────────────────────────────────────────────────
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

// ── Submit ─────────────────────────────────────────────────────────────────────
function handleSubmit() {
  var valid = true;

  // Standort dropdown
  var standortVal = document.getElementById('standort-select').value;
  var noStandort  = !standortVal;
  setError('err-standort', noStandort);
  if (noStandort) valid = false;

  // Parkplatz-Option (always required)
  if (standortVal) {
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

  // Parkplatzreglement consent
  var reglementOk = document.getElementById('reglement-cb').checked;
  setError('err-reglement', !reglementOk);
  if (!reglementOk) valid = false;

  if (!valid) return;

  // All good – show success state
  document.getElementById('main-form').classList.add('hidden');
  document.getElementById('success-card').classList.add('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
