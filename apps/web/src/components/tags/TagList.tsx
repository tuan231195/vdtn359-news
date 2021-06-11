import { str } from '@vdtn359/news-utils';
import React from 'react';
import { Label } from 'semantic-ui-react';
import Link from 'next/link';

export function TagList({ tags }) {
    return (
        <Label.Group>
            {tags.map((term) => (
                <Label color="teal" key={term}>
                    <Link href={`/tags/[tag]`} as={`/tags/${term}`}>
                        <a>{str.ucfirst(term)}</a>
                    </Link>
                </Label>
            ))}
        </Label.Group>
    );
}
