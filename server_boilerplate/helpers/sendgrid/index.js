const config = require('./config');
const helper = require('sendgrid').mail;
const sg = require('sendgrid')(config.apiKey);
const fs = require('fs');
const path = require('path');

class SendGridHelper {
  constructor() {
    this.defaultContentType = 'text/plain';
    this.defaultFromEmail = config.fromEmail;
  }

  _createMail(args) {
    let { from, to, subject, content, contentType, template } = args;

    if (!contentType) {
      contentType = this.defaultContentType;
    }

    if (template) {
      content = fs.readFileSync(path.join(__dirname, 'templates', `${template}.html`)).toString();
      contentType = 'text/html';
    }

    if (!from) {
      from = this.defaultFromEmail;
    }

    from = new helper.Email(from);
    to = new helper.Email(to);
    content = new helper.Content(contentType, content);

    return new helper.Mail(from, subject, to, content);
  }

  send(args) {
    const mail = this._createMail(args);

    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    return sg.API(request);
  }
};

module.exports = SendGridHelper;
