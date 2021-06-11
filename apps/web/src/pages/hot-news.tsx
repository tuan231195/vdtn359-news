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

export default class HotNewsPage extends React.Component<Props> {
    static async getInitialProps(ctx) {
        const newsService = ctx.container.get(NewsService);
        const news = await newsService.fetchHotNews();

        return {
            news,
            showScrollTop: true,
        };
    }

    render() {
        return (
            <>
                <Head>
                    <title>Hot news</title>
                </Head>
                <NextSeo title={'Hot news'} description={'Popular news'} />
                <CardGroup>
                    {this.props.news.map((news) => (
                        <NewsCard news={news} key={news.id} />
                    ))}
                </CardGroup>
            </>
        );
    }
}
