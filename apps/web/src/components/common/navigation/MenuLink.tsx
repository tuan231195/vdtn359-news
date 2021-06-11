import React from 'react';
import { MenuIcon } from 'src/components/common/navigation/Sidebar.styled';
import { Image, SemanticICONS, Label } from 'semantic-ui-react';
import styled from 'styled-components';

const CategoryBadge: any = styled(Label)`
    min-width: 38px;
    text-align: center;
`;

export const MenuLink = React.forwardRef(
    (
        {
            icon,
            image,
            text,
            className = '',
            onClick,
            badge,
            href,
        }: {
            icon?: SemanticICONS;
            image?: string;
            className?: string;
            text?: string;
            onClick?: any;
            badge?: string | number;
            href?: string;
        },
        ref
    ) => {
        return (
            <a
                className={`vn-raw-link-center vn-full-width ${className}`}
                href={href || null}
                onClick={onClick}
                // @ts-ignore
                ref={ref}
            >
                {!!icon && <MenuIcon name={icon} />}
                {!!image && <Image avatar src={image} />}
                <span className={'vn-flex-grow vn-ml1'}>{text}</span>
                {!!badge && (
                    <CategoryBadge size={'tiny'} color={'teal'}>
                        {badge}
                    </CategoryBadge>
                )}
            </a>
        );
    }
);

MenuLink.displayName = 'MenuLink';
