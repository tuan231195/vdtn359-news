import React from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';
import { NewsDto } from '@vdtn359/news-models';
import styled from 'styled-components';

import { date, str } from '@vdtn359/news-utils';
import { useURL } from 'src/utils/hooks/basic';
import { NewsSlide } from 'src/components/news/NewsSlide';
import { NewsEditRating } from 'src/components/news/NewsRating';
import { RatingRibbon } from 'src/components/tags/RatingRibbon';

interface Props {
    news: NewsDto;
    similarNewsList: NewsDto[];
}

const NewsSegment = styled(Segment)`
    img {
        max-width: 100%;
        object-fit: cover;
    }
    &&& {
        padding: var(--space-2) var(--space-2);
    }
`;

const NewsBody = styled.div`
    span {
        margin-left: 5px;
    }
    div:not(:empty) {
        margin-bottom: 1em;
    }
`;

const NewsHeader = styled(Header)`
    margin-bottom: var(--space-2);
`;

const NewsMeta = styled.div`
    color: rgba(0, 0, 0, 0.4);
    margin-bottom: var(--space-2);
`;

const NewsSource = styled.div`
    margin-bottom: var(--space-1);
`;

const NewsLink = styled.a`
    text-decoration: none;
    margin-left: 15px;
    color: black;
    display: inline-block;
    transform: translateY(-4px);
`;

const NewsDescription = styled.i`
    margin-bottom: var(--space-3);
    display: block;
`;
export const NewsDetails: React.FC<Props> = ({ news, similarNewsList }) => {
    const { root: rootUrl, hostname } = useURL(news.url);
    return (
        <NewsSegment raised={true}>
            <div className={'vn-absolute'}>
                <NewsEditRating id={news.id} />
                <NewsMeta>{news.numViews} view(s)</NewsMeta>
            </div>
            <RatingRibbon rating={news.ratings} />

            <NewsHeader as={'h1'} className={'vn-mt4'}>
                {news.title}
                <NewsLink
                    href={news.url}
                    target={'_blank'}
                    rel={'noreferrer noopener'}
                    data-tooltip={'View external'}
                    data-position="bottom center"
                >
                    <Icon name={'external alternate'} size={'small'} />
                </NewsLink>
            </NewsHeader>
            <NewsMeta className={'vn-flex vn-flex-justify'}>
                <span>{str.ucfirst(news.category)}</span>
                <span>
                    {date.formatDistance(new Date(news.pubDate), new Date())}
                </span>
            </NewsMeta>
            <NewsSource>
                From:{' '}
                <a
                    target={'_blank'}
                    rel={'noreferrer noopener'}
                    href={`${rootUrl}`}
                >
                    {hostname}
                </a>
            </NewsSource>
            <NewsDescription
                dangerouslySetInnerHTML={{ __html: news.description }}
            />
            {!!similarNewsList.length && (
                <>
                    <Header as={'h4'}>Similar News</Header>
                    <NewsSlide newsList={similarNewsList} />
                </>
            )}
            <NewsBody dangerouslySetInnerHTML={{ __html: news.body }} />
        </NewsSegment>
    );
};
