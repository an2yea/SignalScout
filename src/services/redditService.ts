interface RedditCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken?: string;
  accessToken?: string;
  username?: string;
}

interface RedditAuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
}

export class RedditService {
  private credentials: RedditCredentials;
  private baseUrl = 'https://www.reddit.com/api/v1';
  private oauthUrl = 'https://oauth.reddit.com';
  
  constructor() {
    this.credentials = {
      clientId: import.meta.env.VITE_REDDIT_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_REDDIT_CLIENT_SECRET || '',
      refreshToken: localStorage.getItem('reddit_refresh_token') || undefined,
      accessToken: localStorage.getItem('reddit_access_token') || undefined,
    };
  }

  /**
   * Generate Reddit OAuth URL for user authentication
   */
  generateAuthUrl(): string {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('reddit_oauth_state', state);
    
    const params = new URLSearchParams({
      client_id: this.credentials.clientId,
      response_type: 'code',
      state: state,
      redirect_uri: `${window.location.origin}/auth/reddit/callback`,
      duration: 'permanent',
      scope: 'submit read identity'
    });

    return `${this.baseUrl}/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, state: string): Promise<boolean> {
    const storedState = localStorage.getItem('reddit_oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    const auth = btoa(`${this.credentials.clientId}:${this.credentials.clientSecret}`);
    
    const response = await fetch(`${this.baseUrl}/access_token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SignalScout/1.0'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${window.location.origin}/auth/reddit/callback`
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', errorText);
      throw new Error('Failed to exchange code for token');
    }

    const data: RedditAuthResponse = await response.json();
    
    // Store tokens
    localStorage.setItem('reddit_access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('reddit_refresh_token', data.refresh_token);
    }
    
    this.credentials.accessToken = data.access_token;
    this.credentials.refreshToken = data.refresh_token;

    return true;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<boolean> {
    if (!this.credentials.refreshToken) {
      return false;
    }

    const auth = btoa(`${this.credentials.clientId}:${this.credentials.clientSecret}`);
    
    const response = await fetch(`${this.baseUrl}/access_token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SignalScout/1.0'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.credentials.refreshToken
      })
    });

    if (!response.ok) {
      return false;
    }

    const data: RedditAuthResponse = await response.json();
    
    localStorage.setItem('reddit_access_token', data.access_token);
    this.credentials.accessToken = data.access_token;

    return true;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.credentials.accessToken;
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<any> {
    if (!this.credentials.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.oauthUrl}/api/v1/me`, {
      headers: {
        'Authorization': `Bearer ${this.credentials.accessToken}`,
        'User-Agent': 'SignalScout/1.0'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.getCurrentUser(); // Retry
        }
      }
      throw new Error('Failed to get user info');
    }

    return response.json();
  }

  /**
   * Post a comment to a Reddit submission
   */
  async postComment(postId: string, commentText: string): Promise<boolean> {
    if (!this.credentials.accessToken) {
      throw new Error('Not authenticated');
    }

    // Extract just the post ID from full Reddit URL if needed
    const extractedId = this.extractPostId(postId);

    const response = await fetch(`${this.oauthUrl}/api/comment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.credentials.accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SignalScout/1.0'
      },
      body: new URLSearchParams({
        thing_id: `t3_${extractedId}`, // t3_ prefix for submissions
        text: commentText,
        api_type: 'json'
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.postComment(postId, commentText); // Retry
        }
      }
      const errorText = await response.text();
      console.error('Comment post failed:', errorText);
      throw new Error(`Failed to post comment: ${response.status}`);
    }

    const result = await response.json();
    
    // Check for Reddit API errors
    if (result.json?.errors && result.json.errors.length > 0) {
      throw new Error(`Reddit API error: ${result.json.errors[0][1]}`);
    }

    return true;
  }

  /**
   * Extract post ID from Reddit URL or return as-is if already an ID
   */
  private extractPostId(postIdOrUrl: string): string {
    // If it's already a post ID (alphanumeric), return as-is
    if (/^[a-z0-9]+$/i.test(postIdOrUrl)) {
      return postIdOrUrl;
    }

    // Extract from Reddit URL
    const match = postIdOrUrl.match(/\/comments\/([a-z0-9]+)\//i);
    if (match) {
      return match[1];
    }

    // Fallback - assume it's already an ID
    return postIdOrUrl;
  }

  /**
   * Logout and clear stored tokens
   */
  logout(): void {
    localStorage.removeItem('reddit_access_token');
    localStorage.removeItem('reddit_refresh_token');
    localStorage.removeItem('reddit_oauth_state');
    this.credentials.accessToken = undefined;
    this.credentials.refreshToken = undefined;
  }
}

// Export singleton instance
export const redditService = new RedditService(); 