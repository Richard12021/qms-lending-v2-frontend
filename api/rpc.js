const UPSTREAM = "https://rpc.testnet.qms.finance/";
const ALLOWED = new Set([
  "eth_chainId", "eth_blockNumber", "eth_call", "eth_getCode",
  "eth_getBalance", "eth_getBlockByNumber", "eth_gasPrice",
  "eth_getTransactionCount", "eth_getLogs", "eth_getTransactionReceipt",
]);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const size = Number(req.headers["content-length"] || 0);
  if (size > 65536) return res.status(413).json({ error: "Request too large" });
  const body = req.body;
  const requests = Array.isArray(body) ? body : [body];
  if (!requests.length || requests.length > 20 || requests.some(
    (r) => !r || r.jsonrpc !== "2.0" || !ALLOWED.has(r.method) ||
      !Object.prototype.hasOwnProperty.call(r, "id")
  )) {
    return res.status(400).json({ error: "Unsupported JSON-RPC request" });
  }
  const serialized = JSON.stringify(body);
  if (Buffer.byteLength(serialized) > 65536) {
    return res.status(413).json({ error: "Request too large" });
  }
  try {
    const response = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: serialized,
      signal: AbortSignal.timeout(12000),
    });
    const result = await response.text();
    if (!response.ok) return res.status(502).json({ error: "Upstream RPC failed" });
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).send(result);
  } catch (error) {
    console.error("QMS RPC proxy error:", error?.message || "unknown");
    return res.status(502).json({ error: "RPC temporarily unavailable" });
  }
}
