const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const path = require("path");
const fs = require("fs")
const handlebars = require('handlebars');

const transport = nodemailer.createTransport(config.email.smtp);

const readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
    if (err) {
        callback(err);                 
    }
    else {
        callback(null, html);
    }
  });
};

/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

const sendWelcomeEmail = async (to, subject, text) => {
  return new Promise((resolve, reject) => {
    const msg = { from: config.email.from, to, subject, text };

    readHTMLFile(path.join(process.cwd(), `public/email-templates/register-template/index.html`), function(err, html) {
      if (err) {
        console.log(error);
        reject(err)
        return;
      }
      var template = handlebars.compile(html);
      var replacements = {
        dashboardUrl: config.clientUrl,
        templateAssetUrl: `${config.serverUrl}/email-templates/register-template`
      };
      var htmlToSend = template(replacements);
      var mailOptions = {
          ...msg,
          html : htmlToSend
       };
       transport.sendMail(mailOptions, function (error, response) {
          if (error) {
            console.log(error);
            reject(err)
          } else {
            resolve()
          }
      });
    });
  })
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.clientUrl}/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};
const sendEmailFeedBack = async (from, to, subject, text, attachments = []) => {
  const msg = { from: config.email.from, to, subject, text, attachments };
  await transport.sendMail(msg);
};

const sendFeedBack = async (from, to, content, attachments = []) => {
  const subject = `Email Feedback from User: <${from}>`;
  // replace this url with the link to the email verification page of your front-end app
  const text = content;
  await sendEmailFeedBack(from, to, subject, text, attachments);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendFeedBack,
  sendWelcomeEmail
};
