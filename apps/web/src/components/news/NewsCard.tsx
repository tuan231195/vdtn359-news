import React from 'react';
import styled from 'styled-components';
import { Button, Card, Image, Icon } from 'semantic-ui-react';
import { NewsDto } from '@vdtn359/news-models';
import { date, str } from '@vdtn359/news-utils';
import Link from 'next/link';
import { useURL } from 'src/utils/hooks/basic';
import { NewsEditRating } from 'src/components/news/NewsRating';
import { RatingTag } from 'src/components/tags/RatingTag';
import LazyLoad from 'react-lazyload';

interface Props {
    news: NewsDto;
}

const ButtonGroup = styled.div`
    display: flex;
    align-items: center;
    > a:not(:first-child) {
        margin-left: 10px;
    }
`;

const NewsImage = styled(Image)`
    &&&&& {
        object-fit: cover;
        height: 400px;
    }
`;
export const NewsCard: React.FC<Props> = ({ news }) => {
    const { root: rootUrl, hostname } = useURL(news.url);
    return (
        <Card raised={true} fluid={true} centered={true}>
            <Card.Content>
                <LazyLoad height={400} once offset={500}>
                    <NewsImage
                        size={'huge'}
                        src={news.image || '/images/placeholder.png'}
                        className={'vn-mb3'}
                    />
                </LazyLoad>
                <Card.Header className={'vn-mb1'}>
                    <Link href={`/news/[slug]`} as={`/news/${news.slug}`}>
                        <a>{news.title}</a>
                    </Link>
                </Card.Header>
                <Card.Meta>
                    <div className={'vn-flex vn-flex-justify'}>
                        <span>{str.ucfirst(news.category)}</span>
                        <span>
                            {date.formatDistance(
                                new Date(news.pubDate),
                                new Date()
                            )}
                        </span>
                    </div>
                </Card.Meta>
                <Card.Description>
                    <div
                        className={'vn-mb3'}
                        dangerouslySetInnerHTML={{ __html: news.description }}
                    />
                    <div className={'vn-flex vn-flex-justify vn-flex-center'}>
                        <span>
                            From:{' '}
                            <a
                                target={'_blank'}
                                rel={'noreferrer noopener'}
                                href={`${rootUrl}`}
                            >
                                {hostname}
                            </a>
                        </span>
                        <span>
                            <NewsEditRating id={news.id} />
                        </span>
                    </div>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className={'vn-flex vn-flex-center vn-flex-justify'}>
                    <ButtonGroup>
                        <Link href={`/news/[slug]`} as={`/news/${news.slug}`}>
                            <a
                                className={'vn-raw-link ui button primary'}
                                style={{ color: 'white' }}
                            >
                                View More
                            </a>
                        </Link>
                        <Button
                            as={'a'}
                            href={news.url}
                            target={'_blank'}
                            rel={'noreferrer noopener'}
                        >
                            View External
                        </Button>
                    </ButtonGroup>
                    <div className={'vn-flex vn-flex-center'}>
                        {news.numComments > 0 && (
                            <span className={'vn-mr2'}>
                                <Icon name={'comments'} />
                                {news.numComments}
                            </span>
                        )}
                        {news.ratings > 0 && (
                            <div>
                                <RatingTag rating={news.ratings} />
                            </div>
                        )}
                    </div>
                </div>
            </Card.Content>
        </Card>
    );
};
