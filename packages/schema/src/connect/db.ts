import { DB, DBWrapper } from 'src/db';
import { proxy } from '@vdtn359/news-utils';
import firebase from 'firebase-admin';

export type ConnectDBOptions = {
	clientEmail: string;
	privateKey: string;
	projectId: string;
};

export function connectDB({
	clientEmail,
	privateKey,
	projectId,
}: ConnectDBOptions): DB {
	let app: firebase.app.App;
	if (firebase.apps.length) {
		app = firebase.apps[0];
	} else {
		app = firebase.initializeApp({
			projectId,
			credential: firebase.credential.cert({
				clientEmail,
				projectId,
				privateKey: Buffer.from(privateKey, 'base64').toString('utf-8'),
			}),
		});
	}
	const firestore = app.firestore();
	const db = new DBWrapper(firestore);
	return proxy.wrap(db, firestore);
}

export function connectDBUsingConfig(config) {
	return connectDB({
		clientEmail: config.get('db.clientEmail'),
		projectId: config.get('db.projectId'),
		privateKey: config.get('db.privateKey'),
	});
}
