import React from 'react';
import { NewsSearchDto, NewsService } from 'src/services/news/news.service';
import { CATEGORY } from '@vdtn359/news-models';
import { NewsStream } from 'src/components/news/NewsStream';
import { ContainerInstance } from 'typedi';
import { redirect } from 'src/utils/navigation/redirect';
import { str } from '@vdtn359/news-utils';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

interface Props {
    news: NewsSearchDto[];
    container: ContainerInstance;
    category: string;
}

export default class CategoryPage extends React.Component<Props> {
    static async getInitialProps(ctx) {
        const newsService = ctx.container.get(NewsService);
        const category = ctx.query.category || '';
        if (!Object.values(CATEGORY).includes(category.toUpperCase())) {
            return redirect(ctx, '/404');
        }
        const news = await newsService.fetchNews({
            categories: [category],
        });

        return {
            news,
            category: ctx.query.category,
            showScrollTop: true,
        };
    }
    render() {
        const displayedTitle = str.ucfirst(this.props.category);
        return (
            <>
                <Head>
                    <title>{displayedTitle}</title>
                </Head>
                <NextSeo
                    title={displayedTitle}
                    description={`News in ${displayedTitle}`}
                />
                <NewsStream
                    initialNewsList={this.props.news}
                    loadFunc={(newsList) => {
                        const searchAfter =
                            newsList[newsList.length - 1] &&
                            newsList[newsList.length - 1].sort;
                        const newsService =
                            this.props.container.get(NewsService);
                        return newsService.fetchNews({
                            searchAfter,
                            categories: [this.props.category],
                        });
                    }}
                />
            </>
        );
    }
}
