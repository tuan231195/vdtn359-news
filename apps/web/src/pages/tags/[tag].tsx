import React from 'react';
import { NewsSearchDto, NewsService } from 'src/services/news/news.service';
import { Header } from 'semantic-ui-react';
import { NewsStream } from 'src/components/news/NewsStream';
import { ContainerInstance } from 'typedi';
import { PaginationDto } from '@vdtn359/news-models/dist/dtos/pagination.dto';
import Router from 'next/router';
import styled from 'styled-components';
import { withRouter } from 'src/utils/hoc/with-router';
import { str } from '@vdtn359/news-utils';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

interface Props {
    news: NewsSearchDto[];
    router: typeof Router;
    tag: string;
    total: number;
    container: ContainerInstance;
}

interface State {
    pagination: PaginationDto;
    news: NewsSearchDto[];
    tag: string;
}

const Root = styled.div`
    margin-top: 20px;
`;

class SearchPage extends React.Component<Props, State> {
    private lastNewsList: NewsSearchDto[];

    constructor(props) {
        super(props);
        this.lastNewsList = props.news;
    }

    static async getInitialProps(ctx) {
        const container = ctx.container;
        const newsService = container.get(NewsService);
        const { items: news, total } = await newsService.searchNews({
            search: ctx.query.tag,
        });

        return {
            news,
            tag: ctx.query.tag,
            total: total,
        };
    }

    async nextPage() {
        if (!this.lastNewsList?.length) {
            return {
                news: [],
            };
        }
        const newsService = this.props.container.get(NewsService);
        const { items: news } = await newsService.searchNews({
            search: this.props.tag,
            searchAfter: this.lastNewsList[this.lastNewsList.length - 1].sort,
        });
        this.lastNewsList = news;

        return {
            news,
            showScrollTop: true,
        };
    }

    render() {
        const displayedTags = str.ucfirst(this.props.tag);
        return (
            <Root>
                <Head>
                    <title>Tag {displayedTags}</title>
                </Head>
                <NextSeo
                    title={displayedTags}
                    description={`News with tags ${this.props.tag}`}
                />
                <Header as={'h3'}>
                    {this.props.total} document(s) matching tag &quot;
                    {str.ucfirst(this.props.tag)}&quot;
                </Header>
                <NewsStream
                    initialNewsList={this.props.news}
                    loadFunc={async () => {
                        const { news } = await this.nextPage();
                        return news;
                    }}
                />
            </Root>
        );
    }
}

export default withRouter(SearchPage);
