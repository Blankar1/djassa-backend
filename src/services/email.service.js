const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
});

exports.sendOrderConfirmation = async (email, order) => {
  try {
    await transporter.sendMail({
      from: `"DJASSA 🛒" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `✅ Commande confirmée — ${order.orderNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
          <h2 style="color:#01696f">🛒 Merci pour votre commande !</h2>
          <p>Bonjour, votre commande <strong>${order.orderNumber}</strong> a bien été reçue.</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;border:1px solid #eee"><b>Total</b></td>
                <td style="padding:8px;border:1px solid #eee">${order.total} FCFA</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee"><b>Paiement</b></td>
                <td style="padding:8px;border:1px solid #eee">${order.paymentMethod}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee"><b>Commune</b></td>
                <td style="padding:8px;border:1px solid #eee">${order.commune}</td></tr>
          </table>
          <p style="margin-top:16px;color:#666">Nous vous contacterons bientôt pour la livraison.<br>
          WhatsApp : <a href="https://wa.me/225XXXXXXXX">+225 XX XX XX XX</a></p>
          <p style="color:#01696f;font-weight:bold">L'équipe DJASSA</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("Email non envoyé:", e.message);
  }
};
