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
    // In a real implementation, this would call your backend
    // For frontend-only implementation, we'll use a simplified approach
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${code}`, // Simplified - in real app, exchange code for token
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await response.json();
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
