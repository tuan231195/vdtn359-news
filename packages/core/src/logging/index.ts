import winston from 'winston';
import LogzioWinstonTransport from 'winston-logzio';
import { proxy } from '@vdtn359/news-utils';

const { timestamp, errors, label, printf, splat } = winston.format;

const print = printf((info) => {
	return normalLog(info);
});

function normalLog(info) {
	return `[${info.label}] ${info.timestamp} (${info.level}): ${info.message}`;
}

function formatMetadata(metadata) {
	if (metadata == undefined) {
		return '';
	}
	if (metadata.jse_info) {
		metadata = metadata.jse_info;
	}
	if (metadata.stack) {
		return metadata.stack;
	}
	metadata =
		metadata && typeof metadata === 'object'
			? JSON.stringify(metadata, undefined, 4)
			: metadata;

	if (metadata === '{}') {
		metadata = '';
	}
	return metadata;
}
export function createLogger(
	category: string,
	level: string,
	{ logzToken }: { logzToken?: string } = {}
) {
	const logger = winston.createLogger({
		level,
		format: winston.format.combine(
			errors({ stack: true }),
			label({ label: category }),
			splat(),
			timestamp(),
			print
		),
		transports: [new winston.transports.Console()],
	});

	if (logzToken) {
		logger.add(
			new LogzioWinstonTransport({
				token: logzToken,
				level,
				host: 'listener.logz.io',
				name: 'winston_logzio',
			}) as any
		);
	}
	const logWrapper = new LogWrapper(logger);
	return proxy.wrap(logWrapper, logger);
}

class LogWrapper {
	constructor(private readonly logger: winston.Logger) {}

	log(level: string, message: string, meta: any, ...args) {
		if (meta) {
			meta = formatMetadata(meta);
			message = `${message} \n ${meta}`;
		}
		this.logger.log(level, message, meta, ...args);
	}

	trace(message: string, meta: any, ...args) {
		this.log('trace', message, meta, ...args);
	}

	error(message: string, meta: any, ...args) {
		this.log('error', message, meta, ...args);
	}

	debug(message: string, meta: any, ...args) {
		this.log('debug', message, meta, ...args);
	}

	info(message: string, meta: any, ...args) {
		this.log('info', message, meta, ...args);
	}

	warn(message: string, meta: any, ...args) {
		this.log('warn', message, meta, ...args);
	}
}
