import 'reflect-metadata';

import { Service } from 'typedi';
import axios, { AxiosInstance } from 'axios';
import { config } from 'src/setup';
import querystring from 'querystring';
import jwtDecode from 'jwt-decode';

@Service()
export class Auth0Service {
	private readonly api: AxiosInstance;
	private token: string;
	constructor() {
		this.api = axios.create({
			baseURL: `https://${config.auth.domain}/api`,
		});
		this.api.interceptors.request.use(async (config) => {
			config.headers.Authorization = `Bearer ${await this.getToken()}`;
			return config;
		});
	}

	private async getToken() {
		if (this.token) {
			const decodedPayload = jwtDecode(this.token);
			if (decodedPayload.exp * 1000 - 10000 > new Date().getTime()) {
				return this.token;
			}
		}
		this.token = await axios
			.post(
				`https://${config.auth.domain}/oauth/token`,
				querystring.stringify({
					grant_type: 'client_credentials',
					client_id: config.auth.clientId,
					client_secret: config.auth.clientSecret,
					audience: `https://${config.auth.domain}/api/v2/`,
				})
			)
			.then(({ data }) => data.access_token);
		return this.token;
	}

	async getUsers(userIds) {
		return this.api
			.get('/v2/users', {
				params: {
					fields: 'user_id,name,picture,email',
					q: userIds
						.map((userId) => `user_id: ${userId}`)
						.join(' OR '),
				},
			})
			.then(({ data }) => data);
	}
}
