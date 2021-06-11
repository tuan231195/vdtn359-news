import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { NewsCard } from 'src/components/news/NewsCard';
import { Spinner } from 'src/components/common/loading/Spinner';
import styled from 'styled-components';
import { NewsSearchDto } from 'src/services/news/news.service';

const CardGroup = styled((props) => <Card.Group {...props} />)`
    &&&& {
        margin: 0;
    }
`;

interface Props {
    initialNewsList: NewsSearchDto[];
    loadFunc: (newsList?: NewsSearchDto[]) => Promise<NewsSearchDto[]>;
}
export const NewsStream: React.FC<Props> = ({
    initialNewsList = [],
    loadFunc,
}) => {
    const [hasMore, setHasMore] = useState(!!initialNewsList.length);
    const [newsList, setNewsList] = useState(initialNewsList);
    const newsMapRef = useRef({});
    useEffect(() => {
        newsMapRef.current = {};
        const filteredList = addToMap(initialNewsList);
        setNewsList(filteredList);
        setHasMore(!!filteredList.length);
    }, [initialNewsList]);
    return (
        <CardGroup>
            <InfiniteScroll
                className={'vn-no-overflow'}
                pageStart={0}
                threshold={500}
                loadMore={() =>
                    loadFunc(newsList).then((nextNews) => {
                        const filteredList = addToMap(nextNews);
                        if (filteredList.length) {
                            setNewsList(newsList.concat(filteredList));
                        }
                        setHasMore(!!filteredList.length);
                    })
                }
                hasMore={hasMore}
                loader={<Spinner key={-1} />}
                useWindow={true}
            >
                {newsList.map((news) => (
                    <NewsCard news={news} key={news.id} />
                ))}
            </InfiniteScroll>
        </CardGroup>
    );

    function addToMap(newsList = []) {
        const newsMap: any = newsMapRef.current;
        const filteredList = [];
        for (const news of newsList) {
            if (!newsMap[news.id]) {
                newsMap[news.id] = true;
                filteredList.push(news);
            }
        }
        return filteredList;
    }
};
