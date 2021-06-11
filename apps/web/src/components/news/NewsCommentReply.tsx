import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { CommentDto } from '@vdtn359/news-models';
import { commentSchema } from 'src/utils/validation/schema';
import { SemanticField } from 'src/components/form/SemanticField';
import { Formik } from 'formik';
import { useContainer } from 'src/utils/container/context';
import { NewsService } from 'src/services/news/news.service';

interface Props {
    newsId: string;
    onNewComment?: (comment: CommentDto) => void;
}

export const NewsCommentReply: React.FC<Props> = ({ newsId, onNewComment }) => {
    const container = useContainer();
    const newsService = container.get(NewsService);
    return (
        <Formik
            initialValues={{
                content: '',
            }}
            enableReinitialize={true}
            isInitialValid={false}
            validationSchema={commentSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                    setSubmitting(true);
                    const newComment = await newsService.addComment({
                        ...values,
                        newsId,
                    });
                    onNewComment(newComment);
                    resetForm();
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {(formik) => (
                <Form reply onSubmit={formik.handleSubmit}>
                    <SemanticField
                        name={'content'}
                        showError={false}
                        component={Form.TextArea}
                        componentProps={{
                            placeholder: 'Comment',
                            rows: 7,
                        }}
                    />
                    <Button
                        type="submit"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                        primary
                        disabled={!formik.isValid || formik.isSubmitting}
                    />
                </Form>
            )}
        </Formik>
    );
};
