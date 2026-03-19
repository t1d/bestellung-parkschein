// ── Standort data ─────────────────────────────────────────────────────────────
// payment: 'parkingpay' | 'salär'
// geteilt: true = geteilter Parkplatz, false = fix zugeteilt
const STANDORT_DATA = {
  'Heerbrugg': {
    mapQ: 'Schlosstrasse+203a+9435+Heerbrugg+Switzerland',
    payment: 'salär',
    options: [
      { value: 'Heerbrugg Schloss', label: 'Schloss / Schlosstr. 203a', price: 'CHF 720.– / Jahr', geteilt: false },
      { value: 'Heerbrugg Erlen',   label: 'Erlen / Bahnhofstr. 18',   price: 'CHF 720.– / Jahr', geteilt: false }
    ]
  },
  'Pfäfers': {
    mapQ: 'Psychiatrische+Klinik+Pfäfers+7312',
    payment: 'parkingpay',
    options: [
      { value: 'Pfäfers aussen',        label: 'Parkplatz aussen', price: 'CHF 120.– / Jahr', geteilt: true },
      { value: 'Pfäfers Unterstand B3', label: 'Unterstand B3',    price: 'CHF 480.– / Jahr', geteilt: true },
      { value: 'Pfäfers Tiefgarage',    label: 'Tiefgarage',       price: 'CHF 600.– / Jahr', geteilt: true }
    ]
  },
  'Rapperswil': {
    mapQ: 'Psychiatrische+Klinik+Rapperswil+SG',
    payment: 'salär',
    options: [
      { value: 'Rapperswil', label: 'Rapperswil', price: 'CHF 720.– / Jahr', geteilt: false }
    ]
  },
  'Rorschach': {
    mapQ: 'Psychiatrie+Rorschach+SG',
    payment: 'parkingpay',
    options: [
      { value: 'Rorschach', label: 'Rorschach', price: 'CHF 720.– / Jahr', geteilt: false }
    ]
  },
  'Sargans': {
    mapQ: 'Psychiatrie+Sargans+SG',
    payment: 'salär',
    options: [
      { value: 'Sargans', label: 'Sargans (geteilt)', price: 'CHF 720.– / Jahr', geteilt: true }
    ]
  },
  'St.Gallen': {
    mapQ: 'Psychiatrie+St.Gallen+Rorschacher+Strasse+69',
    payment: 'parkingpay',
    options: [
      { value: 'St.Gallen', label: 'St.Gallen', price: 'CHF 720.– / Jahr', geteilt: false }
    ]
  },
  'Uznach': {
    mapQ: 'Psychiatrie+Uznach+SG',
    payment: 'salär',
    options: [
      { value: 'Uznach', label: 'Uznach', price: 'CHF 660.– / Jahr', geteilt: false }
    ]
  },
  'Wattwil': {
    mapQ: 'Spital+Wattwil+SG',
    payment: 'parkingpay',
    options: [
      { value: 'Wattwil', label: 'Wattwil', price: 'CHF 720.– / Jahr', geteilt: true }
    ]
  },
  'Wil': {
    mapQ: 'Psychiatrische+Dienste+Wil+SG',
    payment: 'parkingpay',
    options: [
      { value: 'Wil P2/P3', label: 'P2 / P3 (geteilt)',  price: 'CHF 450.– / Jahr', geteilt: true  },
      { value: 'Wil P1',    label: 'P1 bei C05 / A02', price: 'CHF 600.– / Jahr', geteilt: false }
    ]
  }
};

// ── Standort dropdown change ───────────────────────────────────────────────────
function handleStandortChange(val) {
  var data     = STANDORT_DATA[val];
  var subDiv   = document.getElementById('standort-suboptions');
  var mapDiv   = document.getElementById('standort-map');
  var mapFrame = document.getElementById('map-iframe');
  var notice   = document.getElementById('wil-wattwil-notice');

  if (!val || !data) {
    subDiv.style.display = 'none';
    mapDiv.style.display = 'none';
    notice.style.display = 'none';
    document.getElementById('standort-info').style.display = 'none';
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
  updateLocationInfo();
}

// ── Location info badges (payment + parking type) ─────────────────────────────
function updateLocationInfo() {
  var val  = document.getElementById('standort-select').value;
  var data = STANDORT_DATA[val];
  var infoDiv   = document.getElementById('standort-info');
  var paymentEl = document.getElementById('info-payment');
  var typeEl    = document.getElementById('info-parking-type');

  if (!val || !data) {
    infoDiv.style.display = 'none';
    return;
  }

  // Payment method (location-level)
  paymentEl.textContent = data.payment === 'parkingpay'
    ? 'Parkplatz über Parking Pay'
    : 'Abzug über Salär';

  // Parking type: depends on which sub-option(s) are selected for multi-option locations
  if (data.options.length === 1) {
    typeEl.textContent    = data.options[0].geteilt ? 'Geteilter Parkplatz' : 'Fix zugeteilt';
    typeEl.style.display  = 'inline-block';
  } else {
    var checkedVals = Array.prototype.slice.call(
      document.querySelectorAll('input[name=suboption]:checked')
    ).map(function (cb) { return cb.value; });

    if (checkedVals.length === 0) {
      typeEl.style.display = 'none';
    } else {
      var selected   = data.options.filter(function (o) { return checkedVals.indexOf(o.value) !== -1; });
      var hasGeteilt = selected.some(function (o) { return o.geteilt; });
      var hasFix     = selected.some(function (o) { return !o.geteilt; });

      if (hasGeteilt && hasFix) {
        typeEl.textContent = 'Geteilt und fix zugeteilt';
      } else if (hasGeteilt) {
        typeEl.textContent = 'Geteilter Parkplatz';
      } else {
        typeEl.textContent = 'Fix zugeteilt';
      }
      typeEl.style.display = 'inline-block';
    }
  }

  infoDiv.style.display = 'flex';
}

// ── Custom checkbox tiles (event-delegated) ────────────────────────────────────
document.addEventListener('click', function (e) {
  var tile = e.target.closest('.check-item');
  if (!tile) return;

  e.preventDefault();

  var cb = tile.querySelector('input[type=checkbox]');
  if (!cb) return;

  cb.checked = !cb.checked;
  tile.classList.toggle('is-checked', cb.checked);

  // Update parking-type badge when a sub-option tile is toggled
  if (cb.name === 'suboption') {
    updateLocationInfo();
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
