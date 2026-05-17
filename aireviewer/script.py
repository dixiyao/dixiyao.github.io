#!/usr/bin/env python3
"""Generate the Cohen's kappa heatmap used by the AIReviewer project page.

The script intentionally uses only Python's standard library so it can run in
minimal static-site environments. It writes an SVG image that can be edited by
changing the arrays below.
"""

from pathlib import Path


LABELS = ["Human", "Ours", "Single Agent", "Agentic Reviewer"]
RATINGS = {
    "Human": [2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "Ours": [1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    "Single Agent": [1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    "Agentic Reviewer": [1, 2, 1, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
}


def cohen_kappa(a, b):
    if len(a) != len(b):
        raise ValueError("Rating lists must have the same length.")

    labels = sorted(set(a) | set(b))
    n = len(a)
    observed = sum(x == y for x, y in zip(a, b)) / n
    expected = 0.0
    for label in labels:
        pa = sum(x == label for x in a) / n
        pb = sum(y == label for y in b) / n
        expected += pa * pb

    if expected == 1:
        return 1.0
    return (observed - expected) / (1 - expected)


def interpolate_color(value):
    """Map kappa in [-1, 1] to a red-white-green color."""
    value = max(-1.0, min(1.0, value))
    if value < 0:
        t = value + 1
        start = (164, 54, 54)
        end = (255, 250, 240)
    else:
        t = value
        start = (255, 250, 240)
        end = (31, 120, 94)

    rgb = tuple(round(start[i] + (end[i] - start[i]) * t) for i in range(3))
    return f"rgb({rgb[0]}, {rgb[1]}, {rgb[2]})"


def text_color(value):
    return "#ffffff" if abs(value) > 0.55 else "#1f2933"


def build_matrix():
    return [
        [cohen_kappa(RATINGS[left], RATINGS[right]) for right in LABELS]
        for left in LABELS
    ]


def build_svg(matrix):
    cell = 118
    left_pad = 180
    top_pad = 92
    right_pad = 60
    bottom_pad = 92
    width = left_pad + cell * len(LABELS) + right_pad
    height = top_pad + cell * len(LABELS) + bottom_pad

    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="Cohen kappa heatmap">',
        '<rect width="100%" height="100%" fill="#fffaf0"/>',
        '<text x="36" y="42" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="#243447">Pairwise Agreement: Cohen&apos;s Kappa</text>',
    ]

    for j, label in enumerate(LABELS):
        x = left_pad + j * cell + cell / 2
        svg.append(
            f'<text x="{x}" y="{top_pad - 20}" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="700" fill="#243447" text-anchor="middle">{label}</text>'
        )

    for i, label in enumerate(LABELS):
        y = top_pad + i * cell + cell / 2 + 5
        svg.append(
            f'<text x="{left_pad - 18}" y="{y}" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="700" fill="#243447" text-anchor="end">{label}</text>'
        )

    for i, row in enumerate(matrix):
        for j, value in enumerate(row):
            x = left_pad + j * cell
            y = top_pad + i * cell
            svg.append(
                f'<rect x="{x}" y="{y}" width="{cell}" height="{cell}" fill="{interpolate_color(value)}" stroke="#fffaf0" stroke-width="4" rx="10"/>'
            )
            svg.append(
                f'<text x="{x + cell / 2}" y="{y + cell / 2 + 8}" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="{text_color(value)}" text-anchor="middle">{value:.2f}</text>'
            )

    legend_x = left_pad
    legend_y = top_pad + cell * len(LABELS) + 38
    legend_w = 280
    legend_h = 14
    segments = 60
    for idx in range(segments):
        value = -1 + 2 * idx / (segments - 1)
        x = legend_x + idx * (legend_w / segments)
        svg.append(
            f'<rect x="{x:.2f}" y="{legend_y}" width="{legend_w / segments + 0.8:.2f}" height="{legend_h}" fill="{interpolate_color(value)}"/>'
        )
    svg.extend(
        [
            f'<text x="{legend_x}" y="{legend_y + 36}" font-family="Inter, Arial, sans-serif" font-size="12" fill="#52616b" text-anchor="middle">-1</text>',
            f'<text x="{legend_x + legend_w / 2}" y="{legend_y + 36}" font-family="Inter, Arial, sans-serif" font-size="12" fill="#52616b" text-anchor="middle">0</text>',
            f'<text x="{legend_x + legend_w}" y="{legend_y + 36}" font-family="Inter, Arial, sans-serif" font-size="12" fill="#52616b" text-anchor="middle">1</text>',
            f'<text x="{legend_x + legend_w + 24}" y="{legend_y + 12}" font-family="Inter, Arial, sans-serif" font-size="12" fill="#52616b">higher agreement</text>',
            "</svg>",
        ]
    )
    return "\n".join(svg)


def main():
    matrix = build_matrix()
    output = Path(__file__).resolve().parent / "assests" / "kappa_heatmap.svg"
    output.write_text(build_svg(matrix), encoding="utf-8")
    print(f"Wrote {output}")
    for label, row in zip(LABELS, matrix):
        print(label, " ".join(f"{value:.3f}" for value in row))


if __name__ == "__main__":
    main()
