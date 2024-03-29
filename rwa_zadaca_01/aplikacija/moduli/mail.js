const konst = require("../../konstante.js");
const nodemailer = require(konst.dirModula + 'nodemailer');

let mailer = nodemailer.createTransport({
	host: 'mail.foi.hr',
	port: 25,
	/* auth: {
		 user: "",
		 pass: ""
	 }*/
})

exports.posaljiMail = async function (salje, prima, predmet, poruka) {
	message = {
		from: salje,
		to: prima,
		subject: predmet,
		text: poruka
	}

	let odgovor = await mailer.sendMail(message);
	return odgovor;
}
