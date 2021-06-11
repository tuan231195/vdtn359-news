import { NewsDto } from '@vdtn359/news-models';
import React from 'react';
import Slider from 'react-slick';
import { Card, Header, Image } from 'semantic-ui-react';
import styled from 'styled-components';
import Link from 'next/link';
import { size } from 'src/utils/device/size';
import LazyLoad from 'react-lazyload';

interface Props {
    newsList: NewsDto[];
}

const NewsSlider = styled(Slider)`
    margin: 30px 0 50px 0;
    .slick-track {
        height: 250px !important;
        display: flex;
    }

    .slick-arrow,
    .slick-arrow:before,
    .slick-arrow:after {
        color: black;
    }

    .card {
        margin: 0 var(--space-2);
        max-width: 100%;
        width: auto;

        img {
            max-width: 100%;
            object-fit: cover;
        }

        .ui.header {
            padding: 9px;
            overflow: hidden !important;
            text-overflow: ellipsis;
            overflow-wrap: break-word;
            word-wrap: break-word;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            max-height: 3.8em;
            line-height: 1.6em;
        }
    }
`;

const NewsCard = styled(Card)`
    &&&& {
        margin: 0 var(--space-1);
        max-width: 200px;
        width: auto !important;
        height: 220px;

        img {
            height: 160px;
            max-width: 100%;
        }
    }
`;
export const NewsSlide: React.FC<Props> = ({ newsList = [] }) => {
    return (
        <NewsSlider
            className={'vn-ml3 vn-mr3'}
            dots={true}
            infinite={true}
            autoplay={false}
            slidesToShow={3}
            centerMode={true}
            responsive={[
                {
                    breakpoint: size.tablet,
                    settings: {
                        slidesToShow: 2,
                        centerMode: false,
                        centerPadding: '0px',
                    },
                },
                {
                    breakpoint: size.laptop,
                    settings: {
                        slidesToShow: 2,
                        centerMode: true,
                        centerPadding: '150px',
                    },
                },
            ]}
            centerPadding={'150px'}
            slidesToScroll={1}
        >
            {newsList.map((news) => (
                <div key={news.id}>
                    <Link href={`/news/[slug]`} as={`/news/${news.slug}`}>
                        <a className={'vn-raw-link'}>
                            <NewsCard>
                                <LazyLoad height={160} once offset={500}>
                                    <Image
                                        src={
                                            news.image ||
                                            '/images/placeholder.png'
                                        }
                                    />
                                </LazyLoad>
                                <Card.Header>
                                    <Header as={'h5'}>{news.title}</Header>
                                </Card.Header>
                            </NewsCard>
                        </a>
                    </Link>
                </div>
            ))}
        </NewsSlider>
    );
};
