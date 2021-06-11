import React from 'react';
import 'fomantic-ui-css/semantic.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'src/styles.scss';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css';
import App from 'next/app';
import { DefaultSeo } from 'next-seo';
import { promises } from '@vdtn359/news-utils';
import styled, { ThemeProvider } from 'styled-components';
import { NewsCategories } from 'src/components/common/navigation/NewsCategories';
import { Grid, Header } from 'semantic-ui-react';
import {
    NewsContainer,
    NewsRoot,
} from 'src/components/common/container/Container.styled';
import { NewsService } from 'src/services/news/news.service';
import { Context as ResponsiveContext } from 'react-responsive';
import { device, getDeviceWidth } from 'src/utils/device/size';
import { VnBigScreen } from 'src/components/common/responsive/Responsive';
import { withContainer } from 'src/utils/hoc/with-container';
import { init } from 'src/utils/container/init';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ContainerContext } from 'src/utils/container/context';
import { SideBarPushable } from 'src/components/common/navigation/SideBarPushable';
import { EventDispatcher } from 'src/utils/events/event-dispatcher';
import { WINDOW_CLICK } from 'src/utils/events/event.constants';
import { Footer } from 'src/components/common/navigation/Footer';
import { ScrollTopButton } from 'src/components/common/navigation/ScrollTopButton';
import { TagList } from 'src/components/tags/TagList';
import { ToastContainer } from 'src/components/common/container/ToastContainer';
import { ApiService } from 'src/services/api.service';
import { seoConfig } from 'src/utils/seo/config';
import { isDevelopment } from 'src/utils/env';
import { UserService } from 'src/services/auth/user.service';
import { UserContext } from 'src/auth/context';

const theme = {
    colors: {
        primary: '#0288D1',
        accent: '#FF8106',
        secondaryAccent: '#FF5C00',
        grey: '#e9ebee',
        white: '#fff',
        transparent: 'rgba(0, 0, 0, 0)',
        black: '#000',
    },
    dimen: {
        navBar: '47px',
    },
};

const Content = styled.div`
    width: 100%;
    position: relative;
    @media ${device.tablet} {
        width: 90%;
        max-width: 850px;
    }
`;

const Root = styled.div``;

const NewsGrid = styled(Grid)`
    &&&& {
        margin: 0;
    }
`;

class NewsApp extends App<any, any, any> {
    private listeners: (() => void)[] = [];

    constructor(props) {
        super(props);
        this.state = {
            deviceWidth: props.deviceWidth,
        };
    }

    static async getInitialProps({ Component, ctx }) {
        let deviceWidth;
        const container = ctx.container;
        if (ctx.req) {
            deviceWidth = getDeviceWidth(ctx.req.headers['user-agent']);
        }
        const allPromises: any = {};
        if (Component.getInitialProps) {
            allPromises.pageProps = Component.getInitialProps(ctx);
        } else {
            allPromises.pageProps = Promise.resolve({});
        }
        const newsService = container.get(NewsService);
        const userService = container.get(UserService);
        allPromises.categories = newsService.fetchCategories();
        allPromises.hotTerms = newsService.fetchHotTerms();
        allPromises.user = userService.getUser();
        const result: any = await promises.all(allPromises);
        container.set('user', result.user);
        return {
            ...result,
            query: ctx.query,
            deviceWidth,
        };
    }

    componentDidMount() {
        this.setState({
            deviceWidth: 0,
        });
        Router.events.on('routeChangeComplete', () => {
            window.scrollTo(0, 0);
        });
        this.registerListeners();
    }

    registerListeners() {
        this.registerClickListeners();
        this.registerRouteListener();
    }

    registerRouteListener() {
        Router.events.on('routeChangeStart', () => {
            NProgress.start();
        });

        Router.events.on('routeChangeComplete', () => {
            NProgress.done();
        });

        Router.events.on('routeChangeError', () => {
            NProgress.done();
        });

        const apiService = this.props.container.get(ApiService);
        let lastNumApiCalls = 0;
        apiService.apiCallSubscription.subscribe((numApiCalls) => {
            if (numApiCalls > 0 && !lastNumApiCalls) {
                NProgress.start();
            } else if (!numApiCalls) {
                NProgress.done();
            }

            lastNumApiCalls = numApiCalls;
        });
    }

    registerClickListeners() {
        const eventHandler = (e) => {
            const eventDispatcher = this.props.container.get(EventDispatcher);
            eventDispatcher.trigger(WINDOW_CLICK, e);
        };
        window.addEventListener('click', eventHandler);

        this.listeners.push(() => {
            window.removeEventListener('click', eventHandler);
        });
    }

    render() {
        const { Component, pageProps, query, user } = this.props;
        return (
            <UserContext.Provider value={user}>
                <ResponsiveContext.Provider
                    value={
                        this.state.deviceWidth
                            ? { width: this.state.deviceWidth }
                            : undefined
                    }
                >
                    <ContainerContext.Provider value={this.props.container}>
                        <ThemeProvider theme={theme}>
                            <Root>
                                <SideBarPushable
                                    categories={this.props.categories}
                                >
                                    <NewsRoot>
                                        <NewsContainer>
                                            <DefaultSeo {...seoConfig} />
                                            <NewsGrid centered={true}>
                                                <VnBigScreen>
                                                    <Grid.Column
                                                        mobile={16}
                                                        tablet={4}
                                                        computer={4}
                                                    >
                                                        <NewsCategories
                                                            categories={
                                                                this.props
                                                                    .categories
                                                            }
                                                        />
                                                    </Grid.Column>
                                                </VnBigScreen>
                                                <Grid.Column
                                                    mobile={16}
                                                    tablet={12}
                                                    computer={12}
                                                    className={
                                                        'vn-flex vn-flex-justify-center'
                                                    }
                                                >
                                                    <Content>
                                                        {!!this.props.hotTerms
                                                            .length && (
                                                            <div
                                                                className={
                                                                    'vn-mb2'
                                                                }
                                                            >
                                                                <Header
                                                                    as={'h4'}
                                                                >
                                                                    Hot keywords
                                                                </Header>
                                                                <TagList
                                                                    tags={
                                                                        this
                                                                            .props
                                                                            .hotTerms
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                        <Component
                                                            {...pageProps}
                                                            query={query}
                                                            container={
                                                                this.props
                                                                    .container
                                                            }
                                                        />
                                                    </Content>
                                                </Grid.Column>
                                            </NewsGrid>
                                        </NewsContainer>
                                        {pageProps?.showScrollTop && (
                                            <ScrollTopButton />
                                        )}

                                        {pageProps?.showFooter && <Footer />}
                                    </NewsRoot>
                                </SideBarPushable>
                                <ToastContainer />
                            </Root>
                        </ThemeProvider>
                    </ContainerContext.Provider>
                </ResponsiveContext.Provider>
            </UserContext.Provider>
        );
    }
}

if (typeof window !== 'undefined') {
    import('src/browser');
} else {
    if (!isDevelopment()) {
        import('src/setup').then(({ logger, Sentry }) => {
            process.once('unhandledRejection', (e) => {
                logger.error('Unhandled rejections: ', e);
                Sentry.captureException(e);
            });
        });
    }
}
export default withContainer(init)(NewsApp);
