const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const config = require('./config.json');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/submit', async (req, res) => {
  const data = req.body;

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password
    }
  });

  const typLabels = {
    neu: 'Neu',
    verlaengert: 'Verlängerung',
    mutation: 'Mutation',
    kein: 'Kein Parkplatz (Mobilitätsbonus)'
  };

  let subject = `Antrag Parkplatz – ${typLabels[data.typ] || data.typ}`;
  let text = `Neuer Antrag Parkplatz / Mobilitätsbonus\n`;
  text += `=========================================\n\n`;
  text += `Antragsart: ${typLabels[data.typ] || data.typ}\n\n`;

  if (data.typ !== 'kein') {
    subject += ` – ${data.vorname} ${data.name}`;
    text += `Standort(e):         ${data.standorte.join(', ')}\n`;
    text += `Gültig ab:           ${data.datum}\n`;
    text += `Beschäftigungsgrad:  ${data.beschaeftigung} %\n\n`;
    text += `Name:                ${data.name}\n`;
    text += `Vorname:             ${data.vorname}\n`;
    text += `E-Mail:              ${data.email}\n`;
    text += `Funktion:            ${data.funktion}\n`;
    text += `Abteilung:           ${data.abteilung}\n\n`;
    text += `Autokennzeichen 1:   ${data.kfz1}\n`;
    if (data.kfz2) text += `Autokennzeichen 2:   ${data.kfz2}\n`;
    if (data.kfz3) text += `Autokennzeichen 3:   ${data.kfz3}\n`;
  } else {
    text += `Mobilitätsbonus wurde bestätigt.\n`;
  }

  try {
    await transporter.sendMail({
      from: config.smtp.from,
      to: config.smtp.to,
      subject,
      text
    });
    res.json({ success: true });
  } catch (err) {
    console.error('SMTP error:', err);
    res.status(500).json({ success: false, error: 'E-Mail konnte nicht gesendet werden.' });
  }
});

const port = config.port || 3000;
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
