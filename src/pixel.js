// Integer-only raster tools: even diagonals, curves and light are made of pixels.
export function painter(context) {
  const r = (color, x, y, w = 1, h = 1) => {
    context.fillStyle = color;
    context.fillRect(
      Math.round(x),
      Math.round(y),
      Math.max(1, Math.round(w)),
      Math.max(1, Math.round(h)),
    );
  };
  const poly = (color, points) => {
    const top = Math.floor(Math.min(...points.map((p) => p[1])));
    const bottom = Math.ceil(Math.max(...points.map((p) => p[1])));
    for (let y = top; y < bottom; y++) {
      const cuts = [];
      for (let i = 0; i < points.length; i++) {
        const [ax, ay] = points[i],
          [bx, by] = points[(i + 1) % points.length];
        if ((ay <= y && by > y) || (by <= y && ay > y))
          cuts.push(ax + ((y - ay) * (bx - ax)) / (by - ay));
      }
      cuts.sort((a, b) => a - b);
      for (let i = 0; i + 1 < cuts.length; i += 2)
        r(color, cuts[i], y, cuts[i + 1] - cuts[i], 1);
    }
  };
  const line = (color, ax, ay, bx, by, width = 1) => {
    const steps = Math.max(Math.abs(bx - ax), Math.abs(by - ay), 1);
    for (let i = 0; i <= steps; i++)
      r(
        color,
        ax + ((bx - ax) * i) / steps,
        ay + ((by - ay) * i) / steps,
        width,
        width,
      );
  };
  const ellipse = (color, cx, cy, rx, ry = rx) => {
    for (let y = -ry; y <= ry; y++) {
      const extent = Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))) * rx;
      r(color, cx - extent, cy + y, extent * 2, 1);
    }
  };
  return { r, poly, line, ellipse };
}
export function seeded(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
export function texture(scene, name, w, h, draw) {
  const t = scene.textures.createCanvas(name, w, h);
  t.context.imageSmoothingEnabled = false;
  draw(
    painter(t.context),
    seeded(1297 + name.split("").reduce((n, c) => n + c.charCodeAt(0), 0)),
  );
  t.refresh();
}
