import { Inject, Service } from 'typedi';
import { ApiService } from 'src/services/api.service';

@Service()
export class UserService {
	private user;
	constructor(
		@Inject(() => ApiService) private readonly apiService: ApiService,
		@Inject('context') private readonly ctx
	) {}

	getUser() {
		try {
			if (typeof window === 'undefined' && this.ctx.req) {
				return import('src/auth/config').then(async (auth0) => {
					const session = await auth0.default.getSession(
						this.ctx.req
					);
					return session?.user || null;
				});
			} else {
				if (this.user) {
					return this.user;
				}
				return this.apiService
					.api()
					.get('/auth/profile')
					.then(({ data }) => data);
			}
		} catch (e) {
			return null;
		}
	}
}
