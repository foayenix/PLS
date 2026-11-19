declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    FIELDWORK_HOST?: string;
    FIELDWORK_ACCESS_TEAM_DOMAIN?: string;
    FIELDWORK_ACCESS_AUD?: string;
    OPENAI_API_KEY?: string;
    FIELDWORK_OPENAI_MODEL?: string;
    FIELDWORK_OLLAMA_MODEL?: string;
    BUCKET?: R2Bucket;
  }
}
