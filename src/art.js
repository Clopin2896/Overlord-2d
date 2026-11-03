// Original pixel drawings. No remote image, font or audio dependencies.
export function makeArt(scene) {
  const tex = (name, w, h, draw) => {
    const t = scene.textures.createCanvas(name, w, h),
      c = t.context;
    c.imageSmoothingEnabled = false;
    draw(c);
    t.refresh();
  };
  const rect = (c, color, x, y, w, h) => {
    c.fillStyle = color;
    c.fillRect(x, y, w, h);
  };
  for (let pose = 0; pose < 4; pose++)
    tex(`lord${pose}`, 36, 48, (c) => {
      const r = (col, x, y, w, h) => rect(c, col, x, y, w, h),
        step = pose === 1 ? 3 : pose === 2 ? -3 : 0;
      r("#111b22", 8, 15, 21, 28);
      r("#38273e", 4, 18, 18, 26);
      r("#644456", 5, 21, 6, 22);
      r("#95616c", 5, 22, 2, 16);
      r("#2e283b", 11, 24, 8, 21);
      r("#141e27", 12, 35, 7, 11);
      r("#141e27", 23, 35, 6, 11);
      r("#55616a", 11 + step, 39, 7, 7);
      r("#35434d", 23 - step, 38, 7, 8);
      r("#a3a49a", 11 + step, 39, 6, 2);
      r("#78878a", 12, 19, 17, 15);
      r("#b4b9a1", 12, 20, 17, 3);
      r("#43525b", 16, 24, 14, 8);
      r("#c1b98b", 16, 32, 15, 3);
      r("#6b503d", 21, 32, 5, 4);
      r("#1b2934", 10, 7, 21, 13);
      r("#9fa99d", 12, 6, 17, 12);
      r("#d4d2b0", 13, 6, 13, 3);
      r("#697d7d", 25, 9, 5, 9);
      r("#273d45", 13, 13, 15, 5);
      r("#efd79b", 17, 13, 4, 2);
      r("#e9ca80", 25, 13, 3, 2);
      r("#9ca696", 9, 2, 4, 9);
      r("#e1d3a4", 7, 0, 3, 6);
      r("#9ba99b", 28, 2, 4, 10);
      r("#e1d3a4", 31, 0, 3, 5);
      r("#60747a", 28, 22, 5, 10);
      r("#b4b9a1", 28, 22, 5, 3);
      r("#b9ac87", 30, 29, 5, 5);
    });
  tex("sword", 12, 42, (c) => {
    rect(c, "#1a2932", 3, 0, 6, 32);
    rect(c, "#d5e1d7", 4, 2, 3, 26);
    rect(c, "#899e9d", 7, 4, 2, 24);
    rect(c, "#c8a665", 0, 29, 12, 3);
    rect(c, "#634a3c", 5, 32, 3, 8);
    rect(c, "#bfa365", 4, 39, 5, 3);
  });
  const colors = [
    ["#9abb72", "#cce59c"],
    ["#d6a45f", "#f5cf80"],
    ["#7cbfbd", "#b1e7d5"],
  ];
  colors.forEach(([base, light], i) => {
    for (let pose = 0; pose < 3; pose++)
      tex(`imp${i}_${pose}`, 22, 27, (c) => {
        const r = (col, x, y, w, h) => rect(c, col, x, y, w, h),
          step = pose === 1 ? 2 : pose === 2 ? -2 : 0;
        r("#162a2b", 5, 10, 14, 14);
        r("#493d3b", 7, 17, 11, 7);
        r("#2c2830", 6 + step, 23, 5, 4);
        r("#2c2830", 14 - step, 23, 5, 4);
        r(base, 4, 7, 15, 12);
        r(base, 1, 5, 4, 6);
        r(light, 1, 5, 2, 3);
        r(base, 18, 5, 4, 6);
        r(light, 18, 5, 3, 2);
        r(light, 6, 7, 10, 3);
        r("#253132", 7, 11, 4, 3);
        r("#253132", 15, 11, 4, 3);
        r("#fff0b7", 8, 11, 2, 2);
        r("#fff0b7", 16, 11, 2, 2);
        r("#334139", 10, 16, 7, 2);
        r("#f1d49d", 12, 16, 2, 2);
        r("#705369", 7, 19, 10, 3);
        r("#bea476", 12, 19, 2, 4);
        r(base, 3, 18, 4, 5);
        r(base, 18, 18, 3, 5);
        r("#b3b9a8", 20, 14, 2, 7);
      });
  });
  tex("guard", 54, 73, (c) => {
    const r = (col, x, y, w, h) => rect(c, col, x, y, w, h);
    r("#131e26", 10, 18, 37, 53);
    r("#583e3f", 11, 29, 9, 34);
    r("#87604b", 12, 28, 3, 29);
    r("#3d4a51", 18, 51, 11, 18);
    r("#3d4a51", 36, 51, 11, 18);
    r("#8d9991", 17, 61, 11, 5);
    r("#71827c", 37, 61, 11, 5);
    r("#25323c", 14, 68, 16, 5);
    r("#25323c", 34, 68, 17, 5);
    r("#647a79", 12, 23, 36, 29);
    r("#a1aca0", 13, 23, 35, 6);
    r("#87948b", 18, 32, 26, 6);
    r("#445c60", 23, 39, 22, 9);
    r("#293d47", 14, 48, 35, 7);
    r("#c2a76e", 27, 48, 9, 7);
    r("#a8afa0", 19, 6, 25, 19);
    r("#697e7e", 18, 9, 27, 17);
    r("#b8c1ab", 20, 7, 22, 4);
    r("#324c56", 18, 16, 28, 6);
    r("#efba73", 21, 17, 5, 2);
    r("#efba73", 34, 17, 5, 2);
    r("#4b626a", 28, 11, 4, 15);
    r("#c2b581", 28, 3, 5, 8);
    r("#9a6854", 29, 0, 4, 4);
    r("#a2afa1", 7, 24, 13, 10);
    r("#87998d", 42, 24, 12, 11);
    r("#3d565f", 5, 35, 10, 15);
    r("#637b7b", 45, 36, 8, 13);
    r("#a89972", 45, 47, 8, 7);
  });
  tex("shield", 30, 43, (c) => {
    const r = (col, x, y, w, h) => rect(c, col, x, y, w, h);
    r("#263d47", 0, 0, 30, 32);
    r("#a8ac8f", 2, 1, 26, 32);
    r("#a8ac8f", 5, 32, 20, 5);
    r("#a8ac8f", 10, 37, 10, 5);
    r("#445d64", 5, 4, 20, 27);
    r("#445d64", 9, 29, 12, 6);
    r("#293f4e", 7, 5, 7, 22);
    r("#bd9e62", 13, 9, 4, 23);
    r("#bd9e62", 9, 14, 12, 4);
    r("#d7c38a", 13, 10, 2, 5);
  });
  tex("mace", 24, 60, (c) => {
    rect(c, "#866647", 10, 16, 5, 44);
    rect(c, "#c6ae7b", 9, 46, 7, 4);
    rect(c, "#33494e", 2, 4, 21, 20);
    rect(c, "#8e9c93", 4, 6, 17, 14);
    rect(c, "#c0c5aa", 4, 6, 17, 4);
    rect(c, "#5b7275", 8, 10, 9, 10);
    rect(c, "#bdc4ae", 0, 10, 4, 6);
    rect(c, "#bdc4ae", 20, 9, 4, 7);
    rect(c, "#bdc4ae", 9, 0, 6, 6);
  });
  tex("barricade", 84, 86, (c) => {
    const r = (col, x, y, w, h) => rect(c, col, x, y, w, h);
    for (let i = 0; i < 6; i++) {
      const x = 5 + i * 13,
        y = 7 + (i % 2) * 6;
      r("#211e25", x - 2, y, 12, 79 - y);
      r("#77583c", x, y, 8, 76 - y);
      r("#b58a51", x, y, 3, 70 - y);
      r("#4d3c30", x + 5, y + 12, 2, 52 - y);
      r("#b0aa8b", x, y, 8, 7);
    }
    r("#3a3030", 0, 29, 84, 13);
    r("#9b7244", 0, 29, 84, 7);
    r("#4d3a2e", 0, 60, 84, 9);
    r("#8d693e", 0, 60, 84, 4);
    for (const x of [7, 33, 59, 75]) {
      r("#d1b174", x, 31, 3, 3);
      r("#d1b174", x, 62, 3, 3);
    }
  });
  tex("ground", 128, 80, (c) => {
    const r = (col, x, y, w, h) => rect(c, col, x, y, w, h);
    r("#18232b", 0, 0, 128, 80);
    r("#788079", 0, 0, 128, 3);
    r("#414e50", 0, 3, 128, 6);
    for (let row = 0; row < 4; row++)
      for (let k = 0; k < 5; k++) {
        const x = k * 30 - (row % 2) * 14,
          y = 11 + row * 18;
        r("#2b3940", x, y, 27, 15);
        r("#35434a", x, y, 27, 3);
        r("#202e36", x + 1, y + 12, 26, 3);
        r("#475148", x + 3, y + 4, 5, 2);
      }
    for (let i = 0; i < 16; i++)
      r(i % 2 ? "#616d5a" : "#8b8a61", i * 8, 0, 3, 3 + (i % 4) * 2);
  });
  tex("block", 96, 48, (c) => {
    const r = (col, x, y, w, h) => rect(c, col, x, y, w, h);
    r("#202d36", 0, 0, 96, 48);
    for (let j = 0; j < 3; j++)
      for (let i = 0; i < 4; i++) {
        r("#56605d", i * 25 - (j % 2) * 9, j * 16, 23, 14);
        r("#7b8172", i * 25 - (j % 2) * 9, j * 16, 23, 3);
        r("#38474b", i * 25 - (j % 2) * 9 + 2, j * 16 + 11, 21, 3);
      }
    r("#89906b", 0, 0, 96, 3);
  });
  tex("tree", 110, 230, (c) => {
    const r = (col, x, y, w, h) => rect(c, col, x, y, w, h);
    r("#1a3039", 44, 50, 18, 180);
    r("#263e42", 46, 80, 5, 149);
    r("#152b35", 30, 210, 50, 20);
    const branch = (x, y, w, h) => r("#1a3039", x, y, w, h);
    branch(27, 80, 21, 12);
    branch(20, 40, 10, 52);
    branch(10, 40, 15, 8);
    branch(59, 116, 24, 10);
    branch(76, 63, 10, 58);
    branch(86, 66, 19, 8);
    branch(53, 30, 10, 55);
    branch(62, 27, 18, 10);
    branch(75, 10, 7, 25);
  });
  tex("torch", 18, 45, (c) => {
    rect(c, "#212d33", 6, 19, 8, 25);
    rect(c, "#a89363", 5, 20, 10, 5);
    rect(c, "#994b31", 3, 6, 12, 14);
    rect(c, "#e8954f", 5, 3, 8, 16);
    rect(c, "#f3d78c", 7, 7, 4, 11);
    rect(c, "#eab56c", 8, 0, 3, 8);
  });
  tex("banner", 30, 90, (c) => {
    rect(c, "#c8ac73", 0, 0, 30, 3);
    rect(c, "#392f43", 3, 3, 24, 75);
    rect(c, "#72505d", 4, 4, 4, 70);
    rect(c, "#4b3b4e", 8, 4, 18, 76);
    rect(c, "#4b3b4e", 12, 78, 10, 8);
    rect(c, "#b89a67", 13, 20, 5, 31);
    rect(c, "#b89a67", 8, 28, 15, 5);
    rect(c, "#b89a67", 9, 45, 13, 4);
  });
  tex("spark", 4, 4, (c) => rect(c, "#ffffff", 0, 0, 4, 4));
}

export function buildWorld(s) {
  const g = s.add.graphics().setScrollFactor(0).setDepth(-50);
  g.fillStyle(0x172832).fillRect(0, 0, 960, 540);
  const layers = [
    [0x1b3039, 70, 125],
    [0x233b40, 160, 90],
    [0x294348, 230, 65],
  ];
  layers.forEach(([color, y, h], j) => {
    g.fillStyle(color);
    g.beginPath();
    g.moveTo(0, 405);
    for (let x = 0; x <= 1000; x += 40)
      g.lineTo(x, y + Math.sin(x * 0.009 + j) * h + Math.cos(x * 0.025) * 18);
    g.lineTo(1000, 405);
    g.closePath();
    g.fillPath();
  });
  g.fillStyle(0xd0ceb0, 0.8).fillCircle(692, 102, 36);
  g.fillStyle(0xb4beaa, 0.45).fillCircle(687, 99, 27);
  g.fillStyle(0x8ba29b, 0.3).fillRect(676, 80, 9, 9).fillRect(702, 108, 11, 6);
  // Layered distant fortress and individually drawn masonry.
  const castle = s.add.graphics().setDepth(-35).setScrollFactor(0.28);
  for (let i = 0; i < 8; i++) {
    const x = 600 + i * 92,
      y = 158 + (i % 3) * 18;
    castle.fillStyle(0x1b3039).fillRect(x, y, 78, 270);
    for (let a = 0; a < 4; a++) castle.fillRect(x + a * 22, y - 13, 12, 15);
    castle.fillStyle(0x344a4b).fillRect(x, y, 3, 240);
    for (let row = 0; row < 8; row++)
      for (let col = 0; col < 3; col++) {
        castle.fillStyle(row % 2 ? 0x263c43 : 0x233940);
        castle.fillRect(x + col * 26 + (row % 2) * 5, y + row * 28 + 14, 19, 2);
      }
    castle.fillStyle(0xafa16e, 0.35).fillRect(x + 34, y + 30, 5, 17);
  }
  for (let i = 0; i < 15; i++)
    s.add
      .image(i * 230 - 100, 417, "tree")
      .setOrigin(0.5, 1)
      .setScale(1.3 + (i % 3) * 0.2)
      .setTint(i % 2 ? 0x779a98 : 0x638886)
      .setScrollFactor(0.55)
      .setDepth(-25);
  const mist = s.add.graphics().setScrollFactor(0.65).setDepth(-20);
  for (let i = 0; i < 30; i++) {
    mist
      .fillStyle(0x97b3a7, 0.025)
      .fillRect(i * 113, 310 + (i % 4) * 16, 210, 24);
  }
  const ground = s.add
    .tileSprite(0, 405, 2800, 135, "ground")
    .setOrigin(0)
    .setDepth(3);
  // Foreground clumps, ruined milestones, tufts and scattered skulls.
  const detail = s.add.graphics().setDepth(4);
  for (let i = 0; i < 150; i++) {
    let x = (i * 73) % 2770,
      y = 405;
    detail.fillStyle(i % 3 === 0 ? 0x8e9269 : 0x586e59);
    detail.fillRect(x, y - 4, 2, 5);
    detail.fillRect(x + 3, y - 7, 2, 8);
    detail.fillRect(x + 6, y - 2, 3, 3);
    if (i % 8 === 0) {
      detail.fillStyle(0xb9b89a).fillRect(x + 20, y - 7, 10, 6);
      detail
        .fillStyle(0x273a41)
        .fillRect(x + 22, y - 5, 2, 2)
        .fillRect(x + 27, y - 5, 2, 2);
    }
  }
  for (const x of [380, 1330, 1725]) {
    s.add
      .image(x, 405, "block")
      .setOrigin(0.5, 1)
      .setScale(0.35, 1.2)
      .setDepth(2);
    s.add.image(x, 355, "torch").setOrigin(0.5, 1).setDepth(3);
    const glow = s.add.circle(x, 330, 35, 0xeab46a, 0.07).setDepth(1);
    s.tweens.add({
      targets: glow,
      alpha: 0.15,
      scale: 1.2,
      duration: 800 + (x % 210),
      yoyo: true,
      repeat: -1,
    });
  }
  // Huge gate, openable portcullis, banners and stone buttresses.
  const wall = s.add.graphics().setDepth(-5);
  wall.fillStyle(0x263740).fillRect(2290, 70, 510, 335);
  for (let row = 0; row < 17; row++)
    for (let col = 0; col < 17; col++) {
      const x = 2290 + col * 35 - (row % 2) * 17,
        y = 70 + row * 20;
      wall
        .fillStyle((row + col) % 3 ? 0x34454b : 0x3d4c4e)
        .fillRect(x, y, 33, 18);
      wall.fillStyle(0x52605b, 0.4).fillRect(x, y, 32, 2);
    }
  wall
    .fillStyle(0x0c1923)
    .fillRect(2400, 218, 154, 187)
    .fillRect(2414, 186, 126, 32)
    .fillRect(2438, 166, 78, 20);
  wall.lineStyle(12, 0x637169).strokeRect(2393, 218, 168, 187);
  wall
    .fillStyle(0x637169)
    .fillRect(2407, 185, 15, 37)
    .fillRect(2532, 185, 15, 37)
    .fillRect(2422, 173, 110, 14);
  s.gate = s.add.container(2402, 204).setDepth(-3);
  const bars = s.add.graphics();
  for (let i = 0; i < 8; i++) {
    bars.fillStyle(0x716c55).fillRect(i * 20, 0, 6, 201);
    bars.fillStyle(0xa39a72).fillRect(i * 20, 0, 2, 201);
  }
  for (const y of [28, 96, 164])
    bars.fillStyle(0x8b815f).fillRect(0, y, 148, 7);
  s.gate.add(bars);
  for (const x of [2320, 2620]) {
    s.add.image(x, 110, "banner").setOrigin(0.5, 0).setScale(1.3).setDepth(0);
    s.add.image(x, 278, "torch").setOrigin(0.5, 1).setScale(1.2).setDepth(0);
    const glow = s.add.circle(x, 244, 60, 0xe5ad61, 0.06).setDepth(0);
    s.tweens.add({
      targets: glow,
      alpha: 0.16,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });
  }
  s.add
    .text(2480, 132, "FORT DE CRÈVECŒUR", {
      fontFamily: "Georgia",
      fontSize: "10px",
      color: "#b9b18d",
      letterSpacing: 2,
    })
    .setOrigin(0.5)
    .setDepth(0);
  const posts = s.add.graphics().setDepth(0);
  for (const x of [510, 1220]) {
    posts
      .fillStyle(0x594c3c)
      .fillRect(x, 354, 6, 51)
      .fillRect(x - 27, 351, 62, 22);
    posts.fillStyle(0x9c8b5e).fillRect(x - 25, 351, 58, 2);
  }
  s.add
    .text(513, 362, "FORT  →", {
      fontFamily: "monospace",
      fontSize: "9px",
      color: "#d0ba85",
    })
    .setOrigin(0.5);
  s.add
    .text(1223, 362, "IMPÔTS  →", {
      fontFamily: "monospace",
      fontSize: "8px",
      color: "#d0ba85",
    })
    .setOrigin(0.5);
  for (let i = 0; i < 22; i++) {
    const mote = s.add
      .rectangle((i * 137) % 960, 170 + ((i * 53) % 220), 2, 2, 0xe0cf8b, 0.25)
      .setScrollFactor(0.1)
      .setDepth(-1);
    s.tweens.add({
      targets: mote,
      y: mote.y - 30,
      x: mote.x + 16,
      alpha: 0,
      duration: 2400 + (i % 5) * 500,
      delay: i * 130,
      yoyo: true,
      repeat: -1,
    });
  }
  return ground;
}
