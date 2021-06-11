import React from 'react';
import { Grid, Header, Icon, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import Link from 'next/link';

const FooterSegment = styled(Segment)`
    &&&& {
        margin: 0;
        padding: 20px 0;
        border-radius: 0;
        width: 100%;
    }
`;

export const Footer = () => {
    return (
        <FooterSegment inverted>
            <Grid divided inverted stackable columns={'equal'}>
                <Grid.Column
                    className={'vn-flex vn-flex-column vn-flex-center'}
                >
                    <Header as={'h3'} inverted>
                        About me
                    </Header>
                    <div className={'vn-ml2'}>
                        <div>
                            <Icon name={'user'} /> Tuan Nguyen
                        </div>
                        <div>
                            <Icon name={'mail outline'} /> vdtn359@gmail.com
                        </div>
                    </div>
                </Grid.Column>
                <Grid.Column
                    className={'vn-flex vn-flex-column vn-flex-center'}
                >
                    <Header as={'h3'} inverted>
                        Links
                    </Header>
                    <Link href={'/contact'}>
                        <a className={'vn-raw-link-center'}>
                            <span>Contact Us</span>
                        </a>
                    </Link>
                    <Link href={'/subscribe'}>
                        <a className={'vn-raw-link-center '}>
                            <span>Subscribe</span>
                        </a>
                    </Link>
                </Grid.Column>
                <Grid.Column
                    className={'vn-flex vn-flex-column vn-flex-center'}
                >
                    <Header as={'h3'} inverted>
                        Media
                    </Header>
                    <span>
                        <Icon name={'github'} />
                        <Icon name={'linkedin'} />
                    </span>
                </Grid.Column>
            </Grid>
        </FooterSegment>
    );
};
