class Sendgrid {
	constructor(title, message, sender,senderName, apiKey) {
		this.title = title;
		this.message = message;
    this.sender = sender;
    this.senderName = senderName;
    this.apiKey = apiKey;
    this.sgMail = require('@sendgrid/mail');
    this.sgMail.setApiKey(apiKey);
  }
  
	createMessage(name, email, cert) {
		return {
			to: email,
      from: {
        name: this.senderName,
        email: this.sender,
      },
			subject: this.title,
      html: `<p>${this.message}</p>`,
			attachments: [
				{
					filename: `${name}.pdf`,
					content: cert,
					type: 'application/pdf',
					disposition: 'attachment',
					contentType: 'application/pdf',
					type: 'pdf'
				}
			]
		};
  }

  sendMail(user, cert) {
    try {
      const mail = this.createMessage(user.name, user.email, cert);
      this.sgMail.send(mail);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  sendBulkMail(users, certs) {
    try {
      const mails = users.map((user, index) => this.createMessage(user.name, user.email, certs[index]));
      this.sgMail.send(mails);
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = Sendgrid;
