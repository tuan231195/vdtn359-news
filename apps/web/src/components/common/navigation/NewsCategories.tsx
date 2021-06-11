import React, { useMemo } from 'react';
import { sumBy } from 'lodash';
import { CATEGORY } from '@vdtn359/news-models';
import { Menu } from 'semantic-ui-react';
import { str } from '@vdtn359/news-utils';
import styled from 'styled-components';
import { MenuItem } from 'src/components/common/navigation/MenuItem';
import { categoryMap } from 'src/utils/categories';
import { MenuLink } from 'src/components/common/navigation/MenuLink';

interface Props {
    categories: {
        category: CATEGORY;
        count: number;
    }[];
}

const MenuContainer = styled.div`
    &&& {
        position: fixed;
        min-width: 245px;
        z-index: 2;

        > .menu {
            width: 100%;
        }
    }
`;

const CategoryItem = styled(MenuItem)`
    &&&&&& {
        padding-top: 10px;
        padding-bottom: 10px;
        margin-bottom: -2px;
        min-height: 50px;
        display: flex;
        align-items: center;
    }
`;
export const NewsCategories: React.FC<Props> = ({ categories }) => {
    const total = useMemo(() => sumBy(categories, 'count'), [categories]);
    return (
        <MenuContainer>
            <Menu vertical>
                <CategoryItem
                    key={'hot'}
                    name="hot"
                    routeOptions={{ route: '/hot-news' }}
                    showLink={true}
                >
                    <MenuLink icon={'favorite'} text={'Hot news'} />
                </CategoryItem>
                <CategoryItem
                    key={'recommendation'}
                    name="recommendation"
                    routeOptions={{ route: '/recommendation' }}
                    showLink={true}
                >
                    <MenuLink icon={'like'} text={'You may like'} />
                </CategoryItem>
            </Menu>
            <Menu vertical>
                <CategoryItem
                    key={'all'}
                    name="all"
                    routeOptions={{ route: '/' }}
                    showLink={true}
                >
                    <MenuLink icon={'newspaper'} text={'All'} badge={total} />
                </CategoryItem>
                {categories.map((category) => (
                    <CategoryItem
                        showLink={true}
                        key={category.category}
                        name={category.category}
                        routeOptions={{
                            as: categoryMap.get(category.category).url,
                            route: '/categories/[category]',
                        }}
                    >
                        <MenuLink
                            icon={categoryMap.get(category.category).icon}
                            text={str.ucfirst(category.category)}
                            badge={category.count}
                        />
                    </CategoryItem>
                ))}
            </Menu>
        </MenuContainer>
    );
};
