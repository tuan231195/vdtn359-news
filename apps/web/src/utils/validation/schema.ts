import * as Yup from 'yup';

export const contactSchema = Yup.object({
	name: Yup.string().required('Name is required').trim(),
	email: Yup.string()
		.trim()
		.email('Email is not valid')
		.required('Email is required'),
	subject: Yup.string().required('Subject is required').trim(),
	enquiry: Yup.string().required('Enquiry is required').trim(),
});

export const commentSchema = Yup.object({
	content: Yup.string().required('Content is required').trim(),
});
