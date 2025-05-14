/**
 * Decodifica o payload de um JWT (base64) e retorna como objeto.
 * Se algo der errado, retorna {}.
 */
export function parseJwt(token) {
  try {
    const [, payloadBase64] = token.split('.');
    const jsonPayload       = atob(payloadBase64);       // decode base64
    return JSON.parse(jsonPayload);                      // parse JSON
  } catch (e) {
    console.error('parseJwt error:', e);
    return {};
  }
}
