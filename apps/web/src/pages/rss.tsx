import React from 'react';
import { Segment, Header, Grid, Icon } from 'semantic-ui-react';
import Head from 'next/head';
import { categoryMap } from 'src/utils/categories';
import { str } from '@vdtn359/news-utils';
import styled from 'styled-components';
import { device } from 'src/utils/device/size';

const RssIcon = styled(Icon)`
    &&&&& {
        margin-top: -5px;
    }
`;

const RssSegment = styled(Segment)`
    &&&& {
        margin-top: var(--space-3);
        position: relative;
        min-height: 70vh;

        @media ${device.tablet} {
            min-height: 300px;
        }
    }
`;

const Container = styled.div`
    margin-top: var(--space-2);
`;
export default class RssPage extends React.Component<any, any> {
    static categories = ['all', ...categoryMap.keys()];
    render() {
        return (
            <RssSegment>
                <Header as={'h3'}>RSS feeds</Header>
                <Head>
                    <title>RSS feeds</title>
                </Head>
                <Container className={'vn-mt4'}>
                    <Grid>
                        {RssPage.categories.map((category) => (
                            <Grid.Column
                                mobile={8}
                                key={category}
                                tablet={8}
                                computer={8}
                            >
                                <a
                                    target={'_blank'}
                                    rel={'noreferrer noopener'}
                                    className={'vn-raw-link-center'}
                                    href={`/api/rss/${category.toLowerCase()}`}
                                >
                                    <RssIcon
                                        color={'orange'}
                                        name={'rss square'}
                                    />
                                    <span>{str.ucfirst(category)}</span>
                                </a>
                            </Grid.Column>
                        ))}
                    </Grid>
                </Container>
            </RssSegment>
        );
    }
}
