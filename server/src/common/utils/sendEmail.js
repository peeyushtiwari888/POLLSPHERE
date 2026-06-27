import nodemailer from 'nodemailer';

/**
 * Send an email using Nodemailer.
 * Uses Ethereal Email for testing if no credentials are provided.
 */
const sendEmail = async (options) => {
  // Create a test account for development (Ethereal email)
  let testAccount = await nodemailer.createTestAccount();

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_EMAIL || testAccount.user,
      pass: process.env.SMTP_PASSWORD || testAccount.pass,
    },
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'PollSphere'} <${process.env.FROM_EMAIL || 'noreply@pollsphere.test'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);

  // If using Ethereal email, log the preview URL
  if (!process.env.SMTP_HOST) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

export default sendEmail;
