import styled from 'styled-components';

export const Spinner = styled.div`
	position: relative;
	width: 100%;
	height: 50px;
	margin-top: 8px;

	&::before {
		animation: 1.5s linear infinite spinner;
		animation-play-state: inherit;
		border: solid 3px #cfd0d1;
		border-bottom-color: #1c87c9;
		border-radius: 50%;
		content: '';
		height: 30px;
		width: 30px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);
		will-change: transform;
	}
`;
