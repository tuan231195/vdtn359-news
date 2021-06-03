const { sh, cli } = require('tasksfile');

function buildPackagesDev() {
	return sh('ts-transpile -b packages', {
		async: true,
	});
}

function watchPackages() {
	return sh(
		'chokidar --silent "packages/*/src/**/*" --initial -c "time ts-transpile -b packages"',
		{
			async: true,
		}
	);
}

function postInstall() {
	sh(
		'link-parent-bin > /dev/null && link-parent-bin --child-directory-root app > /dev/null'
	);
}

function buildPackages() {
	return sh('pnpm recursive --sort --filter ./packages run build', {
		async: true,
	});
}

function startAppDevs() {
	return Promise.all([
		sh('pnpm recursive run dev --filter @vdtn359/news-web', {
			async: true,
		}),
	]);
}

function buildApp() {
	return sh('pnpm recursive run build', {
		async: true,
	});
}

function dev() {
	return Promise.all([watchPackages(), startAppDevs()]);
}

function build() {
	buildPackages();
	buildApp();
}

cli({
	buildPackagesDev,
	buildPackages,
	watchPackages,
	dev,
	build,
	postInstall,
});

process.on('unhandledRejection', (err) => {
	// eslint-disable-next-line no-console
	console.error('Unhandle rejections', err);
	process.exit(1);
});
