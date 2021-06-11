import { NextRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { Menu } from 'semantic-ui-react';
import { match as pathMatch } from 'path-to-regexp';
import { withRouter } from 'src/utils/hoc/with-router';
import styled from 'styled-components';
import Link from 'next/link';

const Item = styled(Menu.Item)`
    &&&&.active {
        color: white;
        background-color: ${(props) => props.theme.colors.accent} !important;

        &:hover {
            color: white !important;
            background-color: ${(props) =>
                props.theme.colors.secondaryAccent} !important;
        }
    }
`;

interface Props {
    name?: string;
    as?: any;
    showLink?: boolean;
    className?: string;
    routeOptions?: any;
    router?: NextRouter;
    showActive?: boolean;
    onClick?: any;
    children?: ReactNode;
}

const MenuItemComponent: React.FC<Props> = function ({
    name,
    as,
    className,
    router,
    onClick,
    routeOptions,
    showActive = true,
    showLink,
    children,
}) {
    const Content = showLink
        ? Link
        : ({ children }) => <React.Fragment>{children}</React.Fragment>;
    return (
        <Item
            as={as}
            name={name}
            className={className}
            active={showActive && isActive(routeOptions)}
            onClick={onClick}
        >
            <Content
                passHref
                prefetch={routeOptions?.prefetch}
                as={routeOptions?.as}
                href={routeOptions?.route}
            >
                {children}
            </Content>
        </Item>
    );

    function isActive(routeOptions) {
        if (!routeOptions?.route) {
            return false;
        }
        let currentPath = router.asPath;
        if (!currentPath) {
            currentPath = '/';
        }
        return !!pathMatch(routeOptions.as || routeOptions.route)(currentPath);
    }
};

export const MenuItem = withRouter(MenuItemComponent);
