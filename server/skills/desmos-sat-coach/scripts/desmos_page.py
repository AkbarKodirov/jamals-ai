#!/usr/bin/env python3
"""Make an HTML page that opens the REAL Desmos calculator with the solve lines already typed.
Desmos itself computes the regression panel, the results and the graph, so nothing on the screen is made up.

Usage:  python3 desmos_page.py page.json out.html
page.json:
{
  "title": "Pyramid volume",
  "latex": ["\\left[s,l,h\\right]\\sim\\left[10,13,\\sqrt{l^{2}-\\left(\\frac{s}{2}\\right)^{2}}\\right]",
            "\\frac{1}{3}s^{2}h"],
  "window": [-10, 10, -10, 10]          # optional
}
Open the page in any browser (it needs internet to load desmos.com). "Save picture" downloads a PNG of the graph.
"""
import html, json, sys

PAGE = """<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>body{{margin:0;font-family:Arial,sans-serif;background:#fff}}#bar{{padding:8px 12px;display:flex;gap:12px;align-items:center}}
#calc{{width:100%;height:calc(100vh - 48px)}}button{{padding:6px 12px}}</style></head>
<body><div id="bar"><b>{title}</b><button id="save">Save picture</button></div><div id="calc"></div>
<script src="https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>
<script>
const calc = Desmos.GraphingCalculator(document.getElementById("calc"), {{expressionsCollapsed: false}});
{lines}.forEach((latex, i) => calc.setExpression({{id: "e" + i, latex}}));
{window}
document.getElementById("save").onclick = () => calc.asyncScreenshot({{showLabels: true, width: 800, height: 500}}, (uri) => {{
  const a = document.createElement("a"); a.href = uri; a.download = "desmos-screen.png"; a.click(); }});
</script></body></html>
"""


def page(spec):
    w = spec.get("window")
    win = (f"calc.setMathBounds({{left: {w[0]}, right: {w[1]}, bottom: {w[2]}, top: {w[3]}}});" if w else "")
    return PAGE.format(title=html.escape(spec.get("title", "Desmos solve")), lines=json.dumps(spec["latex"]), window=win)


if __name__ == "__main__":
    spec = json.load(open(sys.argv[1], encoding="utf-8"))
    open(sys.argv[2], "w", encoding="utf-8").write(page(spec))
    print("wrote", sys.argv[2])
