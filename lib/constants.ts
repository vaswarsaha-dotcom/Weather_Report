// Kept dependency-free (no bcrypt/jsonwebtoken imports) so middleware.ts,
// which runs on the Edge runtime, can import just this constant without
// pulling Node-only auth libraries into the Edge bundle.
export const SESSION_COOKIE_NAME = "ws_session";
