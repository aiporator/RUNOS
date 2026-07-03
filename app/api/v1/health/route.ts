// GET /api/v1/health — liveness probe. The only unauthenticated REST endpoint
// (webhook receivers use provider verification instead of Bearer auth).
export async function GET(): Promise<Response> {
  return Response.json({ status: 'ok', version: '1.0.0-demo' });
}
