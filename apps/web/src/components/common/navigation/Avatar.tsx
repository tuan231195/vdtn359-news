import React from 'react';
import { Image } from 'semantic-ui-react';
import { md5 } from 'src/utils/crypto';

function gravatar(email) {
    return `https://www.gravatar.com/avatar/${md5(email)}`;
}
export function Avatar({ user }) {
    return <Image avatar src={user.picture || gravatar(user.email)} />;
}
