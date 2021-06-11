import React from 'react';
import { Label } from 'semantic-ui-react';
import { getColorAndText } from 'src/utils/rating';

export function RatingRibbon({ rating }) {
    const { color, text } = getColorAndText(rating);
    return (
        <Label as="a" color={color} ribbon={'right'}>
            {text}
        </Label>
    );
}
