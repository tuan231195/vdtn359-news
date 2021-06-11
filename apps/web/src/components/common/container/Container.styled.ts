import styled from 'styled-components';
import { Container } from 'semantic-ui-react';

export const NewsRoot = styled(Container).attrs({ fluid: true })`
	&&&& {
		background-color: ${(props) => props.theme.colors.grey};
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		height: 100%;
	}
`;

export const NewsContainer = styled.div`
	padding: var(--space-2);
	padding-top: calc(${(props) => props.theme.dimen.navBar} + 30px);
	flex: 1 0 0;
`;
