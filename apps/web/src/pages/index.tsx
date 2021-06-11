import React from 'react';
import { NewsSearchDto, NewsService } from 'src/services/news/news.service';
import { NewsStream } from 'src/components/news/NewsStream';
import { NewsSlide } from 'src/components/news/NewsSlide';
import { ContainerInstance } from 'typedi';
import Head from 'next/head';

interface Props {
    news: NewsSearchDto[];
    recommendations: NewsSearchDto[];
    container: ContainerInstance;
}

export default class IndexPage extends React.Component<Props> {
    static async getInitialProps(ctx) {
        const newsService = ctx.container.get(NewsService);
        const [news, recommendations] = await Promise.all([
            newsService.fetchNews(),
            newsService.fetchRecommendation(),
        ]);

        return {
            news,
            showScrollTop: true,
            recommendations,
        };
    }

    render() {
        return (
            <>
                <Head>
                    <title>Tuan&apos;s news</title>
                </Head>
                <NewsSlide newsList={this.props.recommendations} />
                <NewsStream
                    initialNewsList={this.props.news}
                    loadFunc={(newsList) => {
                        const searchAfter =
                            newsList[newsList.length - 1] &&
                            newsList[newsList.length - 1].sort;
                        const newsService =
                            this.props.container.get(NewsService);
                        return newsService.fetchNews({ searchAfter });
                    }}
                />
            </>
        );
    }
}
