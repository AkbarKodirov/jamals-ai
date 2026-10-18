// Draws a geometry figure spec ({width,height,shapes}) as an SVG string.
export function drawFigure(f) {
  const W = Number(f.width) || 10
  const H = Number(f.height) || 8
  const S = 34
  const P = 22
  const X = (x) => P + x * S
  const Y = (y) => P + (H - y) * S
  const out = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W * S + 2 * P} ${H * S + 2 * P}" width="${W * S + 2 * P}" height="${H * S + 2 * P}" font-family="Times New Roman, serif" font-size="17">`, `<rect width="100%" height="100%" fill="#fff"/>`]
  const st = 'fill="none" stroke="#111" stroke-width="2"'
  for (const s of f.shapes || []) {
    try {
      if (s.kind === 'polygon') out.push(`<polygon points="${s.points.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')}" ${st}/>`)
      if (s.kind === 'segment') out.push(`<line x1="${X(s.from[0])}" y1="${Y(s.from[1])}" x2="${X(s.to[0])}" y2="${Y(s.to[1])}" ${st}/>`)
      if (s.kind === 'circle') out.push(`<circle cx="${X(s.center[0])}" cy="${Y(s.center[1])}" r="${s.r * S}" ${st}/>`)
      if (s.kind === 'point') out.push(`<circle cx="${X(s.at[0])}" cy="${Y(s.at[1])}" r="3.5" fill="#111"/>${s.label ? `<text x="${X(s.at[0]) + 7}" y="${Y(s.at[1]) - 7}" font-style="italic">${s.label}</text>` : ''}`)
      if (s.kind === 'label') out.push(`<text x="${X(s.at[0])}" y="${Y(s.at[1])}" text-anchor="middle" dominant-baseline="middle">${String(s.text).replace(/</g, '&lt;')}</text>`)
      if (s.kind === 'rightangle') {
        const [[a, b], [c, d]] = s.dir
        const k = 0.45
        const p1 = [s.at[0] + a * k, s.at[1] + b * k]
        const p2 = [s.at[0] + (a + c) * k, s.at[1] + (b + d) * k]
        const p3 = [s.at[0] + c * k, s.at[1] + d * k]
        out.push(`<polyline points="${[p1, p2, p3].map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')}" fill="none" stroke="#111" stroke-width="1.5"/>`)
      }
      if (s.kind === 'arc') {
        const r = s.r * S
        const a0 = (s.from * Math.PI) / 180
        const a1 = (s.to * Math.PI) / 180
        const x0 = X(s.center[0]) + r * Math.cos(a0)
        const y0 = Y(s.center[1]) - r * Math.sin(a0)
        const x1 = X(s.center[0]) + r * Math.cos(a1)
        const y1 = Y(s.center[1]) - r * Math.sin(a1)
        out.push(`<path d="M${x0} ${y0} A${r} ${r} 0 ${Math.abs(s.to - s.from) > 180 ? 1 : 0} 0 ${x1} ${y1}" fill="none" stroke="#111" stroke-width="1.5"/>`)
      }
    } catch {
      /* skip a malformed shape */
    }
  }
  out.push('</svg>')
  return out.join('')
}

