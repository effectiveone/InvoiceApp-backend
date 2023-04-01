// plik service.js
const nodemailer = require("nodemailer");

async function sendEmailWithJpkXml(jpkXml, recipientEmail) {
  try {
    // konfiguracja transportu pocztowego
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "mail.cba.pl",
      auth: {
        user: "biuro@effectiveadvisor.j.pl",
        pass: "Killer12!szachy1",
      },
      secure: true,
    });

    // treść maila - plik XML jako załącznik
    const mailOptions = {
      from: "biuro@effectiveadvisor.j.pl",
      to: recipientEmail,
      subject: "JPK XML ",
      attachments: [
        {
          filename: "jpk.xml",
          content: jpkXml,
          contentType: "text/xml",
        },
      ],
    };

    // wysłanie maila
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = { sendEmailWithJpkXml };
