// ── Arealplan PDFs ────────────────────────────────────────────────────────────
const AREALPLAN = {
  Heerbrugg: 'files/Arealplan_A4_quer_Heerbrugg_aktuell.pdf',
  'Pfäfers':  'files/Arealplan_A4_quer_Pfaefers_aktuell.pdf',
  Wil:        'files/Arealplan_A4_quer_Wil_aktuell.pdf',
};

// ── Standort data ─────────────────────────────────────────────────────────────
// payment: 'parkingpay' | 'salär'
const STANDORT_DATA = {
  Heerbrugg: {
    payment: 'salär',
    options: [
      { value: 'Heerbrugg Schloss', label: 'Schloss / Schlosstr. 203a', price: 'CHF 720.– / Jahr' },
      { value: 'Heerbrugg Erlen',   label: 'Erlen / Bahnhofstr. 18',   price: 'CHF 720.– / Jahr' },
    ],
  },
  'Pfäfers': {
    payment: 'parkingpay',
    options: [
      { value: 'Pfäfers aussen',        label: 'Aussenparkplatz', price: 'CHF 120.– / Jahr' },
      { value: 'Pfäfers Unterstand B3', label: 'Unterstand B3',   price: 'CHF 480.– / Jahr' },
      { value: 'Pfäfers Tiefgarage',    label: 'Tiefgarage',      price: 'CHF 600.– / Jahr' },
    ],
  },
  Rapperswil: {
    payment: 'salär',
    options: [{ value: 'Rapperswil', label: 'Rapperswil', price: 'CHF 720.– / Jahr' }],
  },
  Rorschach: {
    payment: 'parkingpay',
    options: [{ value: 'Rorschach', label: 'Rorschach', price: 'CHF 720.– / Jahr' }],
  },
  Sargans: {
    payment: 'salär',
    options: [{ value: 'Sargans', label: 'Sargans (Parkplatz Sharing)', price: 'CHF 720.– / Jahr' }],
  },
  'St.Gallen': {
    payment: 'parkingpay',
    options: [{ value: 'St.Gallen', label: 'St.Gallen', price: 'CHF 720.– / Jahr' }],
  },
  Uznach: {
    payment: 'salär',
    options: [{ value: 'Uznach', label: 'Uznach', price: 'CHF 660.– / Jahr' }],
  },
  Wattwil: {
    payment: 'parkingpay',
    options: [{ value: 'Wattwil', label: 'Wattwil', price: 'CHF 720.– / Jahr' }],
  },
  Wil: {
    payment: 'parkingpay',
    options: [
      { value: 'Wil P2/P3', label: 'P2 / P3 (Parkplatz Sharing)', price: 'CHF 450.– / Jahr' },
      { value: 'Wil P1',    label: 'P1 bei C05 / A02',            price: 'CHF 600.– / Jahr' },
    ],
  },
};

// ── DOM refs ──────────────────────────────────────────────────────────────────
const standortSelect   = document.getElementById('standort-select');
const suboptionsWrap   = document.getElementById('standort-suboptions');
const suboptionsGrid   = document.getElementById('suboptions-grid');
const standortInfo     = document.getElementById('standort-info');
const infoPayment      = document.getElementById('info-payment');
const wilNotice        = document.getElementById('wil-wattwil-notice');
const arealplanWrap    = document.getElementById('arealplan');
const arealplanLink    = document.getElementById('arealplan-link');

// ── Utilities ─────────────────────────────────────────────────────────────────
const hide = el => el.classList.add('is-hidden');
const show = el => el.classList.remove('is-hidden');

const setError = (id, visible) =>
  document.getElementById(id)?.classList.toggle('show', visible);

const markField = (id, hasError) =>
  document.getElementById(id)?.classList.toggle('error', hasError);

const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ── Standort change ───────────────────────────────────────────────────────────
const handleStandortChange = val => {
  const data = STANDORT_DATA[val];

  if (!val || !data) {
    hide(suboptionsWrap);
    hide(standortInfo);
    hide(wilNotice);
    hide(arealplanWrap);
    setError('err-suboption', false);
    return;
  }

  // Wil / Wattwil notice
  wilNotice.classList.toggle('is-hidden', val !== 'Wil' && val !== 'Wattwil');

  // Build radio tiles – auto-select when only one option
  const autoSelect = data.options.length === 1;
  suboptionsGrid.className = 'radio-grid';
  suboptionsGrid.innerHTML = data.options.map(opt => `
    <label class="check-item is-radio${autoSelect ? ' is-checked' : ''}">
      <input type="radio" name="suboption" value="${opt.value}"${autoSelect ? ' checked' : ''}>
      <span class="check-content">
        <span class="check-label">${opt.label}</span>
        <span class="check-price">${opt.price}</span>
      </span>
    </label>
  `).join('');
  show(suboptionsWrap);
  setError('err-suboption', false);

  // Payment badge
  infoPayment.textContent = data.payment === 'parkingpay'
    ? 'Parkplatz über Parking Pay'
    : 'Abzug über Salär';
  show(standortInfo);

  // Arealplan link
  if (AREALPLAN[val]) {
    arealplanLink.href = AREALPLAN[val];
    show(arealplanWrap);
  } else {
    hide(arealplanWrap);
  }

  setError('err-standort', false);
};

standortSelect.addEventListener('change', e => handleStandortChange(e.target.value));

// ── Radio tile click (event-delegated) ───────────────────────────────────────
document.addEventListener('click', e => {
  const tile = e.target.closest('.check-item');
  if (!tile) return;

  e.preventDefault();

  const input = tile.querySelector('input[type=checkbox], input[type=radio]');
  if (!input) return;

  if (input.type === 'radio') {
    document.querySelectorAll(`input[name="${input.name}"]`).forEach(r => {
      r.checked = false;
      r.closest('.check-item').classList.remove('is-checked');
    });
    input.checked = true;
    tile.classList.add('is-checked');
  } else {
    input.checked = !input.checked;
    tile.classList.toggle('is-checked', input.checked);
  }
});

// Prevent the PDF link inside the reglement tile from toggling the checkbox
document.getElementById('reglement-link')
  .addEventListener('click', e => e.stopPropagation());

// ── Submit ────────────────────────────────────────────────────────────────────
const handleSubmit = () => {
  let valid = true;

  const require = (id, condition) => {
    markField(id, !condition);
    if (!condition) valid = false;
  };

  const requireWithMsg = (errId, condition) => {
    setError(errId, !condition);
    if (!condition) valid = false;
  };

  // Standort
  const standortVal = standortSelect.value;
  requireWithMsg('err-standort', standortVal);

  // Parkplatz-Option
  if (standortVal) {
    const checked = document.querySelectorAll('input[name=suboption]:checked').length > 0;
    requireWithMsg('err-suboption', checked);
  }

  // Datum
  require('datum', document.getElementById('datum').value);

  // Beschäftigungsgrad
  const bgRaw = document.getElementById('beschaeftigung').value;
  const bg    = parseInt(bgRaw, 10);
  const bgOk  = bgRaw !== '' && !isNaN(bg) && bg >= 0 && bg <= 100;
  markField('beschaeftigung', !bgOk);
  requireWithMsg('err-beschaeftigung', bgOk);

  // Name / Vorname
  require('name',    document.getElementById('name').value.trim());
  require('vorname', document.getElementById('vorname').value.trim());

  // E-Mail
  const email   = document.getElementById('email').value.trim();
  const emailOk = validateEmail(email);
  markField('email', !emailOk);
  requireWithMsg('err-email', emailOk);

  // Funktion / Abteilung
  require('funktion',  document.getElementById('funktion').value.trim());
  require('abteilung', document.getElementById('abteilung').value.trim());

  // Autokennzeichen
  const kfzPattern = /^[A-Za-z]{2}\s?\d{1,6}$/;
  const kfz1 = document.getElementById('kfz1').value.trim();
  const kfz2 = document.getElementById('kfz2').value.trim();
  const kfz3 = document.getElementById('kfz3').value.trim();

  const kfz1Ok = kfz1 !== '' && kfzPattern.test(kfz1);
  const kfz2Ok = kfz2 === '' || kfzPattern.test(kfz2);
  const kfz3Ok = kfz3 === '' || kfzPattern.test(kfz3);

  markField('kfz1', !kfz1Ok); requireWithMsg('err-kfz1', kfz1Ok);
  markField('kfz2', !kfz2Ok); requireWithMsg('err-kfz2', kfz2Ok);
  markField('kfz3', !kfz3Ok); requireWithMsg('err-kfz3', kfz3Ok);

  // Parkplatzreglement
  requireWithMsg('err-reglement', document.getElementById('reglement-cb').checked);

  if (!valid) return;

  hide(document.getElementById('main-form'));
  show(document.getElementById('success-card'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.getElementById('submit-btn').addEventListener('click', handleSubmit);
