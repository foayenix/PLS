type SigningKey = JsonWebKey & { kid?: string; alg?: string };
type AccessClaims = { iss?: unknown; aud?: unknown; exp?: unknown; nbf?: unknown; sub?: unknown; email?: unknown; name?: unknown };

const keyCache = new Map<string, { expires: number; keys: SigningKey[] }>();
const jwtDecoder = new TextDecoder();

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), char => char.charCodeAt(0));
}

async function signingKey(issuer: string, kid: string): Promise<SigningKey | undefined> {
  const cached = keyCache.get(issuer);
  if (cached && cached.expires > Date.now()) {
    const match = cached.keys.find(key => key.kid === kid);
    if (match) return match;
  }
  const response = await fetch(issuer + '/cdn-cgi/access/certs', { redirect: 'error' });
  if (!response.ok) return;
  const { keys } = await response.json<{ keys: SigningKey[] }>();
  if (!Array.isArray(keys)) return;
  keyCache.set(issuer, { keys, expires: Date.now() + 5 * 60_000 });
  return keys.find(key => key.kid === kid);
}

export async function authenticateCloudflareRequest(request: Request, team: string | undefined, audience: string | undefined) {
  if (!team || !audience || !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(team)) return null;
  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token || token.length > 16384) return null;
  const [encodedHeader, encodedClaims, signature, ...extra] = token.split('.');
  if (!encodedHeader || !encodedClaims || !signature || extra.length) return null;

  try {
    const header = JSON.parse(jwtDecoder.decode(fromBase64Url(encodedHeader)));
    if (header.alg !== 'RS256' || typeof header.kid !== 'string') return null;
    const claims: AccessClaims = JSON.parse(jwtDecoder.decode(fromBase64Url(encodedClaims)));
    const issuer = 'https://' + team;
    const now = Date.now() / 1000;
    if (claims.iss !== issuer || !Array.isArray(claims.aud) || !claims.aud.includes(audience)
      || typeof claims.exp !== 'number' || claims.exp <= now
      || claims.nbf !== undefined && (typeof claims.nbf !== 'number' || claims.nbf > now)
      || typeof claims.sub !== 'string' || !claims.sub
      || typeof claims.email !== 'string' || !claims.email) return null;

    const jwk = await signingKey(issuer, header.kid);
    if (!jwk || jwk.kty !== 'RSA' || jwk.alg && jwk.alg !== 'RS256') return null;
    const algorithm = 'RSASSA-PKCS1-v1_5';
    const key = await crypto.subtle.importKey('jwk', jwk, { name: algorithm, hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify(algorithm, key, fromBase64Url(signature), new TextEncoder().encode(encodedHeader + '.' + encodedClaims));
    if (!valid) return null;

    const headers = new Headers(request.headers);
    for (const name of [...headers.keys()]) {
      if (name.startsWith('oai-authenticated-user-')) headers.delete(name);
    }
    headers.set('oai-authenticated-user-id', 'cloudflare:' + claims.sub);
    headers.set('oai-authenticated-user-email', claims.email);
    if (typeof claims.name === 'string' && claims.name) {
      headers.set('oai-authenticated-user-full-name', encodeURIComponent(claims.name));
      headers.set('oai-authenticated-user-full-name-encoding', 'percent-encoded-utf-8');
    }
    return new Request(request, { headers });
  } catch {
    return null;
  }
}
