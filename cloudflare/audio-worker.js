export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response("thepill-audio ok", {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    const key = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
    if (!key || key.includes("..")) {
      return new Response("Bad request", { status: 400 });
    }

    const object = await env.AUDIO.get(key);
    if (object === null) {
      return new Response(`Not found: ${key}`, { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    if (typeof object.size === "number" && object.size >= 0) {
      headers.set("Content-Length", String(object.size));
    }
    if (!headers.get("Content-Type")) {
      headers.set("Content-Type", "audio/mpeg");
    }

    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }

    return new Response(object.body, { status: 200, headers });
  },
};
