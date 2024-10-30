const sgMail = require('@sendgrid/mail');
const { logger, sdc } = require('../logger');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, text, html) {
  const msg = {
    to,
    from: 'noreply@email.desaihir.me', // Use your verified sender email
    subject,
    text,
    html,
  };
  
  try {
    const startTime = Date.now();
    await sgMail.send(msg);
    sdc.timing('email.send', Date.now() - startTime);
    logger.info(`Email sent successfully to ${to}`);
  } catch (error) {
    logger.error('Error sending email:', error);
    sdc.increment('email.sendError');
    if (error.response) {
      logger.error(error.response.body);
    }
  }
}

module.exports = { sendEmail };