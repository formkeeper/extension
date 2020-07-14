async function SHA256(str) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  const byteArr = Array.from(new Uint8Array(buffer));
  return bytesToHex(byteArr);
}

function bytesToHex(byteArr) {
  return byteArr.map(byte => byte.toString(16).padStart(2, "0")).join("");
}

export default SHA256;