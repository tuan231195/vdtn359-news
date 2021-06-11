import React from 'react';
import { Label } from 'semantic-ui-react';
import { getColorAndText } from 'src/utils/rating';

export function RatingTag({ rating }) {
    const { color, text } = getColorAndText(rating);
    return (
        <Label as="a" color={color}>
            {text}
        </Label>
    );
}
