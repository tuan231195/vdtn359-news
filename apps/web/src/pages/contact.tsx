import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { Formik } from 'formik';
import { SemanticField } from 'src/components/form/SemanticField';
import { contactSchema } from 'src/utils/validation/schema';
import { EmailService } from 'src/services/email/email.service';
import { ConfirmationMessage } from 'src/components/form/ConfirmationMessage';
import { Trigger } from 'src/utils/events/trigger';
import { NextSeo } from 'next-seo';
import Head from 'next/head';

export default class ContactPage extends React.Component<any> {
    confirmTrigger = new Trigger();

    static getInitialProps() {
        return {
            showFooter: true,
        };
    }

    render() {
        const emailService = this.props.container.get(EmailService);
        return (
            <Segment>
                <Header as={'h3'}>Contact us</Header>
                <Head>
                    <title>Contact us</title>
                </Head>
                <NextSeo
                    title={'Contact us'}
                    description={'Sending us questions'}
                />
                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        subject: '',
                        enquiry: '',
                    }}
                    enableReinitialize={true}
                    isInitialValid={false}
                    validationSchema={contactSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            setSubmitting(true);
                            await emailService.contact(values);
                            this.confirmTrigger.trigger();
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {(formik) => (
                        <Form onSubmit={formik.handleSubmit}>
                            <SemanticField
                                name={'name'}
                                component={Form.Input}
                                componentProps={{
                                    label: 'Name',
                                    placeholder: 'Name',
                                }}
                            />
                            <SemanticField
                                name={'email'}
                                component={Form.Input}
                                componentProps={{
                                    label: 'Email',
                                    placeholder: 'Email',
                                }}
                            />
                            <SemanticField
                                name={'subject'}
                                component={Form.Input}
                                componentProps={{
                                    label: 'Subject',
                                    placeholder: 'Subject',
                                }}
                            />
                            <SemanticField
                                name={'enquiry'}
                                component={Form.TextArea}
                                componentProps={{
                                    label: 'Enquiry',
                                    placeholder: 'Enquiry',
                                    rows: 10,
                                }}
                            />
                            <div className={'vn-flex vn-flex-center'}>
                                <Button
                                    type="submit"
                                    primary
                                    disabled={
                                        !formik.isValid || formik.isSubmitting
                                    }
                                >
                                    Submit
                                </Button>
                                <ConfirmationMessage
                                    trigger={this.confirmTrigger}
                                    className={'vn-ml2'}
                                    message={'Your enquiry has been submitted!'}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </Segment>
        );
    }
}
