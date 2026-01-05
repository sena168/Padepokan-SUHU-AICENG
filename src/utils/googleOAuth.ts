// Google OAuth utility functions
interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export class GoogleOAuth {
  private static clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  private static redirectUri = window.location.origin + '/auth/google/callback';

  static getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  static async exchangeCodeForToken(code: string): Promise<GoogleUser> {
    // Validate input
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid authorization code');
    }

    if (!this.clientId || this.clientId === 'your_client_id_here') {
      throw new Error('Google OAuth is not properly configured');
    }

    if (!import.meta.env.VITE_GOOGLE_CLIENT_SECRET) {
      throw new Error('Google client secret is missing');
    }

    try {
      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(
          `Token exchange failed: ${tokenResponse.status} - ${
            errorData.error || 'Authentication error'
          }`
        );
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        throw new Error('No access token received from Google');
      }

      // Fetch user info using the access token
      const userResponse = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user info: ${userResponse.status}`);
      }

      const userInfo = await userResponse.json();

      // Validate required user info fields
      if (!userInfo.sub || !userInfo.email) {
        throw new Error('Incomplete user information received from Google');
      }

      return {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name || 'Google User',
        picture: userInfo.picture || '',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unexpected error during Google OAuth process');
    }
  }

  static initiateLogin() {
    window.location.href = this.getAuthUrl();
  }

  static handleCallback(): { code: string | null; error: string | null } {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    return { code, error };
  }

  static isConfigured(): boolean {
    return !!this.clientId && this.clientId !== 'your_client_id_here';
  }
}
