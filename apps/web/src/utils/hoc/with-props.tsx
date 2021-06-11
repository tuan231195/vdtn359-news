import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export function withProps(
    extraProps: any
): (component: any) => React.ComponentClass<any, any> {
    return (WrappedComponent: any) => {
        class NewComponent extends React.Component<any, any> {
            render() {
                const { ...props } = this.props;
                return <WrappedComponent {...props} {...extraProps} />;
            }
        }

        hoistNonReactStatics(NewComponent, WrappedComponent, {
            getInitialProps: true,
        });

        return NewComponent;
    };
}
