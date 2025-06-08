import Cookies from "js-cookie";

// Token storage strategies for better security
export enum TokenType {
  ACCESS = "access",
  REFRESH = "refresh",
}

export interface TokenStorage {
  set: (value: string, options?: Record<string, unknown>) => void;
  get: () => string | null;
  remove: () => void;
}

// Memory storage for access tokens (most secure)
class MemoryStorage implements TokenStorage {
  private value: string | null = null;

  set(value: string): void {
    this.value = value;
  }

  get(): string | null {
    return this.value;
  }

  remove(): void {
    this.value = null;
  }
}

// Secure cookie storage for refresh tokens
class SecureCookieStorage implements TokenStorage {
  constructor(private cookieName: string) {}

  set(value: string): void {
    Cookies.set(this.cookieName, value, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: false, // Unfortunately can't use httpOnly in client-side JS
      path: "/",
    });
  }

  get(): string | null {
    return Cookies.get(this.cookieName) || null;
  }

  remove(): void {
    Cookies.remove(this.cookieName, { path: "/" });
  }
}

// Fallback localStorage (encrypted for sensitive data) - Currently unused but kept for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class EncryptedLocalStorage implements TokenStorage {
  constructor(private key: string) {}

  private encrypt(text: string): string {
    // Simple XOR encryption (in production, use crypto-js or Web Crypto API)
    const key = "climbup-secret-key";
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(result);
  }

  private decrypt(encryptedText: string): string {
    const key = "climbup-secret-key";
    const text = atob(encryptedText);
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  }

  set(value: string): void {
    try {
      const encrypted = this.encrypt(value);
      localStorage.setItem(this.key, encrypted);
    } catch (error) {
      console.warn("Failed to store token in localStorage:", error);
    }
  }

  get(): string | null {
    try {
      const encrypted = localStorage.getItem(this.key);
      return encrypted ? this.decrypt(encrypted) : null;
    } catch (error) {
      console.warn("Failed to retrieve token from localStorage:", error);
      return null;
    }
  }

  remove(): void {
    localStorage.removeItem(this.key);
  }
}

// Token manager with secure storage strategies
export class TokenManager {
  private accessTokenStorage: TokenStorage;
  private refreshTokenStorage: TokenStorage;

  constructor() {
    // Access tokens in memory (cleared on page refresh - more secure)
    this.accessTokenStorage = new MemoryStorage();

    // Refresh tokens in secure cookies (persistent but more secure than localStorage)
    this.refreshTokenStorage = new SecureCookieStorage("refreshToken");
  }

  // Access token methods
  setAccessToken(token: string): void {
    this.accessTokenStorage.set(token);

    // Also set in cookie for middleware access
    Cookies.set("accessToken", token, {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  }

  getAccessToken(): string | null {
    // Try memory first, fallback to cookie
    let token = this.accessTokenStorage.get();
    if (!token) {
      // If not in memory, try to get from cookie and restore to memory
      token = Cookies.get("accessToken") || null;
      if (token) {
        this.accessTokenStorage.set(token);
      }
    }
    return token;
  }

  removeAccessToken(): void {
    this.accessTokenStorage.remove();
    Cookies.remove("accessToken", { path: "/" });
  }

  // Refresh token methods
  setRefreshToken(token: string): void {
    this.refreshTokenStorage.set(token);
  }

  getRefreshToken(): string | null {
    return this.refreshTokenStorage.get();
  }

  removeRefreshToken(): void {
    this.refreshTokenStorage.remove();
  }

  // Combined methods
  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  clearAllTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Migrate from old localStorage storage
  migrateOldTokens(): void {
    const oldAccessToken = localStorage.getItem("accessToken");
    const oldRefreshToken = localStorage.getItem("refreshToken");

    if (oldAccessToken && oldRefreshToken) {
      this.setTokens(oldAccessToken, oldRefreshToken);

      // Clean up old storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      console.log("Migrated tokens to secure storage");
    }
  }
}

export const tokenManager = new TokenManager();
