import React, { useEffect, useState } from 'react';
import { useDb, useQuery } from 'src/utils/db/hooks';
import { RatingStars } from 'src/components/common/misc/Star';
import { useContainer } from 'src/utils/container/context';
import { NewsService } from 'src/services/news/news.service';

export function NewsEditRating({ id }) {
    const dbPromise = useDb();
    const [rating, setRating] = useState(0);
    const container = useContainer();
    const newsService = container.get(NewsService);
    const ratingDocument = useQuery(
        (db) => {
            return db.get('ratings', id);
        },
        [id]
    );
    useEffect(() => {
        setRating(ratingDocument?.rating || 0);
    }, [ratingDocument, id]);
    return (
        <RatingStars
            maxStars={5}
            value={rating}
            onChange={async (e, { value }) => {
                const oldRating = rating;
                setRating(value);
                await newsService.rating({
                    id,
                    rating: value,
                    oldRating,
                });
                const db = await dbPromise;
                await db.put('ratings', {
                    id,
                    rating: value,
                    time: new Date(),
                });
            }}
        />
    );
}
