import { withRouter as withNextRouter } from 'next/router';
import hoistNonReactStatics from 'hoist-non-react-statics';

export function withRouter<Props>(
	WrappedComponent: React.ComponentType<Props>
): React.ComponentType<Omit<Props, 'router'>> {
	const NewComponent: any = withNextRouter(WrappedComponent as any);
	hoistNonReactStatics(NewComponent, WrappedComponent);
	return NewComponent;
}
