interface AuthConfig {
    apiUrl: string;
    username?: string;
    password?: string;
    token?: string;
}

export class AuthManager {
    private token: string | null = null;
    private apiUrl: string;

    constructor(config: AuthConfig) {
        this.apiUrl = config.apiUrl;
        this.token = config.token || null;
    }

    async login(username: string, password: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                return false;
            }

            const result = await response.json();
            this.token = result.token;

            await Deno.writeTextFile('.auth-token', this.token!);

            console.log(`✅ Logged in as ${username}`);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }

    async loadToken(): Promise<boolean> {
        try {
            this.token = await Deno.readTextFile('.auth-token');
            return true;
        } catch {
            return false;
        }
    }

    getAuthHeaders(): HeadersInit {
        if (!this.token) {
            throw new Error('Not authenticated. Please login first.');
        }

        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }

    async ensureAuth(username?: string, password?: string): Promise<void> {
        if (this.token) {
            return;
        }

        if (await this.loadToken()) {
            return;
        }

        if (username && password) {
            if (await this.login(username, password)) {
                return;
            }
        }

        throw new Error('Authentication required. Please login with username and password.');
    }
}