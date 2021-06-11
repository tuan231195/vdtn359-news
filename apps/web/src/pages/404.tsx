import React from 'react';
import { Icon } from 'semantic-ui-react';
import Link from 'next/link';
import Head from 'next/head';
import {
    ErrorContainer,
    ErrorHeader,
    ErrorStatusText,
} from 'src/components/common/navigation/ErrorPage.styled';
import { NextSeo } from 'next-seo';

export default function NotFoundPage() {
    return (
        <ErrorContainer>
            <Head>
                <title>Not Found</title>
            </Head>
            <NextSeo noindex={true} />
            <div className={'vn-absolute-center'}>
                <ErrorStatusText>404</ErrorStatusText>
                <ErrorHeader>Page Not Found</ErrorHeader>
                <Link href={'/'}>
                    <a>
                        <div
                            className={
                                'vn-flex vn-flex-center vn-flex-justify-center'
                            }
                        >
                            <Icon name="arrow circle left" />
                            <div className={'vn-mt1'}>Return to home page</div>
                        </div>
                    </a>
                </Link>
            </div>
        </ErrorContainer>
    );
}
