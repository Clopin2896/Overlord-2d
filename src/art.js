import { texture, seeded } from "./pixel";

// Original hand-drawn silhouettes: black iron, tarnished brass, blood-red cloth.
const iron = {
  dark: "#12141b",
  shade: "#25262c",
  base: "#3c3e42",
  light: "#686962",
  edge: "#a4a08a",
  gold: "#a77b42",
};
function skull(p, x, y, scale = 1, color = "#b3a382") {
  const r = (c, a, b, w, h) =>
    p.r(c, x + a * scale, y + b * scale, w * scale, h * scale);
  r("#19191b", 1, 0, 8, 9);
  r(color, 2, 0, 6, 7);
  r(color, 0, 2, 10, 4);
  r("#332b29", 1, 3, 3, 2);
  r("#332b29", 6, 3, 3, 2);
  r("#44382d", 4, 5, 2, 2);
  r(color, 2, 7, 2, 2);
  r(color, 5, 7, 1, 2);
  r(color, 7, 7, 1, 2);
}
function rivets(p, x, y, n, gap = 5) {
  for (let i = 0; i < n; i++) {
    p.r("#17181d", x + i * gap, y, 3, 3);
    p.r("#b89a63", x + i * gap, y, 1, 1);
  }
}

export function makeArt(scene) {
  for (let pose = 0; pose < 4; pose++)
    texture(scene, `lord${pose}`, 56, 72, (p) => {
      const { r, poly, line } = p,
        step = pose === 1 ? 3 : pose === 2 ? -3 : 0;
      // Heavy, torn mantle behind the silhouette; an asymmetrical side-view stance.
      poly("#101219", [
        [15, 23],
        [37, 24],
        [39, 63],
        [29, 68],
        [25, 63],
        [17, 68],
        [12, 63],
        [6, 66],
        [8, 45],
      ]);
      poly("#582b30", [
        [15, 25],
        [29, 26],
        [24, 62],
        [18, 64],
        [15, 59],
        [10, 63],
        [12, 42],
      ]);
      poly("#823d38", [
        [16, 26],
        [21, 27],
        [17, 58],
        [13, 62],
        [14, 39],
      ]);
      line("#aa5745", 15, 30, 12, 55);
      poly("#301f29", [
        [24, 30],
        [30, 28],
        [29, 62],
        [23, 64],
      ]);
      // Articulated legs and heavy, clawed sabatons.
      for (const [x, offset] of [
        [21, step],
        [37, -step],
      ]) {
        poly("#10141b", [
          [x - 4, 49],
          [x + 7, 49],
          [x + 7 + offset, 67],
          [x + 10 + offset, 70],
          [x - 6 + offset, 71],
          [x - 6 + offset, 65],
        ]);
        poly(iron.base, [
          [x - 3, 50],
          [x + 5, 50],
          [x + 4 + offset, 62],
          [x - 2 + offset, 63],
        ]);
        r(iron.light, x - 3, 51, 8, 2);
        poly(iron.shade, [
          [x + 1, 54],
          [x + 6, 53],
          [x + 3 + offset, 65],
          [x - 1 + offset, 64],
        ]);
        r(iron.base, x - 5 + offset, 65, 13, 4);
        r(iron.edge, x - 4 + offset, 65, 6, 1);
        line(iron.gold, x - 2 + offset, 57, x + 4 + offset, 57);
        r(iron.light, x + 4 + offset, 68, 5, 1);
      }
      // Layered breastplate with a pointed sternum, bronze edges and a skull clasp.
      poly(iron.dark, [
        [17, 26],
        [42, 25],
        [48, 40],
        [42, 55],
        [19, 54],
        [13, 38],
      ]);
      poly(iron.base, [
        [20, 28],
        [38, 27],
        [44, 37],
        [34, 47],
        [22, 43],
        [17, 35],
      ]);
      poly(iron.light, [
        [19, 28],
        [36, 27],
        [33, 31],
        [23, 34],
        [18, 32],
      ]);
      poly(iron.shade, [
        [36, 31],
        [43, 30],
        [44, 39],
        [33, 47],
        [32, 36],
      ]);
      line(iron.edge, 21, 29, 32, 29);
      line(iron.gold, 19, 36, 30, 40);
      line(iron.gold, 30, 40, 41, 34);
      for (let row = 0; row < 3; row++) {
        r(iron.dark, 21, 43 + row * 3, 22, 3);
        r(iron.base, 22, 43 + row * 3, 19, 1);
        r(iron.gold, 22, 43 + row * 3, 3, 1);
      }
      r("#3a2924", 20, 52, 24, 4);
      r("#b28d50", 20, 52, 24, 1);
      skull(p, 28, 50, 0.7, "#d1b98a");
      // Oversized spiked pauldrons, strongly separated from the chest.
      for (const [x, flip] of [
        [7, 0],
        [36, 1],
      ]) {
        poly(iron.dark, [
          [x, 30],
          [x + 2, 23],
          [x + 14, 22],
          [x + 18, 30],
          [x + 13, 37],
          [x + 2, 35],
        ]);
        poly(iron.base, [
          [x + 2, 29],
          [x + 4, 25],
          [x + 12, 24],
          [x + 15, 30],
          [x + 11, 33],
          [x + 3, 32],
        ]);
        line(iron.edge, x + 4, 25, x + 12, 24);
        line(iron.gold, x + 3, 33, x + 12, 35);
        poly("#beb397", [
          [x + 3, 26],
          [x + 1, 17],
          [x + 8, 25],
        ]);
        poly("#6d675b", [
          [x + 10, 24],
          [x + 12, 15],
          [x + 15, 27],
        ]);
        r("#d9c5a0", x + 1, 18, 1, 3);
        rivets(p, x + 4, 30, 2, 6);
      }
      poly(iron.dark, [
        [41, 34],
        [50, 34],
        [52, 50],
        [45, 53],
        [40, 45],
      ]);
      for (let row = 0; row < 4; row++) {
        r(iron.base, 43, 35 + row * 3, 8, 3);
        r(iron.light, 43, 35 + row * 3, 5, 1);
      }
      poly("#6b5842", [
        [44, 47],
        [53, 47],
        [55, 53],
        [48, 56],
        [43, 52],
      ]);
      r("#dc853e", 47, 49, 4, 2);
      r("#f5be62", 49, 48, 1, 4);
      // Closed black helmet and long curved ivory horns.
      poly(iron.dark, [
        [20, 9],
        [36, 8],
        [43, 16],
        [41, 29],
        [30, 34],
        [18, 27],
        [16, 17],
      ]);
      poly(iron.base, [
        [21, 11],
        [34, 10],
        [39, 17],
        [29, 20],
        [19, 17],
      ]);
      poly(iron.light, [
        [21, 11],
        [27, 10],
        [24, 18],
        [19, 17],
      ]);
      poly(iron.shade, [
        [32, 12],
        [37, 13],
        [40, 23],
        [34, 29],
        [30, 27],
      ]);
      poly("#090d14", [
        [18, 20],
        [29, 23],
        [40, 19],
        [39, 25],
        [31, 28],
        [21, 25],
      ]);
      line("#b24924", 19, 21, 27, 24, 2);
      line("#ffb552", 20, 21, 26, 23);
      line("#b24924", 33, 23, 39, 20, 2);
      line("#ffb552", 34, 23, 39, 21);
      poly(iron.light, [
        [28, 15],
        [31, 14],
        [33, 29],
        [30, 32],
        [28, 25],
      ]);
      r("#a39a7b", 29, 16, 1, 8);
      for (const [points, shine] of [
        [
          [
            [21, 13],
            [14, 17],
            [8, 13],
            [5, 5],
            [7, 0],
            [9, 8],
            [16, 10],
          ],
          [
            [8, 3],
            [9, 9],
            [15, 12],
            [14, 14],
            [9, 12],
            [7, 6],
          ],
        ],
        [
          [
            [35, 12],
            [41, 15],
            [48, 10],
            [50, 1],
            [47, 4],
            [44, 8],
            [38, 9],
          ],
          [
            [47, 5],
            [46, 10],
            [41, 12],
            [39, 10],
            [43, 9],
          ],
        ],
      ]) {
        poly("#473a30", points);
        poly("#c2a77b", shine);
      }
      r("#e3cba3", 7, 1, 1, 3);
      r("#e3cba3", 48, 2, 1, 3);
    });
  texture(scene, "sword", 16, 48, (p) => {
    const { r, poly, line } = p;
    poly("#11151b", [
      [7, 0],
      [14, 9],
      [12, 14],
      [15, 17],
      [11, 21],
      [13, 24],
      [10, 35],
      [3, 35],
      [3, 12],
    ]);
    poly("#6f7775", [
      [7, 2],
      [11, 10],
      [9, 33],
      [4, 34],
      [4, 13],
    ]);
    line("#cecbb1", 7, 3, 5, 31);
    poly("#a8ad9e", [
      [10, 10],
      [12, 12],
      [9, 19],
      [9, 29],
      [7, 34],
      [7, 14],
    ]);
    line("#823b2b", 7, 13, 6, 31);
    r("#e88b3b", 7, 16, 1, 5);
    r("#e9a849", 6, 26, 1, 3);
    poly("#97723e", [
      [0, 33],
      [6, 35],
      [14, 32],
      [15, 36],
      [9, 38],
      [2, 37],
    ]);
    r("#cfaa66", 2, 34, 4, 1);
    r("#362820", 6, 38, 4, 8);
    for (let y = 39; y < 46; y += 2) r("#8a6740", 6, y, 4, 1);
    r("#bd9257", 5, 46, 6, 2);
  });
  const skins = [
    ["#7e6540", "#c29a5b", "#554531"],
    ["#80513c", "#c4804b", "#4d352e"],
    ["#67715b", "#a9b781", "#434a40"],
  ];
  skins.forEach(([base, light, dark], i) => {
    for (let pose = 0; pose < 3; pose++)
      texture(scene, `imp${i}_${pose}`, 32, 34, (p) => {
        const { r, poly, line } = p,
          step = pose === 1 ? 2 : pose === 2 ? -2 : 0,
          accent = ["#b8c76b", "#e5a753", "#68c7bb"][i];
        // Hunched leathery creatures, oversized ears, crooked teeth and scavenged kit.
        poly("#141619", [
          [8, 16],
          [22, 15],
          [27, 28],
          [22, 33],
          [4, 33],
          [6, 23],
        ]);
        r(dark, 8 + step, 27, 5, 6);
        r(base, 17 - step, 26, 5, 7);
        r("#b7a17d", 6 + step, 32, 7, 1);
        r("#b7a17d", 17 - step, 32, 7, 1);
        poly(dark, [
          [7, 21],
          [12, 17],
          [22, 19],
          [24, 28],
          [15, 30],
          [7, 27],
        ]);
        poly(base, [
          [10, 19],
          [17, 18],
          [22, 22],
          [19, 26],
          [9, 25],
        ]);
        poly("#4e3530", [
          [9, 24],
          [22, 24],
          [23, 31],
          [18, 29],
          [15, 31],
          [9, 29],
        ]);
        line("#a18b58", 11, 25, 20, 27);
        poly(dark, [
          [8, 7],
          [0, 2],
          [3, 12],
          [10, 14],
          [23, 13],
          [30, 4],
          [29, 15],
          [23, 19],
        ]);
        poly(base, [
          [7, 8],
          [2, 5],
          [5, 11],
          [10, 12],
          [24, 11],
          [28, 7],
          [27, 13],
          [23, 15],
        ]);
        line(light, 3, 6, 7, 9);
        line(light, 25, 11, 28, 8);
        poly(dark, [
          [9, 3],
          [21, 2],
          [26, 10],
          [24, 21],
          [17, 24],
          [8, 20],
          [5, 12],
        ]);
        poly(base, [
          [10, 4],
          [20, 3],
          [24, 10],
          [23, 18],
          [16, 21],
          [9, 18],
          [7, 11],
        ]);
        poly(light, [
          [11, 5],
          [18, 4],
          [21, 7],
          [17, 9],
          [8, 10],
        ]);
        poly("#22201d", [
          [9, 10],
          [15, 12],
          [14, 15],
          [8, 13],
        ]);
        poly("#22201d", [
          [18, 12],
          [25, 9],
          [24, 14],
          [19, 15],
        ]);
        r("#fff0b0", 10, 12, 3, 1);
        r("#fff0b0", 20, 12, 3, 1);
        r("#e99d42", 12, 12);
        r("#e99d42", 20, 12);
        poly(light, [
          [16, 11],
          [19, 16],
          [15, 18],
          [14, 15],
        ]);
        r(dark, 15, 17, 4, 1);
        line("#28201f", 11, 19, 21, 18, 2);
        r("#efcf95", 12, 18, 2, 3);
        r("#efcf95", 19, 17, 2, 3);
        r("#c6ab75", 16, 20, 2, 1);
        poly(base, [
          [5, 20],
          [8, 21],
          [7, 28],
          [3, 30],
          [2, 27],
        ]);
        r(light, 3, 25, 2, 4);
        poly(base, [
          [23, 21],
          [27, 23],
          [28, 28],
          [24, 30],
          [22, 26],
        ]);
        r(light, 25, 25, 2, 3);
        // A different trophy and a clear faction accent for each imp.
        if (i === 0) {
          r("#9d895c", 10, 1, 3, 4);
          r("#ddd0a4", 10, 1, 2, 1);
          r("#6b5740", 8, 3, 4, 2);
        }
        if (i === 1) {
          poly("#454349", [
            [9, 5],
            [10, 1],
            [18, 0],
            [22, 4],
            [20, 6],
          ]);
          line("#989280", 11, 2, 17, 1);
        }
        if (i === 2) {
          r("#b7b89c", 19, 1, 2, 5);
          r("#e6d7b1", 20, 0, 3, 2);
        }
        r(accent, 7, 21, 4, 3);
        r(accent, 11, 23, 5, 2);
        r(accent, 8, 25, 2, 4);
        line("#6e4d30", 28, 21, 30, 32, 2);
        poly("#9c9b85", [
          [27, 16],
          [31, 19],
          [31, 24],
          [27, 23],
        ]);
        r("#e2d3a6", 28, 17, 1, 3);
      });
  });
  texture(scene, "guard", 64, 82, (p) => {
    const { r, poly, line } = p;
    poly("#14171e", [
      [17, 24],
      [47, 22],
      [58, 42],
      [50, 67],
      [54, 80],
      [32, 81],
      [29, 69],
      [24, 81],
      [6, 81],
      [9, 64],
      [6, 39],
    ]);
    poly("#3b292a", [
      [12, 30],
      [48, 28],
      [45, 72],
      [35, 67],
      [23, 73],
      [14, 69],
    ]);
    poly("#783f32", [
      [14, 32],
      [22, 32],
      [21, 66],
      [14, 69],
    ]);
    for (const x of [14, 39]) {
      r("#32373b", x, 61, 12, 16);
      r("#70766d", x, 63, 10, 4);
      r("#aaa48b", x, 63, 9, 1);
      poly("#30353b", [
        [x, 73],
        [x + 11, 73],
        [x + 14, 80],
        [x - 4, 81],
        [x - 3, 77],
      ]);
      line("#8e8a73", x, 76, x + 9, 76);
    }
    poly("#8a8c7e", [
      [15, 29],
      [45, 28],
      [51, 40],
      [44, 57],
      [20, 59],
      [10, 43],
    ]);
    poly("#525d5b", [
      [34, 31],
      [46, 31],
      [47, 44],
      [39, 55],
      [28, 55],
      [29, 40],
    ]);
    poly("#b2b19a", [
      [16, 31],
      [30, 30],
      [27, 35],
      [17, 39],
      [13, 36],
    ]);
    line("#cfbea0", 18, 31, 28, 31);
    for (let row = 0; row < 3; row++) {
      line("#22282e", 18, 47 + row * 4, 42, 45 + row * 4, 2);
      line("#a49778", 19, 46 + row * 4, 39, 44 + row * 4);
    }
    r("#332b26", 16, 58, 30, 5);
    r("#ac8649", 16, 58, 29, 1);
    r("#bd9655", 29, 58, 7, 6);
    r("#54432d", 31, 60, 3, 2);
    poly("#31383b", [
      [4, 31],
      [8, 24],
      [19, 26],
      [23, 35],
      [14, 40],
      [3, 38],
    ]);
    poly("#929583", [
      [6, 31],
      [9, 27],
      [17, 28],
      [20, 33],
      [13, 36],
      [5, 35],
    ]);
    line("#c9b493", 8, 27, 16, 28);
    rivets(p, 7, 34, 3, 4);
    poly("#333d40", [
      [43, 27],
      [54, 25],
      [62, 33],
      [60, 41],
      [47, 40],
    ]);
    poly("#858e81", [
      [47, 29],
      [54, 28],
      [60, 33],
      [57, 36],
      [47, 34],
    ]);
    rivets(p, 48, 35, 3, 4);
    r("#4e5b59", 48, 40, 10, 17);
    r("#939980", 48, 42, 8, 2);
    r("#939980", 48, 47, 8, 2);
    r("#b1a180", 49, 55, 9, 7);
    poly("#343e41", [
      [19, 8],
      [35, 4],
      [46, 12],
      [45, 27],
      [34, 35],
      [22, 28],
      [17, 18],
    ]);
    poly("#939b8b", [
      [22, 9],
      [35, 7],
      [42, 13],
      [31, 17],
      [20, 15],
    ]);
    line("#d8c7a5", 23, 9, 34, 8);
    poly("#61716e", [
      [36, 13],
      [44, 13],
      [43, 27],
      [34, 31],
      [33, 19],
    ]);
    poly("#15242d", [
      [18, 18],
      [31, 21],
      [43, 17],
      [41, 23],
      [32, 27],
      [21, 24],
    ]);
    line("#e0bd72", 20, 20, 28, 22);
    line("#e0bd72", 35, 22, 41, 20);
    poly("#aa9b7b", [
      [30, 12],
      [33, 12],
      [35, 28],
      [31, 31],
      [29, 25],
    ]);
    poly("#8f4837", [
      [27, 9],
      [29, 2],
      [38, 0],
      [45, 4],
      [39, 8],
      [34, 6],
      [32, 12],
    ]);
    line("#c37d4c", 30, 3, 38, 2);
  });
  texture(scene, "shield", 34, 48, (p) => {
    const { r, poly, line } = p;
    poly("#171b21", [
      [1, 5],
      [17, 0],
      [32, 5],
      [33, 30],
      [27, 40],
      [17, 48],
      [5, 40],
      [0, 29],
    ]);
    poly("#b0945c", [
      [3, 7],
      [17, 3],
      [30, 7],
      [30, 29],
      [25, 38],
      [17, 44],
      [7, 38],
      [3, 28],
    ]);
    poly("#394a4a", [
      [6, 9],
      [17, 6],
      [27, 9],
      [27, 28],
      [22, 35],
      [17, 40],
      [10, 35],
      [6, 27],
    ]);
    poly("#25343a", [
      [8, 11],
      [15, 9],
      [14, 36],
      [10, 32],
      [8, 26],
    ]);
    line("#debd78", 4, 8, 4, 28);
    line("#6a573d", 29, 10, 28, 29);
    poly("#b69a5c", [
      [16, 11],
      [21, 16],
      [19, 21],
      [23, 26],
      [19, 31],
      [17, 37],
      [14, 29],
      [11, 25],
      [14, 22],
      [12, 17],
    ]);
    r("#dfc786", 16, 14, 2, 6);
    line("#d0c5a2", 23, 10, 20, 14);
    line("#a69d7b", 10, 29, 13, 26);
    rivets(p, 7, 7, 4, 6);
  });
  texture(scene, "mace", 28, 64, (p) => {
    const { r, poly, line } = p;
    r("#1a1c20", 12, 14, 6, 48);
    r("#775536", 13, 16, 4, 45);
    for (let y = 32; y < 59; y += 5) r("#ba965a", 12, y, 6, 2);
    poly("#20272c", [
      [5, 4],
      [21, 4],
      [26, 11],
      [23, 23],
      [15, 28],
      [4, 23],
      [0, 13],
    ]);
    poly("#7e8b83", [
      [6, 6],
      [20, 6],
      [23, 12],
      [20, 22],
      [11, 25],
      [4, 20],
      [3, 12],
    ]);
    poly("#b9b69d", [
      [6, 6],
      [18, 6],
      [15, 11],
      [5, 13],
    ]);
    poly("#414e52", [
      [15, 12],
      [22, 10],
      [20, 21],
      [13, 24],
    ]);
    poly("#d6caaa", [
      [10, 6],
      [14, 0],
      [17, 6],
    ]);
    poly("#c8bea2", [
      [3, 12],
      [0, 7],
      [0, 18],
      [5, 16],
    ]);
    poly("#b6b59e", [
      [23, 13],
      [27, 8],
      [27, 19],
      [22, 18],
    ]);
    line("#d9c398", 6, 7, 13, 7);
  });
  makeEnvironmentTextures(scene);
}

function makeEnvironmentTextures(scene) {
  texture(scene, "barricade", 84, 86, (p, rand) => {
    const { r, poly, line } = p;
    for (let i = 0; i < 6; i++) {
      const x = 4 + i * 13,
        y = 5 + (i % 2) * 7;
      poly("#211c1b", [
        [x - 3, 84],
        [x - 3, y + 12],
        [x + 3, y],
        [x + 8, y + 12],
        [x + 10, 84],
      ]);
      poly("#6d492f", [
        [x - 1, 82],
        [x - 1, y + 12],
        [x + 3, y + 3],
        [x + 6, y + 12],
        [x + 7, 82],
      ]);
      line("#ba8b4f", x + 1, y + 13, x + 3, 77);
      for (let j = 0; j < 16; j++)
        r(
          rand() > 0.5 ? "#9a6b3d" : "#3e2c22",
          x + rand() * 7,
          y + 14 + rand() * (65 - y),
          1,
          3,
        );
      poly("#888570", [
        [x - 1, y + 14],
        [x + 3, y + 2],
        [x + 6, y + 14],
      ]);
      r("#c5b899", x + 2, y + 6, 1, 5);
    }
    poly("#302821", [
      [0, 27],
      [83, 35],
      [83, 44],
      [0, 36],
    ]);
    line("#b5884c", 1, 28, 82, 36);
    poly("#7a5636", [
      [0, 61],
      [84, 52],
      [84, 61],
      [0, 69],
    ]);
    line("#ad8047", 0, 61, 82, 53);
    for (let i = 0; i < 6; i++) {
      r("#252727", 8 + i * 13, 31 + i, 3, 3);
      r("#c7af76", 8 + i * 13, 31 + i, 1, 1);
    }
    skull(p, 34, 37, 1.4);
    line("#3b2d22", 33, 51, 50, 61, 2);
    line("#a49063", 35, 51, 49, 61);
  });
  texture(scene, "ground", 256, 144, (p, rand) => {
    const { r, poly, line } = p;
    r("#171c20", 0, 0, 256, 144);
    for (let row = 0; row < 6; row++)
      for (let col = 0; col < 9; col++) {
        const x = col * 33 - (row % 2) * 16,
          y = 8 + row * 20,
          h = 13 + rand() * 5;
        const shades = ["#30332f", "#393b32", "#2c302d", "#3e4035"];
        poly(shades[Math.floor(rand() * 4)], [
          [x + 2, y],
          [x + 26, y - 2],
          [x + 30, y + 3],
          [x + 28, y + h],
          [x + 4, y + h + 1],
          [x, y + 6],
        ]);
        line(row < 2 ? "#66624b" : "#464839", x + 3, y, x + 24, y - 1);
        for (let j = 0; j < 10; j++)
          r(
            rand() > 0.5 ? "#45483b" : "#242a28",
            x + 3 + rand() * 22,
            y + 3 + rand() * 10,
            rand() * 3 + 1,
            1,
          );
        line("#1c2526", x + 24, y + 6, x + 22, y + 11);
      }
    r("#817454", 0, 0, 256, 3);
    for (let x = 0; x < 256; x += 6) {
      r("#baa275", x, 0, 3, 1);
      r("#57583b", x, 3, 3, 3 + rand() * 5);
    }
    for (let i = 0; i < 220; i++) {
      const x = rand() * 256,
        y = rand() * 110;
      r(y > 65 ? "#1b2224" : "#3b422e", x, y, 1 + rand() * 2, 1 + rand() * 2);
    }
    for (let y = 70; y < 144; y++)
      r(`rgba(11,16,20,${(y - 70) / 110})`, 0, y, 256, 1);
  });
  texture(scene, "block", 96, 48, (p, rand) => {
    const { r, poly, line } = p;
    r("#1b2225", 0, 0, 96, 48);
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 5; col++) {
        const x = col * 23 - (row % 2) * 9,
          y = row * 16;
        poly("#4e5146", [
          [x + 2, y],
          [x + 19, y],
          [x + 22, y + 4],
          [x + 20, y + 14],
          [x + 2, y + 13],
          [x, y + 6],
        ]);
        line("#8b8465", x + 3, y, x + 18, y);
        line("#323b34", x + 19, y + 5, x + 17, y + 12);
        for (let i = 0; i < 8; i++)
          r("#646652", x + rand() * 18, y + rand() * 10, 2, 1);
      }
    r("#c1ad76", 0, 0, 96, 2);
    for (let i = 0; i < 40; i++)
      r("#667144", rand() * 96, 2 + rand() * 6, 2, 2);
  });
  texture(scene, "tree", 180, 245, (p, rand) => {
    const { r, poly, line, ellipse } = p;
    // Thin, crooked branches and bark contours replace the old block silhouettes.
    const twigEnds = [];
    const branch = (x, y, len, angle, width, depth) => {
      const bx = x + Math.cos(angle) * len,
        by = y + Math.sin(angle) * len;
      line("#151d22", x, y, bx, by, width);
      line("#33372e", x + width * 0.25, y, bx, by, Math.max(1, width * 0.2));
      if (depth) {
        branch(bx, by, len * 0.7, angle - 0.5, width * 0.63, depth - 1);
        branch(bx, by, len * 0.67, angle + 0.68, width * 0.62, depth - 1);
      } else twigEnds.push([bx, by]);
    };
    branch(81, 241, 72, -1.48, 19, 4);
    branch(86, 181, 52, -2.35, 10, 3);
    branch(95, 143, 44, -0.6, 8, 3);
    poly("#171e23", [
      [81, 159],
      [101, 153],
      [95, 219],
      [119, 244],
      [70, 244],
      [82, 214],
    ]);
    poly("#34382e", [
      [85, 166],
      [89, 164],
      [87, 219],
      [79, 239],
      [76, 239],
      [84, 210],
    ]);
    line("#4c4834", 88, 175, 86, 217, 2);
    ellipse("#0e171d", 95, 190, 4, 8);
    line("#53503a", 91, 182, 89, 194);
    for (let i = 0; i < twigEnds.length; i++) {
      const [x, y] = twigEnds[i];
      if (i % 3 === 0) {
        ellipse("#242b27", x, y, 9 + rand() * 8, 4 + rand() * 5);
        for (let j = 0; j < 14; j++)
          r(
            j % 3 ? "#30372b" : "#464932",
            x - 8 + rand() * 16,
            y - 3 + rand() * 6,
            2,
            1,
          );
      }
    }
    for (let i = 0; i < 16; i++)
      line("#333c2c", 45 + rand() * 95, 232, 42 + rand() * 100, 244, 2);
  });
  for (let frame = 0; frame < 4; frame++)
    texture(scene, `torch${frame}`, 24, 58, (p) => {
      const { r, poly, line } = p;
      r("#11171c", 7, 28, 11, 30);
      r("#575241", 9, 29, 6, 28);
      r("#91754b", 9, 29, 2, 25);
      poly("#34332d", [
        [3, 24],
        [22, 24],
        [18, 36],
        [8, 36],
      ]);
      line("#b09256", 4, 26, 20, 26, 2);
      r("#ba8d4e", 7, 33, 12, 2);
      poly("#813427", [
        [4, 25],
        [2, 17],
        [8, 11],
        [9, 1 + frame * 2],
        [15, 12],
        [19, 8 + frame],
        [22, 24],
        [16, 29],
      ]);
      poly("#d5612a", [
        [6, 24],
        [7, 15],
        [11, 8 + frame],
        [14, 18],
        [18, 14],
        [20, 24],
        [14, 28],
      ]);
      poly("#f7b64e", [
        [9, 24],
        [10, 15],
        [13, 18],
        [15, 14 + frame],
        [17, 24],
        [14, 27],
      ]);
      r("#ffe2a0", 11, 21, 3, 5);
    });
  if (!scene.anims.exists("fire"))
    scene.anims.create({
      key: "fire",
      frames: Array.from({ length: 4 }, (_, i) => ({ key: `torch${i}` })),
      frameRate: 9,
      repeat: -1,
    });
  texture(scene, "banner", 36, 100, (p) => {
    const { r, poly, line } = p;
    r("#8b6d40", 0, 0, 36, 3);
    r("#c7a668", 1, 0, 34, 1);
    poly("#281e24", [
      [4, 3],
      [32, 3],
      [32, 83],
      [28, 91],
      [24, 87],
      [20, 99],
      [14, 93],
      [10, 97],
      [5, 86],
    ]);
    poly("#632d2e", [
      [6, 4],
      [30, 4],
      [29, 82],
      [24, 88],
      [20, 94],
      [14, 89],
      [8, 92],
    ]);
    r("#8d4236", 7, 5, 3, 72);
    r("#3c2428", 25, 5, 4, 78);
    line("#a97040", 11, 6, 11, 76);
    skull(p, 11, 27, 1.4, "#ac864e");
    poly("#a48048", [
      [13, 30],
      [8, 24],
      [8, 18],
      [11, 24],
      [16, 27],
    ]);
    poly("#a48048", [
      [24, 30],
      [29, 24],
      [29, 18],
      [26, 24],
      [21, 27],
    ]);
    line("#9f7846", 17, 44, 17, 66);
    line("#9f7846", 13, 60, 22, 60);
  });
  texture(scene, "glow", 128, 128, (p) => {
    for (let rad = 63; rad > 0; rad -= 4)
      p.ellipse(
        `rgba(255,129,44,${0.006 + (64 - rad) * 0.00015})`,
        64,
        64,
        rad,
        rad * 0.85,
      );
  });
  texture(scene, "spark", 4, 4, (p) => p.r("#ffffff", 0, 0, 4, 4));
  makeBackdrop(scene);
  makeGate(scene);
}

function makeBackdrop(scene) {
  texture(scene, "sky", 960, 405, (p, rand) => {
    const { r, poly, ellipse } = p;
    const bands = [
      "#171721",
      "#1e2028",
      "#282b30",
      "#363a39",
      "#484b41",
      "#5a5946",
    ];
    bands.forEach((c, i) => r(c, 0, i * 68, 960, 69));
    for (let i = 0; i < 17000; i++) {
      const x = rand() * 960,
        y = rand() * 405;
      const n = Math.floor(y / 68);
      if (n < 5 && rand() < (y % 68) / 68) r(bands[n + 1], x, y, 2, 1);
    }
    // A bruised dusk, edged clouds and a pale, textured moon.
    ellipse("#797257", 705, 91, 37);
    ellipse("#b3a57a", 705, 90, 32);
    ellipse("#ccbc8b", 704, 89, 29);
    for (let i = 0; i < 220; i++) {
      const x = rand() * 56 - 28,
        y = rand() * 56 - 28;
      if (x * x + y * y < 750)
        r(
          i % 2 ? "#ab9f75" : "#b8ac80",
          704 + x,
          89 + y,
          1 + rand() * 3,
          1 + rand() * 2,
        );
    }
    for (let cloud = 0; cloud < 14; cloud++) {
      const x = rand() * 1100 - 80,
        y = 20 + rand() * 160;
      for (let i = 0; i < 5; i++) {
        ellipse(
          "#272830",
          x + i * 20,
          y + rand() * 7,
          40 + rand() * 38,
          4 + rand() * 5,
        );
        if (i % 2) ellipse("#3c3a3b", x + i * 23, y + 7, 39, 2);
      }
    }
    for (let i = 0; i < 55; i++) r("#a79975", rand() * 960, rand() * 80, 1, 1);
  });
  texture(scene, "vista", 1500, 405, (p, rand) => {
    const { r, poly, line } = p;
    for (let layer = 0; layer < 3; layer++) {
      const points = [[0, 405]];
      for (let x = 0; x <= 1520; x += 12)
        points.push([
          x,
          200 + layer * 43 + Math.sin(x * 0.009 + layer * 2) * 43 + rand() * 18,
        ]);
      points.push([1520, 405]);
      poly(["#40483f", "#363f37", "#29382f"][layer], points);
      for (let i = 0; i < 180; i++) {
        const x = rand() * 1500,
          y = 285 + layer * 23 + rand() * 70;
        line(
          ["#4e5140", "#434b38", "#34432f"][layer],
          x,
          y,
          x + 3 + rand() * 18,
          y,
        );
      }
    }
    // A distant, unmistakably evil citadel: jagged spires, buttresses and fire.
    const tower = (x, y, w, h) => {
      poly("#292c2c", [
        [x, y + h],
        [x, y + 16],
        [x + w * 0.12, y + 16],
        [x + w * 0.22, y],
        [x + w * 0.78, y],
        [x + w * 0.9, y + 16],
        [x + w, y + 16],
        [x + w, y + h],
      ]);
      r("#3c3d34", x + 3, y + 18, 3, h - 18);
      poly("#1b2327", [
        [x - 7, y + 3],
        [x + w / 2, y - 48],
        [x + w + 7, y + 3],
      ]);
      line("#5b5440", x - 7, y + 3, x + w / 2, y - 48);
      line("#34372e", x + w / 2, y - 48, x + w + 7, y + 3);
      r("#151d23", x + w / 2 - 1, y - 69, 3, 25);
      for (let row = 0; row < 5; row++) {
        const yy = y + 25 + row * 29;
        for (let col = 0; col < 3; col++) {
          const xx = x + 8 + (col * (w - 16)) / 3;
          r("#1a2225", xx, yy, 5, 14);
          if ((col + row) % 3 === 0) {
            r("#b07539", xx + 1, yy + 3, 2, 9);
            r("#e8aa50", xx + 1, yy + 4, 1, 4);
          }
        }
      }
      for (let yy = y + 22; yy < y + h; yy += 20)
        line("#414236", x + 3, yy, x + w - 3, yy);
    };
    r("#2b302d", 765, 252, 430, 153);
    for (let i = 0; i < 16; i++) r("#2b302d", 765 + i * 28, 241, 15, 14);
    tower(823, 192, 59, 213);
    tower(891, 139, 86, 266);
    tower(1006, 90, 90, 315);
    tower(1122, 199, 51, 206);
    poly("#202929", [
      [878, 405],
      [897, 243],
      [913, 243],
      [903, 405],
    ]);
    poly("#202929", [
      [1096, 405],
      [1083, 215],
      [1069, 215],
      [1074, 405],
    ]);
    for (let i = 0; i < 6; i++) {
      const x = 985 + i * 16;
      r("#161f23", x, 298, 8, 107);
      poly("#303832", [
        [x - 2, 299],
        [x + 4, 283],
        [x + 10, 299],
      ]);
    }
    for (let i = 0; i < 34; i++) {
      const x = 760 + rand() * 460,
        y = 325 + rand() * 75;
      r("#3c4236", x, y, 3 + rand() * 8, 1);
    }
    // Ravines and irregular ruined walls, no flat rectangular mountain silhouettes.
    for (let i = 0; i < 12; i++) {
      const x = i * 137;
      poly("#29352d", [
        [x, 405],
        [x + 7, 352],
        [x + 24, 349],
        [x + 29, 342],
        [x + 59, 365],
        [x + 93, 362],
        [x + 125, 405],
      ]);
      line("#626048", x + 8, 353, x + 24, 351);
    }
  });
  texture(scene, "gallows", 90, 150, (p) => {
    const { r, poly, line } = p;
    r("#242522", 22, 10, 11, 140);
    r("#6b5237", 22, 10, 3, 140);
    r("#292924", 19, 8, 66, 10);
    r("#80623e", 21, 8, 62, 2);
    line("#48402e", 31, 49, 61, 18, 5);
    line("#9a8055", 71, 19, 71, 53);
    p.ellipse("#62563d", 71, 61, 7, 10);
    p.ellipse("#171e21", 71, 61, 4, 7);
    skull(p, 2, 130, 1.4);
    poly("#554532", [
      [18, 132],
      [40, 127],
      [43, 142],
      [17, 146],
    ]);
    line("#9b7d4a", 19, 132, 38, 128);
  });
}

function makeGate(scene) {
  texture(scene, "fortress", 550, 370, (p, rand) => {
    const { r, poly, line, ellipse } = p;
    r("#272b2b", 0, 100, 550, 270);
    // Uneven masonry with warm light on its upper edges and moss in the joints.
    for (let row = 0; row < 16; row++)
      for (let col = 0; col < 20; col++) {
        const x = col * 30 - (row % 2) * 15,
          y = 94 + row * 18;
        poly(
          ["#343734", "#3d3e37", "#303532", "#414137"][Math.floor(rand() * 4)],
          [
            [x + 2, y],
            [x + 26, y],
            [x + 29, y + 3],
            [x + 26, y + 16],
            [x + 2, y + 15],
            [x, y + 5],
          ],
        );
        line("#565240", x + 3, y, x + 25, y);
        for (let j = 0; j < 7; j++)
          r(
            j % 2 ? "#252e2a" : "#4b4d3a",
            x + rand() * 27,
            y + 2 + rand() * 13,
            1 + rand() * 2,
            1,
          );
      }
    // Side towers and sharply pointed buttresses.
    for (const x of [12, 365, 465]) {
      poly("#1b2226", [
        [x, 370],
        [x, 67],
        [x + 10, 67],
        [x + 10, 39],
        [x + 22, 39],
        [x + 22, 63],
        [x + 32, 63],
        [x + 32, 28],
        [x + 45, 28],
        [x + 45, 63],
        [x + 56, 63],
        [x + 56, 39],
        [x + 68, 39],
        [x + 68, 67],
        [x + 78, 67],
        [x + 78, 370],
      ]);
      r("#3c3f37", x + 5, 77, 65, 293);
      r("#4d4c3c", x + 5, 77, 5, 290);
      r("#252e2c", x + 60, 77, 11, 293);
      for (let y = 84; y < 370; y += 20) {
        line("#69604a", x + 7, y, x + 59, y);
        line(
          "#202927",
          x + 8 + (y % 40) * 0.8,
          y,
          x + 8 + (y % 40) * 0.8,
          y + 18,
        );
      }
      poly("#141e22", [
        [x + 25, 159],
        [x + 25, 118],
        [x + 37, 102],
        [x + 49, 118],
        [x + 49, 159],
      ]);
      r("#a6532d", x + 30, 126, 13, 30);
      r("#e39b43", x + 35, 125, 4, 32);
      r("#25302e", x + 36, 115, 2, 45);
      poly("#1d2728", [
        [x - 8, 370],
        [x + 3, 213],
        [x + 13, 203],
        [x + 22, 214],
        [x + 28, 370],
      ]);
      line("#706048", x + 4, 217, x - 3, 365, 3);
      poly("#363930", [
        [x - 2, 216],
        [x + 12, 176],
        [x + 27, 216],
      ]);
      line("#83704f", x - 2, 214, x + 12, 177);
    }
    // Tall central arch, inlaid brass moulding and black passage behind the herse.
    const arch = [
      [131, 370],
      [131, 178],
      [145, 148],
      [164, 124],
      [193, 100],
      [218, 82],
      [244, 100],
      [271, 124],
      [290, 148],
      [304, 178],
      [304, 370],
    ];
    poly("#1a2224", arch);
    poly("#70634a", [
      [138, 370],
      [138, 181],
      [152, 150],
      [176, 123],
      [218, 93],
      [259, 123],
      [283, 153],
      [297, 181],
      [297, 370],
    ]);
    poly("#393e35", [
      [146, 370],
      [146, 183],
      [159, 155],
      [181, 132],
      [218, 105],
      [254, 132],
      [277, 157],
      [289, 183],
      [289, 370],
    ]);
    poly("#0c141a", [
      [153, 370],
      [153, 185],
      [166, 160],
      [189, 138],
      [218, 117],
      [247, 138],
      [270, 162],
      [282, 185],
      [282, 370],
    ]);
    for (let i = 0; i < 9; i++) {
      const y = 190 + i * 20;
      r("#9d8154", 139, y, 7, 2);
      r("#9d8154", 290, y, 7, 2);
    }
    line("#c0a16a", 141, 178, 157, 147);
    line("#b79b64", 157, 147, 180, 123);
    line("#a38a59", 180, 123, 218, 96);
    // Monumental horned skull crest above the entrance.
    poly("#171e22", [
      [171, 63],
      [159, 48],
      [155, 20],
      [163, 27],
      [171, 45],
      [192, 48],
      [208, 39],
      [226, 40],
      [245, 49],
      [262, 42],
      [274, 20],
      [278, 43],
      [266, 62],
      [245, 75],
      [228, 92],
      [207, 93],
      [189, 75],
    ]);
    poly("#6e6751", [
      [177, 61],
      [167, 47],
      [164, 32],
      [175, 48],
      [195, 52],
      [208, 44],
      [228, 45],
      [241, 54],
      [261, 47],
      [271, 31],
      [268, 47],
      [258, 58],
      [239, 69],
      [225, 86],
      [207, 85],
      [192, 68],
    ]);
    poly("#968365", [
      [181, 58],
      [196, 56],
      [207, 47],
      [222, 46],
      [233, 55],
      [228, 66],
      [220, 62],
      [213, 64],
      [205, 61],
      [196, 66],
    ]);
    poly("#131c22", [
      [192, 61],
      [210, 66],
      [207, 73],
      [196, 70],
    ]);
    poly("#131c22", [
      [224, 66],
      [242, 61],
      [238, 72],
      [227, 73],
    ]);
    line("#c56536", 195, 63, 206, 67);
    line("#f2a24b", 228, 67, 239, 63);
    poly("#282b29", [
      [216, 67],
      [221, 77],
      [211, 77],
    ]);
    for (let i = 0; i < 5; i++)
      r("#c2ab7d", 205 + i * 5, 80, 3, 6 + (i % 2) * 2);
    line("#ad9770", 175, 52, 183, 57);
    // Rusted iron spikes along the parapet and weathered decorative chains.
    for (let x = 90; x < 357; x += 18) {
      poly("#131d22", [
        [x - 2, 110],
        [x, 88],
        [x + 3, 110],
      ]);
      r("#766447", x, 95, 1, 12);
    }
    for (const x of [112, 327])
      for (let y = 125; y < 320; y += 9) {
        ellipse("#161f23", x, y, 3, 5);
        ellipse("#8a734d", x, y, 2, 4);
        ellipse("#292f2b", x, y, 1, 2);
      }
    // Scattered ivy rather than a uniform pattern.
    for (let i = 0; i < 170; i++) {
      const x = rand() < 0.5 ? 90 + rand() * 39 : 310 + rand() * 47,
        y = 210 + rand() * 150;
      r(
        ["#3c4932", "#525736", "#69663e"][i % 3],
        x,
        y,
        2 + rand() * 3,
        1 + rand() * 2,
      );
    }
  });
}

export function buildWorld(s) {
  s.add.image(0, 0, "sky").setOrigin(0).setScrollFactor(0).setDepth(-50);
  s.add.image(0, 0, "vista").setOrigin(0).setScrollFactor(0.25).setDepth(-40);
  for (let i = 0; i < 11; i++)
    s.add
      .image(i * 238 - 65, 410, "tree")
      .setOrigin(0.5, 1)
      .setScale(1.15 + (i % 3) * 0.13)
      .setFlipX(i % 2 === 0)
      .setTint(i % 2 ? 0x9b9e84 : 0x727e70)
      .setScrollFactor(0.65)
      .setDepth(-25);
  // A quiet, low haze separates the silhouettes without washing out the actors.
  const mist = s.add.graphics().setDepth(-21).setScrollFactor(0.5);
  for (let i = 0; i < 14; i++)
    mist
      .fillStyle(0xa8a174, 0.025)
      .fillRect(i * 176, 330 + (i % 4) * 12, 220, 8);
  for (const x of [1450, 1890])
    s.add
      .image(x, 405, "gallows")
      .setOrigin(0.5, 1)
      .setDepth(-10)
      .setScale(0.85);
  s.add.image(2260, 35, "fortress").setOrigin(0).setDepth(-5);
  const ground = s.add
    .tileSprite(0, 405, 2800, 135, "ground")
    .setOrigin(0)
    .setDepth(3);
  const detail = s.add.graphics().setDepth(4),
    rand = seeded(482);
  for (let i = 0; i < 230; i++) {
    const x = rand() * 2780,
      y = 405;
    detail.fillStyle([0x6a7142, 0x747147, 0x46553a][i % 3]);
    detail
      .fillRect(x, y - 3, 1, 4)
      .fillRect(x + 3, y - 6 - rand() * 4, 1, 7)
      .fillRect(x + 5, y - 3, 2, 3);
    if (i % 14 === 0) {
      detail
        .fillStyle(0xaea17d)
        .fillRect(x + 12, y - 6, 7, 5)
        .fillRect(x + 14, y - 2, 3, 3);
      detail
        .fillStyle(0x282b27)
        .fillRect(x + 13, y - 4, 2, 2)
        .fillRect(x + 17, y - 4, 2, 2);
    }
    if (i % 9 === 0) {
      detail.fillStyle(0x565846).fillRect(x + 22, y - 3, 13, 3);
      detail.fillStyle(0x928365).fillRect(x + 25, y - 4, 6, 1);
    }
  }
  const torch = (x, y, scale = 1) => {
    const glow = s.add
      .image(x, y - 37 * scale, "glow")
      .setScale(scale * 1.2)
      .setDepth(1)
      .setBlendMode("ADD")
      .setAlpha(0.65);
    s.tweens.add({
      targets: glow,
      alpha: 0.95,
      scale: scale * 1.35,
      duration: 650 + (x % 220),
      yoyo: true,
      repeat: -1,
    });
    s.add
      .sprite(x, y, "torch0")
      .setOrigin(0.5, 1)
      .setScale(scale)
      .setDepth(2)
      .play("fire");
    const firelight = s.add
      .ellipse(x, 406, 110 * scale, 7, 0xd68e3b, 0.1)
      .setDepth(4);
    s.tweens.add({
      targets: firelight,
      alpha: 0.2,
      duration: 730,
      yoyo: true,
      repeat: -1,
    });
  };
  for (const x of [360, 1290, 1760]) {
    s.add
      .image(x, 405, "block")
      .setOrigin(0.5, 1)
      .setScale(0.3, 1.2)
      .setDepth(1);
    torch(x, 356, 1);
  }
  // The portcullis remains a separate object so the victory animation raises it.
  s.gate = s.add.container(2402, 204).setDepth(-3);
  const bars = s.add.graphics();
  for (let i = 0; i < 8; i++) {
    bars.fillStyle(0x161e23).fillRect(i * 20 - 2, 0, 8, 197);
    bars.fillStyle(0x82704a).fillRect(i * 20, 0, 4, 196);
    bars.fillStyle(0xc4a46a).fillRect(i * 20, 0, 1, 196);
    bars
      .fillStyle(0x7f704c)
      .fillTriangle(i * 20 - 1, 195, i * 20 + 5, 195, i * 20 + 2, 201);
  }
  for (const y of [28, 96, 164]) {
    bars.fillStyle(0x242721).fillRect(0, y, 148, 8);
    bars.fillStyle(0x95815a).fillRect(0, y, 148, 2);
    for (let x = 1; x < 147; x += 20)
      bars.fillStyle(0xd6b574).fillRect(x, y + 3, 2, 2);
  }
  s.gate.add(bars);
  for (const x of [2350, 2590]) {
    s.add.image(x, 177, "banner").setOrigin(0.5, 0).setDepth(0);
    torch(x, 337, 1.05);
  }
  s.add
    .text(2478, 184, "CRÈVECŒUR", {
      fontFamily: "Georgia",
      fontSize: "9px",
      color: "#bba16a",
      letterSpacing: 3,
    })
    .setOrigin(0.5)
    .setDepth(0);
  const posts = s.add.graphics().setDepth(0);
  for (const x of [510, 1220]) {
    posts
      .fillStyle(0x372c22)
      .fillRect(x, 354, 6, 51)
      .fillRect(x - 27, 351, 62, 22);
    posts
      .fillStyle(0x85633a)
      .fillRect(x - 25, 351, 58, 2)
      .fillRect(x, 356, 2, 48);
    posts
      .fillStyle(0x1a2223)
      .fillRect(x - 20, 356, 2, 2)
      .fillRect(x + 26, 356, 2, 2);
  }
  for (const [x, text] of [
    [513, "FORT →"],
    [1223, "IMPÔTS →"],
  ])
    s.add
      .text(x, 362, text, {
        fontFamily: "monospace",
        fontSize: "9px",
        color: "#cdb17a",
      })
      .setOrigin(0.5);
  for (let i = 0; i < 32; i++) {
    const ember = s.add
      .rectangle(
        (i * 137) % 960,
        170 + ((i * 53) % 220),
        i % 4 === 0 ? 2 : 1,
        2,
        i % 3 ? 0xbb6e35 : 0xe9af58,
        0.25,
      )
      .setScrollFactor(0.3)
      .setDepth(-1);
    s.tweens.add({
      targets: ember,
      y: ember.y - 40,
      x: ember.x + 22,
      alpha: 0,
      duration: 2800 + (i % 5) * 500,
      delay: i * 130,
      yoyo: true,
      repeat: -1,
    });
  }
  return ground;
}
