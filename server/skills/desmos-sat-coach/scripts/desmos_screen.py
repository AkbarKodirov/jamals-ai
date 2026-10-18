#!/usr/bin/env python3
"""Draw a Desmos-style screen (expression list + graph) as an SVG picture. Standard library only.

Usage:  python3 desmos_screen.py spec.json out.svg
spec.json:
{
  "lines":  [ {"text": "[s, l, h] ~ [10, 13, sqrt(l^2 - (s/2)^2)]",
               "params_py": {"s": "10", "l": "13", "h": "sqrt(13**2 - 5**2)"}, "rmse": "0"},
              {"text": "(1/3)s^2 h", "result_py": "(1/3)*10**2*12"},
              {"text": "y = x^2 - 4x - 5", "color": "red"} ],
  "curves": [ {"py": "x**2 - 4*x - 5", "color": "red"} ],      # optional, python in x (math.* allowed)
  "points": [ {"x": "5", "curve": 0}, {"x": "-1", "curve": 0}, {"x": "2", "curve": 0} ],
  "window": [-10, 10, -10, 10]                                    # optional; the graph paper is always drawn
}
A line can add "color" or "graphed": true to show the colored icon; a curve can add "dashed": true.
Numbers are COMPUTED here, never typed in: "result_py" and "params_py" are python expressions the script
evaluates and prints, and a point's y and its label come from its curve. Hand-typed "result", "params" or
[x, y, "label"] points are still accepted, but the script stops with an error when a typed number disagrees
with a computed one or a point does not sit on a graphed curve. Fix the math, never the picture.
"""
import json, math, sys
from xml.sax.saxutils import escape as _esc


def escape(t):
    return _esc(t).replace("  ", "\u00a0\u00a0")

COLORS = {"red": "#c74440", "blue": "#2d70b3", "green": "#388c46", "purple": "#6042a6", "orange": "#fa7e19", "black": "#000000"}
ORDER = ["red", "blue", "green", "purple", "orange", "black"]


ENV = {k: getattr(math, k) for k in dir(math) if not k.startswith("_")}
ENV.update(abs=abs, round=round, min=min, max=max, sum=sum)


def ev(expr, **kw):
    return float(eval(str(expr), {"__builtins__": {}}, dict(ENV, **kw)))


def fmt(v):
    if abs(v - round(v)) < 1e-9:
        return str(int(round(v)))
    return f"{v:.6g}"


def close(a, b):
    return abs(a - b) <= 1e-3 * max(1.0, abs(b))


def nums(text):
    import re
    return [float(t) for t in re.findall(r"-?\d+(?:\.\d+)?", text)]


def prepare(spec):
    """Compute every number, and refuse a picture whose typed numbers disagree with the math."""
    errors, curves = [], spec.get("curves", [])
    for i, ln in enumerate(spec.get("lines", [])):
        if "result_py" in ln:
            val = ev(ln["result_py"])
            if "result" in ln and not close(nums(str(ln["result"]))[0], val):
                errors.append(f"line {i + 1}: typed result {ln['result']} but it computes to {fmt(val)}")
            ln["result"] = fmt(val)
        if "params_py" in ln:
            vals = {k: ev(v) for k, v in ln["params_py"].items()}
            typed = ln.get("params")
            if typed:
                for k, v in vals.items():
                    import re
                    m = re.search(rf"(?<![A-Za-z_]){re.escape(k)}\s*=\s*(-?\d+(?:\.\d+)?)", typed)
                    if m and not close(float(m.group(1)), v):
                        errors.append(f"line {i + 1}: typed {k} = {m.group(1)} but it computes to {fmt(v)}")
            ln["params"] = "     ".join(f"{k} = {fmt(v)}" for k, v in vals.items())
    pts = []
    for j, p in enumerate(spec.get("points", [])):
        if isinstance(p, dict):
            px = ev(p["x"])
            if "y" in p:
                py = ev(p["y"])
            elif curves:
                py = ev(curves[p.get("curve", 0)]["py"], x=px)
            else:
                errors.append(f"point {j + 1}: give y or a curve"); continue
            label = p.get("label") or f"({fmt(px)}, {fmt(py)})"
        else:
            px, py = float(p[0]), float(p[1])
            label = p[2] if len(p) > 2 else f"({fmt(px)}, {fmt(py)})"
        if curves:
            span = max(1.0, abs(spec.get("window", [-10, 10, -10, 10])[3] - spec.get("window", [-10, 10, -10, 10])[2]))
            on = []
            for cv in curves:
                try:
                    on.append(abs(ev(cv["py"], x=px) - py) <= 2e-3 * span)
                except Exception:
                    on.append(False)
            if not any(on):
                errors.append(f"point {j + 1} ({fmt(px)}, {fmt(py)}) is not on any graphed curve")
        ln_nums = nums(label)
        if len(ln_nums) >= 2 and not (close(ln_nums[0], px) and close(ln_nums[1], py)):
            errors.append(f"point {j + 1}: label {label} does not match its position ({fmt(px)}, {fmt(py)})")
        pts.append([px, py, label])
    spec["points"] = pts
    if errors:
        sys.exit("Picture refused, the numbers do not match the math:\n  " + "\n  ".join(errors))
    return spec


def _group(t, i):
    """Read an exponent/subscript starting at t[i]: (..), {..} or a run of letters/digits."""
    if i < len(t) and t[i] in "({":
        close_ch, depth, k = ")" if t[i] == "(" else "}", 0, i
        while k < len(t):
            depth += t[k] in "({"
            depth -= t[k] in ")}"
            if depth == 0:
                break
            k += 1
        return t[i + 1:k], k + 1
    k = i + (1 if i < len(t) and t[i] == "-" else 0)
    while k < len(t) and (t[k].isalnum() or t[k] == "."):
        k += 1
    return t[i:k], k


def _plain(t):
    for a, b in (("sqrt", "√"), ("pi", "π"), ("*", "·"), ("<=", "≤"), (">=", "≥"), ("~", "∼")):
        t = t.replace(a, b)
    return t


WORDS = ("of", "mean", "median", "stdev", "total", "round", "random", "min", "max", "sin", "cos", "tan", "ln", "log",
         "abs", "RMSE", "length", "sort", "for")


def _ital(text):
    """Escape text and set single letters in italic, as Desmos does; function names and numbers stay upright."""
    import re
    out = []
    for part in re.split(r"([A-Za-z]+)", _plain(text)):
        if part and part.isalpha() and part not in WORDS:
            out.append(f'<tspan font-style="italic">{escape(part)}</tspan>')
        else:
            out.append(escape(part))
    return "".join(out)


def mathify(t, size):
    """Desmos-like math text: x_1 as a subscript, ^ as a superscript, sqrt as a root sign, * as a dot."""
    out, buf, i = [], "", 0
    small, up, down = int(size * 0.68), int(size * 0.42), int(size * 0.25)
    while i < len(t):
        ch = t[i]
        if ch in "^_" and i + 1 < len(t):
            g, i = _group(t, i + 1)
            out.append(_ital(buf)); buf = ""
            dy = -up if ch == "^" else down
            out.append(f'<tspan dy="{dy}" font-size="{small}">{_ital(g)}</tspan><tspan dy="{-dy}"> </tspan>')
            continue
        buf += ch
        i += 1
    out.append(_ital(buf))
    return "".join(out)


def screen(spec):
    spec = prepare(spec)
    lines, curves, points = spec.get("lines", []), spec.get("curves", []), spec.get("points", [])
    LW, GW, TB = 420, 500, 44
    W = LW + GW
    rows, y = [], TB
    for i, ln in enumerate(lines):
        h = 60 + (92 if ln.get("params") else 0) + (34 if ln.get("result") else 0)
        rows.append((i, ln, y, h))
        y += h
    H = max(y + 60, 460)
    ink, grey, line_c = "#000", "#666", "#e2e2e2"
    sans = 'font-family="Helvetica, Arial, sans-serif"'
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Times New Roman, Times, serif">',
           f'<rect width="{W}" height="{H}" fill="#fff"/>',
           # toolbar: + , undo, redo, settings, collapse
           f'<rect width="{LW}" height="{TB}" fill="#f6f6f6"/><line x1="0" y1="{TB}" x2="{LW}" y2="{TB}" stroke="#ccc"/>',
           f'<text x="16" y="31" font-size="28" fill="#444" {sans}>+</text>',
           f'<text x="{LW - 210}" y="29" font-size="20" fill="#555" {sans}>↶</text><text x="{LW - 180}" y="29" font-size="20" fill="#bbb" {sans}>↷</text>',
           f'<text x="{LW - 70}" y="30" font-size="20" fill="#555" {sans}>⚙</text><text x="{LW - 38}" y="30" font-size="22" fill="#555" {sans}>«</text>']
    for i, ln, y0, h in rows:
        col = COLORS.get(ln.get("color") or ORDER[i % len(ORDER)], "#2d70b3")
        out.append(f'<rect x="0" y="{y0}" width="{LW}" height="{h}" fill="#fff"/><line x1="0" y1="{y0 + h}" x2="{LW}" y2="{y0 + h}" stroke="{line_c}"/>')
        out.append(f'<rect x="0" y="{y0}" width="52" height="{h}" fill="#f6f6f6"/><line x1="52" y1="{y0}" x2="52" y2="{y0 + h}" stroke="{line_c}"/>'
                   f'<text x="5" y="{y0 + 14}" font-size="11" fill="#999" {sans}>{i + 1}</text>')
        if ln.get("color") or ln.get("graphed"):
            out.append(f'<circle cx="26" cy="{y0 + 32}" r="11" fill="{col}"/>'
                       f'<path d="M18 {y0 + 33} q4 -8 8 0 t8 0" fill="none" stroke="#fff" stroke-width="2.2"/>')
        out.append(f'<text x="{LW - 22}" y="{y0 + 22}" font-size="16" fill="#bbb" {sans}>×</text>')
        out.append(f'<text x="66" y="{y0 + 38}" font-size="21">{mathify(ln["text"], 21)}</text>')
        yy = y0 + 60
        if ln.get("params"):
            out.append(f'<text x="66" y="{yy + 6}" font-size="11" fill="{grey}" {sans} letter-spacing="0.5">REGRESSION PARAMETERS</text>'
                       f'<circle cx="246" cy="{yy + 2}" r="6" fill="#888"/><text x="243" y="{yy + 6}" font-size="9" fill="#fff" {sans}>?</text>')
            px = 66
            for part in [p.strip() for p in ln["params"].split("     ") if p.strip()]:
                out.append(f'<text x="{px}" y="{yy + 30}" font-size="18">{mathify(part, 18)}</text>')
                px += max(110, 11 * len(part))
            out.append(f'<text x="66" y="{yy + 56}" font-size="11" fill="{grey}" {sans} letter-spacing="0.5">STATISTICS</text>'
                       f'<text x="230" y="{yy + 56}" font-size="11" fill="{grey}" {sans} letter-spacing="0.5">RESIDUALS</text>'
                       f'<text x="66" y="{yy + 80}" font-size="16"><tspan font-style="italic">RMSE</tspan> = {escape(str(ln.get("rmse", "0")))}</text>'
                       f'<text x="230" y="{yy + 80}" font-size="16" font-style="italic">e<tspan dy="4" font-size="11">1</tspan></text>')
            yy += 92
        if ln.get("result"):
            val = escape(str(ln["result"]))
            bw = max(40, 10 * len(val) + 20)
            out.append(f'<text x="{LW - bw - 22}" y="{yy + 15}" font-size="17" fill="#888" text-anchor="end">=</text>'
                       f'<rect x="{LW - bw - 12}" y="{yy - 4}" width="{bw}" height="27" rx="4" fill="#f0f0f0" stroke="#ddd"/>'
                       f'<text x="{LW - 12 - bw / 2:.1f}" y="{yy + 15}" font-size="17" text-anchor="middle">{val}</text>')
    # empty row with the next index, as in Desmos
    out.append(f'<rect x="0" y="{y}" width="52" height="50" fill="#f6f6f6"/><text x="5" y="{y + 14}" font-size="11" fill="#999" {sans}>{len(lines) + 1}</text>'
               f'<line x1="0" y1="{y + 50}" x2="{LW}" y2="{y + 50}" stroke="{line_c}"/>')
    out.append(f'<line x1="{LW}" y1="0" x2="{LW}" y2="{H}" stroke="#bbb" stroke-width="1.5"/>')

    # ---- graph paper (always shown, like Desmos) ----
    gx, gy, gw, gh = LW + 1, 0, GW - 1, H
    x0, x1, y0, y1 = spec.get("window") or [-10, 10, -10 * gh / gw, 10 * gh / gw]
    X = lambda v: gx + (v - x0) / (x1 - x0) * gw
    Y = lambda v: gy + (y1 - v) / (y1 - y0) * gh
    raw = max(x1 - x0, y1 - y0) / 4
    mag = 10 ** math.floor(math.log10(raw))
    major = next(f * mag for f in (1, 2, 5, 10) if f * mag >= raw / 2)
    minor = major / (4 if str(major)[0] == "2" else 5)
    for step, colr in ((minor, "#f0f0f0"), (major, "#d6d6d6")):
        v = math.ceil(x0 / step) * step
        while v <= x1 + 1e-9:
            out.append(f'<line x1="{X(v):.1f}" y1="{gy}" x2="{X(v):.1f}" y2="{gy + gh}" stroke="{colr}"/>')
            v += step
        v = math.ceil(y0 / step) * step
        while v <= y1 + 1e-9:
            out.append(f'<line x1="{gx}" y1="{Y(v):.1f}" x2="{gx + gw}" y2="{Y(v):.1f}" stroke="{colr}"/>')
            v += step
    ax = Y(0) if y0 < 0 < y1 else gy + gh - 4
    ay = X(0) if x0 < 0 < x1 else gx + 4
    if x0 < 0 < x1:
        out.append(f'<line x1="{X(0):.1f}" y1="{gy}" x2="{X(0):.1f}" y2="{gy + gh}" stroke="#000" stroke-width="1.5"/>')
    if y0 < 0 < y1:
        out.append(f'<line x1="{gx}" y1="{Y(0):.1f}" x2="{gx + gw}" y2="{Y(0):.1f}" stroke="#000" stroke-width="1.5"/>')
    halo = 'stroke="#fff" stroke-width="3" paint-order="stroke"'
    v = math.ceil(x0 / major) * major
    while v <= x1 + 1e-9:
        if abs(v) > 1e-9 and X(v) < gx + gw - 8:
            out.append(f'<text x="{X(v):.1f}" y="{min(ax + 16, gy + gh - 4):.1f}" font-size="13" fill="#222" text-anchor="middle" {sans} {halo}>{fmt(v)}</text>')
        v += major
    v = math.ceil(y0 / major) * major
    while v <= y1 + 1e-9:
        if abs(v) > 1e-9 and Y(v) > gy + 10:
            out.append(f'<text x="{max(ay - 5, gx + 26):.1f}" y="{Y(v) + 4:.1f}" font-size="13" fill="#222" text-anchor="end" {sans} {halo}>{fmt(v)}</text>')
        v += major
    if x0 < 0 < x1 and y0 < 0 < y1:
        out.append(f'<text x="{X(0) - 5:.1f}" y="{Y(0) + 16:.1f}" font-size="13" fill="#222" text-anchor="end" {sans} {halo}>0</text>')
    out.insert(1, f'<defs><clipPath id="g"><rect x="{gx}" y="{gy}" width="{gw}" height="{gh}"/></clipPath></defs>')
    for j, cv in enumerate(curves):
        col = COLORS.get(cv.get("color") or ORDER[j % len(ORDER)], "#c74440")
        segs, cur = [], []
        for n in range(1201):
            xv = x0 + (x1 - x0) * n / 1200
            try:
                yv = ev(cv["py"], x=xv)
                ok = y0 - (y1 - y0) < yv < y1 + (y1 - y0)
            except Exception:
                ok = False
            if ok:
                cur.append(f"{X(xv):.1f},{Y(yv):.1f}")
            elif cur:
                segs.append(cur); cur = []
        if cur:
            segs.append(cur)
        dash = ' stroke-dasharray="10 7"' if cv.get("dashed") else ""
        for sg in segs:
            out.append(f'<polyline points="{" ".join(sg)}" fill="none" stroke="{col}" stroke-width="2.5" stroke-linejoin="round"{dash} clip-path="url(#g)"/>')
    for px, py, lab in points:
        bw = 9 * len(lab) + 14
        lx = X(px) + 10 if X(px) + 10 + bw < gx + gw else X(px) - 10 - bw
        ly = Y(py) - 32 if Y(py) - 32 > gy + 4 else Y(py) + 10
        out.append(f'<circle cx="{X(px):.1f}" cy="{Y(py):.1f}" r="6" fill="#666" stroke="#fff" stroke-width="1.5"/>'
                   f'<rect x="{lx:.1f}" y="{ly:.1f}" width="{bw}" height="25" rx="3" fill="#fff" stroke="#c8c8c8"/>'
                   f'<text x="{lx + bw / 2:.1f}" y="{ly + 18:.1f}" font-size="16" text-anchor="middle">{escape(lab)}</text>')
    out.append("</svg>")
    return "\n".join(out)


if __name__ == "__main__":
    spec = json.load(open(sys.argv[1], encoding="utf-8"))
    open(sys.argv[2], "w", encoding="utf-8").write(screen(spec))
    print("wrote", sys.argv[2])
