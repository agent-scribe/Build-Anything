declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET?: string;
    GITHUB_ID?: string;
    GITHUB_SECRET?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    ANTHROPIC_API_KEY?: string;
  }
}
