// ============================================================
// ZIP.JS — Saf JS ile ZIP dosyası oluşturucu (Store, sıkıştırmasız)
// ============================================================

function crc32(bytes) {
  if (!crc32._t) {
    crc32._t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      crc32._t[n] = c;
    }
  }
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) c = crc32._t[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function createZip(files) {
  const enc = new TextEncoder();
  const now = new Date();
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);

  const entries = [];
  let localOffset = 0;

  for (const { name, content } of files) {
    const nameB = enc.encode(name);
    const dataB = enc.encode(content);
    const crc   = crc32(dataB);

    const lh = new Uint8Array(30 + nameB.length);
    const lv = new DataView(lh.buffer);
    lv.setUint32(0,  0x04034b50, true);   // Local file header signature
    lv.setUint16(4,  20, true);            // Version needed
    lv.setUint16(6,  0, true);             // General purpose flags
    lv.setUint16(8,  0, true);             // Compression: STORED
    lv.setUint16(10, dosTime, true);
    lv.setUint16(12, dosDate, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, dataB.length, true);  // Compressed size
    lv.setUint32(22, dataB.length, true);  // Uncompressed size
    lv.setUint16(26, nameB.length, true);
    lv.setUint16(28, 0, true);             // Extra field length
    lh.set(nameB, 30);

    entries.push({ nameB, dataB, lh, crc, size: dataB.length, dosDate, dosTime, localOffset });
    localOffset += lh.length + dataB.length;
  }

  // Central directory
  const cdParts = entries.map(e => {
    const cd = new Uint8Array(46 + e.nameB.length);
    const cv = new DataView(cd.buffer);
    cv.setUint32(0,  0x02014b50, true);
    cv.setUint16(4,  20, true);
    cv.setUint16(6,  20, true);
    cv.setUint16(8,  0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, e.dosTime, true);
    cv.setUint16(14, e.dosDate, true);
    cv.setUint32(16, e.crc, true);
    cv.setUint32(20, e.size, true);
    cv.setUint32(24, e.size, true);
    cv.setUint16(28, e.nameB.length, true);
    cv.setUint16(30, 0, true);  // Extra
    cv.setUint16(32, 0, true);  // Comment
    cv.setUint16(34, 0, true);  // Disk start
    cv.setUint16(36, 0, true);  // Internal attrs
    cv.setUint32(38, 0, true);  // External attrs
    cv.setUint32(42, e.localOffset, true);
    cd.set(e.nameB, 46);
    return cd;
  });

  const cdSize = cdParts.reduce((s, p) => s + p.length, 0);

  // End of central directory
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0,  0x06054b50, true);
  ev.setUint16(4,  0, true);
  ev.setUint16(6,  0, true);
  ev.setUint16(8,  entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, localOffset, true);
  ev.setUint16(20, 0, true);

  const parts = [
    ...entries.flatMap(e => [e.lh, e.dataB]),
    ...cdParts,
    eocd,
  ];
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const p of parts) { out.set(p, pos); pos += p.length; }
  return out;
}

function downloadZip(filename, files) {
  const bytes = createZip(files);
  const blob = new Blob([bytes], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
