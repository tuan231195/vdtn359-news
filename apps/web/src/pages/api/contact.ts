import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
import { config } from 'src/setup';
import { getHandler } from 'src/api/handler';
import createError from 'http-errors';
import { contactSchema } from 'src/utils/validation/schema';

const handler = getHandler();
handler.post(request);

export default handler;

sgMail.setApiKey(config.email.apiKey);

async function request(req: NextApiRequest, res: NextApiResponse) {
	const body = await validateInput(req.body);
	const msg = {
		to: config.email.adminEmail,
		from: config.email.supportEmail,
		subject: body.subject,
		text: getSupportEmail(body),
	};
	await sgMail.send(msg);
	res.status(200).send({
		status: 'Success',
	});
}

async function validateInput(body) {
	try {
		return await contactSchema.validate(body, {
			abortEarly: true,
		});
	} catch (e) {
		throw new createError.BadRequest(e.errors[0]);
	}
}

function getSupportEmail(body) {
	return `From: ${body.name}
Email: ${body.email}
Enquiry: ${body.enquiry}`;
}
