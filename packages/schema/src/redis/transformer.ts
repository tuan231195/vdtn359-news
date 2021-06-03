import IORedis from 'ioredis';

function parseObjectResponse(reply, customParser?: Function) {
	if (!Array.isArray(reply)) {
		return reply;
	}
	const data = {};
	for (let i = 0; i < reply.length; i += 2) {
		if (customParser) {
			data[reply[i]] = customParser(reply[i], reply[i + 1]);
			continue;
		}
		data[reply[i]] = reply[i + 1];
	}
	return data;
}

function parseMessageResponse(reply) {
	if (!Array.isArray(reply)) {
		return [];
	}
	return reply.map((message) => {
		return {
			id: message[0],
			data: parseObjectResponse(message[1]),
		};
	});
}

function parseStreamResponse(reply) {
	if (!Array.isArray(reply)) {
		return reply;
	}
	const object = {};
	for (const stream of reply) {
		object[stream[0]] = parseMessageResponse(stream[1]);
	}
	return object;
}

const transformers = {
	xread: parseStreamResponse,
	xpending(reply) {
		if (!reply || reply.length === 0) {
			return [];
		}
		if (reply.length === 4 && !isNaN(reply[0]))
			return {
				count: parseInt(reply[0]),
				minId: reply[1],
				maxId: reply[2],
				consumers: (reply[3] || []).map((consumer) => {
					return {
						name: consumer[0],
						count: parseInt(consumer[1]),
					};
				}),
			};
		return reply.map((message) => {
			return {
				id: message[0],
				consumerName: message[1],
				elapsedMilliseconds: parseInt(message[2]),
				deliveryCount: parseInt(message[3]),
			};
		});
	},
	xreadgroup: parseStreamResponse,
	xrange: parseMessageResponse,
	xrevrange: parseMessageResponse,
	xclaim: parseMessageResponse,
	xinfo(reply) {
		return parseObjectResponse(reply, (key, value) => {
			switch (key) {
				case 'first-entry':
				case 'last-entry':
					if (!Array.isArray(value)) {
						return value;
					}
					return {
						id: value[0],
						data: parseObjectResponse(value[1]),
					};
				default:
					return value;
			}
		});
	},
};

Object.keys(transformers).forEach((commandName) => {
	IORedis.Command.setReplyTransformer(commandName, transformers[commandName]);
});
