import React from 'react';
import { arr, func } from '@vdtn359/news-utils';
import styled from 'styled-components';
import { useMonitoring } from 'src/utils/hooks/basic';

export const StarContainer = styled.div`
    margin-top: 5px;
`;

export const Star = styled.div<{
    readonly: boolean;
    half: boolean;
    checked: boolean;
}>`
    position: relative;
    font-weight: 900;
    width: 2rem;
    height: 2rem;
    display: inline-block;

    &:after {
        font-size: 1.5rem;
        font-family: 'Font Awesome 5 Free';
        content: '\\f005';
        position: absolute;
        left: 0;
        color: #d9d9d9;
    }

    ${({ readonly }) =>
        !readonly &&
        `
			&:hover ~ &:after {
				font-weight: 400;
				color: #fde16d;
			}
		`}

    ${({ half }) =>
        half &&
        `
			&:before {
				font-size: 1.5rem;
				font-family: 'Font Awesome 5 Free';
				content: '\\f089';
				color: #fde16d;
				position: absolute;
				left: 0;
				z-index: 1;
			}
		`}
	
	${({ half, readonly }) =>
        half &&
        !readonly &&
        `
			&:hover:after {
				font-weight: 400;
		        color: #d9d9d9;
			}
		`}
	
	${({ checked }) =>
        checked &&
        `
			&:after {
				color: #fde16d;
				content: '\\f005';
			}
		`}
`;

interface Props {
    maxStars?: number;
    value?: number;
    onChange?: (event, { value }: { value: number }) => void;
    readonly?: boolean;
}

export const RatingStars: React.FC<Props> = ({
    maxStars = 5,
    value = 0,
    onChange = func.noop,
    readonly,
}) => {
    const [currentStars, setCurrentStar] = useMonitoring({ value });
    return (
        <>
            <StarContainer onMouseLeave={() => onMouseLeave()}>
                {arr.range(0, maxStars).map((star, index) => {
                    return (
                        <Star
                            readonly={readonly}
                            key={star}
                            half={
                                index + 1 > currentStars && index < currentStars
                            }
                            checked={index + 1 <= currentStars}
                            onMouseMove={
                                readonly
                                    ? null
                                    : (event) => onMouseMove(event, index)
                            }
                            onClick={
                                readonly ? null : (event) => onMouseClick(event)
                            }
                        />
                    );
                })}
            </StarContainer>
        </>
    );

    function onMouseMove(e: React.MouseEvent, index) {
        if (isWithinFirstHalf(e)) {
            setCurrentStar(index + 1 - 0.5);
        } else {
            setCurrentStar(index + 1);
        }
    }

    function onMouseLeave() {
        setCurrentStar(value);
    }

    function onMouseClick(e) {
        onChange(e, { value: currentStars });
    }

    function isWithinFirstHalf(event: React.MouseEvent) {
        return (
            event.nativeEvent.offsetX <=
            (event.currentTarget as any).offsetWidth / 2
        );
    }
};
