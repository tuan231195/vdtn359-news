import { useMediaQuery } from 'react-responsive';
import React from 'react';
import { Segment } from 'semantic-ui-react';
import { size } from 'src/utils/device/size';
import { func } from '@vdtn359/news-utils';
import { withProps } from 'src/utils/hoc/with-props';

export const VnResponsive = ({
    children = null,
    settings,
    onChange = func.noop,
}) => {
    const matches = useMediaQuery(settings, undefined, onChange);
    return matches ? children : null;
};

export const VnMobileS = withProps({
    settings: {
        minWidth: size.mobileS,
        maxWidth: size.mobileM - 1,
    },
})(VnResponsive);

export const VnLaptop = withProps({
    settings: { minWidth: size.laptop },
})(VnResponsive);

export const VnTablet = withProps({
    settings: {
        minWidth: size.tablet,
        maxWidth: size.laptop - 1,
    },
})(VnResponsive);

export const VnBigScreen = withProps({
    settings: { minWidth: size.tablet },
})(VnResponsive);

export const VnMobile = withProps({
    settings: { maxWidth: size.tablet - 1 },
})(VnResponsive);

export const VnMobileL = withProps({
    settings: { minWidth: size.mobileL, maxWidth: size.tablet - 1 },
})(VnResponsive);

export const VnMobileM = withProps({
    settings: { minWidth: size.mobileM, maxWidth: size.mobileL - 1 },
})(VnResponsive);

export const VnResponsiveSegment = ({ children, className }) => {
    const isBigScreen = useMediaQuery({ minWidth: size.tablet });
    return isBigScreen ? (
        <Segment className={className}>{children}</Segment>
    ) : (
        <div className={className}>{children}</div>
    );
};
