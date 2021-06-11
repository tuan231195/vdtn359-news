import styled from 'styled-components';
import { device } from 'src/utils/device/size';
import { Segment } from 'semantic-ui-react';

export const ErrorHeader = styled.h2`
    font-size: 22px;
    font-weight: 400;
    text-transform: uppercase;
    color: #222;
    margin-bottom: 20px;
    margin-top: 5px;
`;

export const ErrorContainer: any = styled(Segment)`
    text-align: center;
    position: relative;
    min-height: 70vh;
    margin-top: var(--space-3);

    @media ${device.tablet} {
        min-height: 600px;
    }
`;

export const ErrorStatusText = styled.h1<{ color?: string }>`
    &&& {
        height: 200px;
        color: ${(props) => props.color || props.theme.colors.accent};
        font-size: 168px;
        text-transform: uppercase;
        line-height: 200px;
        margin-top: -100px;
    }
`;
