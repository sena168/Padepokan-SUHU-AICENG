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
      const errorData = await tokenResponse.text();
      throw new Error(
        `Token exchange failed: ${tokenResponse.status} - ${errorData}`
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

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
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await userResponse.json();
    return {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };
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
