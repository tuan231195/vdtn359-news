import React from 'react';
import { NewsSearchDto, NewsService } from 'src/services/news/news.service';
import { Header, Label } from 'semantic-ui-react';
import { NewsStream } from 'src/components/news/NewsStream';
import { ContainerInstance } from 'typedi';
import {
    getFilterFromUrl,
    SearchFilter,
    toQueryString,
} from 'src/utils/filter';
import Router from 'next/router';
import styled from 'styled-components';
import { withRouter } from 'src/utils/hoc/with-router';
import { SearchFilterOptions } from 'src/components/search/SearchFilter';
import Head from 'next/head';
import { TagList } from 'src/components/tags/TagList';
import {
    TrackingService,
    TrackingType,
} from 'src/utils/tracking/tracking.service';
import { NextSeo } from 'next-seo';

interface Props {
    news: NewsSearchDto[];
    router: typeof Router;
    total: number;
    filter: SearchFilter;
    container: ContainerInstance;
    suggestions: string[];
}

interface State {
    initialNewsList: NewsSearchDto[];
    terms: string[];
    filter: SearchFilter;
    suggestions: string[];
    total: number;
}

const Root = styled.div`
    margin-top: 20px;
`;

class SearchPage extends React.Component<Props, State> {
    private lastNewsList: NewsSearchDto[];

    constructor(props) {
        super(props);
        this.state = {
            initialNewsList: props.news,
            terms: props.terms,
            filter: props.filter,
            total: props.total,
            suggestions: props.suggestions,
        };
        this.lastNewsList = props.news;
    }

    static async getInitialProps(ctx) {
        const filter = getFilterFromUrl(ctx.query.filter);
        const { news, terms, total, suggestions } = await SearchPage.newSearch(
            ctx.container,
            filter
        );

        return {
            filter,
            terms,
            news,
            total,
            suggestions,
            showScrollTop: true,
        };
    }

    async componentDidUpdate(prevProps) {
        const { query } = this.props.router;
        if (query.filter !== prevProps.router.query.filter) {
            await this.updateSearchResults(query);
        }
    }

    async updateSearchResults(query) {
        const parsedFilter = getFilterFromUrl(query.filter);

        const { news, terms, total, suggestions } = await SearchPage.newSearch(
            this.props.container,
            parsedFilter
        );
        this.lastNewsList = news;
        this.setState({
            total,
            suggestions,
            filter: parsedFilter,
            terms,
            initialNewsList: news,
        });
    }

    static async newSearch(container: ContainerInstance, filter: SearchFilter) {
        const newsService = container.get(NewsService);
        const {
            items: news,
            terms,
            total,
            suggestions,
        } = await newsService.searchNews(filter);

        return {
            news,
            suggestions,
            terms,
            total,
        };
    }

    async nextPage() {
        let news = [];
        if (this.lastNewsList.length) {
            const searchAfter =
                this.lastNewsList[this.lastNewsList.length - 1].sort;
            const result = await SearchPage.newSearch(this.props.container, {
                ...this.state.filter,
                searchAfter,
            });
            news = result.news;
        }
        this.lastNewsList = news;

        return {
            news,
        };
    }

    async updateUrl(newFilter) {
        newFilter = {
            ...this.state.filter,
            ...newFilter,
        };
        if (newFilter.search) {
            const trackingService = this.props.container.get(TrackingService);
            trackingService.track({
                id: newFilter.search,
                type: TrackingType.TERM,
            });
        }
        await this.props.router.push(
            `/search?filter=${toQueryString({
                ...this.state.filter,
                ...newFilter,
            })}`,
            undefined,
            {
                shallow: true,
            }
        );
    }

    render() {
        return (
            <Root>
                <Head>
                    <title>
                        {this.state.filter.search
                            ? `Search for ${this.state.filter.search}`
                            : 'Search'}
                    </title>
                </Head>
                <NextSeo noindex={true} />
                <Header as={'h3'}>
                    {this.state.total} news(s)
                    {!!this.state.filter.search && (
                        <span>
                            {' '}
                            for &quot;
                            {this.state.filter.search}&quot;
                        </span>
                    )}
                </Header>
                <SearchFilterOptions
                    filter={this.state.filter}
                    onFilterUpdate={async (filter) => {
                        const filterString = toQueryString(filter);
                        if (
                            filterString ===
                            encodeURIComponent(
                                this.props.router.query.filter as string
                            )
                        ) {
                            await this.updateSearchResults(
                                this.props.router.query
                            );
                        } else {
                            await this.updateUrl(filter);
                        }
                    }}
                />
                {!this.state.initialNewsList.length && (
                    <div className={'vn-flex vn-flex-justify-center vn-mb3'}>
                        <span>
                            No search results found.{' '}
                            {this.state.suggestions?.length && (
                                <span>
                                    Did you mean{' '}
                                    <a
                                        className={'vn-cursor-pointer'}
                                        onClick={async () => {
                                            await this.updateUrl({
                                                search: this.state
                                                    .suggestions[0],
                                            });
                                        }}
                                    >
                                        {this.state.suggestions[0]}
                                    </a>
                                    ?
                                </span>
                            )}
                        </span>
                    </div>
                )}
                {!!this.state.suggestions.length &&
                    !!this.state.initialNewsList.length && (
                        <div
                            className={'vn-flex vn-flex-justify-center vn-mb3'}
                        >
                            <span>
                                You might want to look for{' '}
                                <a
                                    className={'vn-cursor-pointer'}
                                    onClick={async () => {
                                        await this.updateUrl({
                                            search: this.state.suggestions[0],
                                        });
                                    }}
                                >
                                    {this.state.suggestions[0]}
                                </a>
                                ?
                            </span>
                        </div>
                    )}
                {!!this.state.terms?.length && (
                    <div className={'vn-mt2 vn-mb2'}>
                        <Header as={'h5'}>Similar keywords:</Header>
                        <Label.Group>
                            <TagList tags={this.state.terms} />
                        </Label.Group>
                    </div>
                )}
                {!!this.state.initialNewsList.length && (
                    <NewsStream
                        initialNewsList={this.state.initialNewsList}
                        loadFunc={async () => {
                            const { news } = await this.nextPage();
                            return news;
                        }}
                    />
                )}
            </Root>
        );
    }
}

export default withRouter(SearchPage);
