declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    FIELDWORK_HOST?: string;
    FIELDWORK_ACCESS_TEAM_DOMAIN?: string;
    FIELDWORK_ACCESS_AUD?: string;
    BUCKET?: R2Bucket;
  }
}
