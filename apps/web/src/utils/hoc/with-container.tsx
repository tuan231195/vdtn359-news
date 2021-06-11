import React from 'react';
import { AppContext } from 'next/app';
import { NextPageContext } from 'next';
import { ContainerInstance } from 'typedi';
import hoistNonReactStatics from 'hoist-non-react-statics';

export function withContainer(
    initContainer: (context: NextPageContext) => ContainerInstance
): (component: React.ComponentClass<any>) => React.ComponentClass<any, any> {
    return (WrappedComponent: any) => {
        class NewComponent extends React.Component<any, any> {
            private readonly container: any;
            constructor(props, appContext: AppContext) {
                super(props, appContext);
                this.container = initContainer(
                    appContext.ctx ||
                        (NewComponent as any).ctx || {
                            query: props.query,
                        }
                );
            }

            static async getInitialProps(appCtx) {
                if (!appCtx) throw new Error('No page context');
                if (!appCtx.ctx) throw new Error('No page context');

                (NewComponent as any).ctx = appCtx.ctx;

                appCtx.ctx.container = initContainer(appCtx.ctx);

                let initialProps = {};

                if ('getInitialProps' in WrappedComponent) {
                    initialProps = await WrappedComponent.getInitialProps(
                        appCtx
                    );
                }

                return {
                    initialProps,
                };
            }

            render() {
                const { initialProps, ...props } = this.props;
                return (
                    <WrappedComponent
                        {...props}
                        {...initialProps}
                        container={this.container}
                    />
                );
            }
        }

        hoistNonReactStatics(NewComponent, WrappedComponent, {
            getInitialProps: true,
        });

        return NewComponent;
    };
}
