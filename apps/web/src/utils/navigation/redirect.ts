import Router from 'next/router';

export function redirect(context, route) {
	if (context && context.res) {
		context.res.writeHead(302, {
			Location: route,
		});
		context.res.end();
	} else {
		return Router.push(route);
	}
}
