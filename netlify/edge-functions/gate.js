// Netlify Edge Function — blocks direct access to the Netlify origin.
// Only requests that include the matching ORIGIN_SECRET header (sent by the
// Cloudflare Worker) are allowed through.

export default async (request, context) => {
  const supplied = request.headers.get('X-Origin-Secret');
  const expected = Deno.env.get('ORIGIN_SECRET');

  if (!expected || supplied !== expected) {
    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  return context.next();
};

export const config = {
  path: '/*'
};
