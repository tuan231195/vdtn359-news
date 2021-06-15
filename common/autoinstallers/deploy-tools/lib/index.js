#! /usr/bin/env node
const yargs = require('yargs');
const rushLib = require('@microsoft/rush-lib');
const { getPackageDeps } = require('@rushstack/package-deps-hash');
const path = require('path');

const { argv } = yargs;

switch (argv.action) {
	case 'get-hash':
		const packageHashes = getDepsHash(argv.package);
		console.log(packageHashes);
		break;
	case 'update-hash':
		break;
	case 'deploy':
		break;
}

function getConfig() {
	return rushLib.RushConfiguration.loadFromDefaultLocation({
		startingFolder: process.cwd(),
	});
}

function getDepsHash(packageName) {
	const config = getConfig();
	const rushProject = config.findProjectByShorthandName(packageName);
	if (!rushProject) {
		throw new Error(`Package ${packageName} not found`);
	}

	const deps = getDependencies(config, rushProject);

	return Object.fromEntries(
		deps.map((dep) => Object.entries(getPackageHash(config, dep))).flat()
	);
}

function getPackageHash(config, packageName) {
	const rushProject = config.findProjectByShorthandName(packageName);
	if (!rushProject) {
		throw new Error(`Package ${packageName} not found`);
	}
	return Array.from(
		getPackageDeps(rushProject.projectFolder).entries()
	).reduce((current, [file, hash]) => {
		return {
			...current,
			[path.resolve(rushProject.projectFolder, file)]: hash,
		};
	}, {});
}

function getDependencies(rushConfig, toProject) {
	const queue = [];
	const visited = {};

	queue.push(toProject);
	while (queue.length > 0) {
		const currentProject = queue.shift();
		if (visited[currentProject.packageName]) {
			continue;
		}
		visited[currentProject.packageName] = true;
		for (const dependencyProject of currentProject.dependencyProjects) {
			if (dependencyProject.projectRelativeFolder.startsWith('tools')) {
				continue;
			}
			queue.push(dependencyProject);
		}
	}
	return Object.keys(visited);
}
