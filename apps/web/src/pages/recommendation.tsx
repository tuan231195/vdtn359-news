import React from 'react';
import { NewsSearchDto, NewsService } from 'src/services/news/news.service';
import { ContainerInstance } from 'typedi';
import { CardGroup } from 'semantic-ui-react';
import Head from 'next/head';
import { NewsCard } from 'src/components/news/NewsCard';
import { NextSeo } from 'next-seo';

interface Props {
    news: NewsSearchDto[];
    container: ContainerInstance;
}

export default class RecommendationPage extends React.Component<Props> {
    static async getInitialProps(ctx) {
        const newsService = ctx.container.get(NewsService);
        const news = await newsService.fetchRecommendation({
            size: 20,
        });

        return {
            news,
            showScrollTop: true,
        };
    }

    render() {
        return (
            <>
                <Head>
                    <title>You may like</title>
                </Head>
                <NextSeo noindex={true} />
                <CardGroup>
                    {this.props.news.map((news) => (
                        <NewsCard news={news} key={news.id} />
                    ))}
                </CardGroup>
            </>
        );
    }
}
