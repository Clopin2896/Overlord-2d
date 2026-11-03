import Phaser from "phaser";
import "./style.css";
import { makeArt, buildWorld } from "./art";
import { Audio } from "./audio";

const $ = (id) => document.getElementById(id),
  show = (id, visible) => $(id).classList.toggle("hidden", !visible);
const audio = new Audio();
const touchMode =
  matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
const held = new Set(),
  taps = new Set(),
  pointers = new Map();
const clearInput = () => {
  held.clear();
  taps.clear();
  pointers.clear();
  document
    .querySelectorAll(".pressed")
    .forEach((b) => b.classList.remove("pressed"));
};
for (const button of document.querySelectorAll("[data-control]")) {
  button.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    button.setPointerCapture(e.pointerId);
    const action = button.dataset.control;
    pointers.set(e.pointerId, action);
    held.add(action);
    taps.add(action);
    button.classList.add("pressed");
    audio.start();
  });
  const release = (e) => {
    const action = pointers.get(e.pointerId);
    pointers.delete(e.pointerId);
    if (![...pointers.values()].includes(action)) {
      held.delete(action);
      button.classList.remove("pressed");
    }
  };
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
  button.addEventListener("contextmenu", (e) => e.preventDefault());
}

class Level extends Phaser.Scene {
  constructor() {
    super("Level");
  }
  create() {
    if (!this.textures.exists("lord0")) makeArt(this);
    this.mode = "intro";
    this.elapsed = 0;
    this.lastHud = "";
    this.lastObjective = "";
    this.target = null;
    this.hitStop = 0;
    this.speechUntil = 0;
    this.nextDialogue = 0;
    this.stats = { orders: 0, recalls: 0, blocks: 0, hits: 0 };
    this.p = {
      x: 145,
      y: 405,
      vx: 0,
      vy: 0,
      ground: true,
      facing: 1,
      hp: 5,
      inv: 0,
      cooldown: 0,
      attack: 0,
      coyote: 0.1,
      jumpBuffer: 0,
    };
    this.barricade = { x: 1040, y: 405, hp: 12, max: 12 };
    this.guard = {
      x: 2180,
      y: 405,
      hp: 10,
      max: 10,
      state: "shield",
      timer: 0,
      facing: -1,
      inv: 0,
      active: false,
    };
    this.platforms = [
      { x: 584, y: 365, w: 92, h: 40 },
      { x: 728, y: 333, w: 96, h: 72 },
    ];
    buildWorld(this);
    for (const b of this.platforms)
      this.add.tileSprite(b.x, b.y, b.w, b.h, "block").setOrigin(0).setDepth(4);
    this.shadow = this.add
      .ellipse(this.p.x, 406, 40, 9, 0x070f17, 0.4)
      .setDepth(5);
    this.hero = this.add
      .sprite(this.p.x, this.p.y, "lord0")
      .setOrigin(0.5, 1)
      .setScale(1.2)
      .setDepth(12);
    this.sword = this.add
      .image(this.p.x + 22, 380, "sword")
      .setOrigin(0.5, 0.85)
      .setScale(1.4)
      .setDepth(13);
    this.imps = [0, 1, 2].map((i) => ({
      x: 88 - i * 29,
      y: 405,
      vy: 0,
      ground: true,
      alive: true,
      mode: "follow",
      timer: 0,
      stuck: 0,
      sprite: this.add
        .sprite(88 - i * 29, 405, `imp${i}_0`)
        .setOrigin(0.5, 1)
        .setScale(1.15)
        .setDepth(10 + i * 0.1),
      halo: this.add
        .ellipse(
          88 - i * 29,
          406,
          24,
          5,
          [0x9abb72, 0xd6a45f, 0x7cbfbd][i],
          0.28,
        )
        .setDepth(5),
    }));
    this.fence = this.add
      .image(1040, 405, "barricade")
      .setOrigin(0.5, 1)
      .setScale(1.15)
      .setDepth(8);
    this.guardSprite = this.add
      .image(2180, 405, "guard")
      .setOrigin(0.5, 1)
      .setScale(1.4)
      .setDepth(9);
    this.shield = this.add
      .image(2145, 380, "shield")
      .setScale(1.4)
      .setDepth(13);
    this.mace = this.add
      .image(2215, 360, "mace")
      .setOrigin(0.5, 0.9)
      .setScale(1.5)
      .setDepth(11);
    this.fx = this.add.graphics().setDepth(20);
    this.targetFx = this.add.graphics().setDepth(6);
    this.guardUI = this.add.graphics().setDepth(21);
    this.guardName = this.add
      .text(2180, 255, "LE PERCEPTEUR", {
        fontFamily: "Arial",
        fontSize: "10px",
        fontStyle: "bold",
        color: "#d7c7a0",
        letterSpacing: 2,
      })
      .setOrigin(0.5)
      .setDepth(22);
    this.guardState = this.add
      .text(2180, 288, "BOUCLIER LEVÉ", {
        fontFamily: "Arial",
        fontSize: "8px",
        color: "#a9bab2",
        letterSpacing: 1,
      })
      .setOrigin(0.5)
      .setDepth(22);
    this.keys = this.input.keyboard.addKeys({
      left: "Q",
      right: "D",
      leftAlt: "LEFT",
      rightAlt: "RIGHT",
      jump: "SPACE",
      attack: "J",
      send: "K",
      recall: "L",
      pause: "ESC",
    });
    for (const action of ["jump", "attack", "send", "recall", "pause"])
      this.keys[action].on("down", () => taps.add(action));
    this.input.keyboard.addCapture(["SPACE", "UP", "DOWN", "LEFT", "RIGHT"]);
    this.cameras.main.setBounds(0, 0, 2760, 540);
    this.cameras.main.setScroll(0, 0);
    // An enlarged in-game portrait introduces the new silhouette on the title screen.
    this.titleArt = this.add
      .container(765, 468)
      .setScrollFactor(0)
      .setDepth(30);
    this.titleArt.add([
      this.add.ellipse(0, 0, 170, 18, 0x080c12, 0.6),
      this.add.image(0, 0, "lord0").setOrigin(0.5, 1).setScale(3.6),
      this.add
        .image(98, -86, "sword")
        .setOrigin(0.5, 0.85)
        .setScale(3.6)
        .setAngle(15),
    ]);
    $("loading").classList.add("hidden");
    show("intro", true);
    show("pause-panel", false);
    show("result", false);
    show("overlay", true);
    show("hud", false);
    show("controls", false);
    show("touch", false);
    show("target", false);
    show("objective", false);
    show("danger", false);
    $("subtitle").textContent = "";
    window.__gameSnapshot = () => ({
      mode: this.mode,
      player: {
        x: Math.round(this.p.x),
        y: Math.round(this.p.y),
        hp: this.p.hp,
        ground: this.p.ground,
      },
      barricadeHP: this.barricade.hp,
      guard: { hp: this.guard.hp, state: this.guard.state },
      target: this.target,
      imps: this.imps.map((m) => ({
        alive: m.alive,
        mode: m.mode,
        x: Math.round(m.x),
      })),
      stats: { ...this.stats },
    });
    this.renderHud();
  }
  begin() {
    if (this.mode !== "intro") return;
    audio.start();
    this.mode = "play";
    this.titleArt.setVisible(false);
    clearInput();
    show("overlay", false);
    show("hud", true);
    show("objective", true);
    show(touchMode ? "touch" : "controls", true);
    this.say("« Trois larbins. C’est presque une armée. »", 5);
  }
  pause() {
    if (this.mode === "play") {
      this.mode = "pause";
      clearInput();
      this.input.keyboard.resetKeys();
      show("overlay", true);
      show("intro", false);
      show("pause-panel", true);
      show("touch", false);
      this.tweens.pauseAll();
    } else if (this.mode === "pause") {
      this.mode = "play";
      clearInput();
      this.input.keyboard.resetKeys();
      show("overlay", false);
      show("pause-panel", false);
      show(touchMode ? "touch" : "controls", true);
      this.tweens.resumeAll();
    }
  }
  say(text, duration = 3) {
    $("subtitle").textContent = text;
    this.speechUntil = this.elapsed + duration;
  }
  pressed(action) {
    const touch = taps.delete(action);
    return Phaser.Input.Keyboard.JustDown(this.keys[action]) || touch;
  }
  down(action) {
    return (
      held.has(action) ||
      this.keys[action].isDown ||
      (action === "left" && this.keys.leftAlt.isDown) ||
      (action === "right" && this.keys.rightAlt.isDown)
    );
  }
  update(time, delta) {
    if (this.pressed("pause")) this.pause();
    if (this.mode !== "play") return;
    const dt = Math.min(delta / 1000, 0.035);
    this.elapsed += dt;
    if (this.elapsed > this.speechUntil) $("subtitle").textContent = "";
    if (this.hitStop > 0) {
      this.hitStop -= dt;
      return;
    }
    const p = this.p;
    p.inv = Math.max(0, p.inv - dt);
    p.cooldown = Math.max(0, p.cooldown - dt);
    p.attack = Math.max(0, p.attack - dt);
    let dir = (this.down("right") ? 1 : 0) - (this.down("left") ? 1 : 0);
    p.vx = dir * 218;
    if (dir) p.facing = dir;
    p.coyote = p.ground ? 0.1 : Math.max(0, p.coyote - dt);
    p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
    if (this.pressed("jump")) p.jumpBuffer = 0.14;
    if (p.jumpBuffer > 0 && p.coyote > 0) {
      p.vy = -425;
      p.ground = false;
      p.coyote = 0;
      p.jumpBuffer = 0;
      audio.play("jump");
      this.particles(p.x, p.y, 0x9ea28a, 5);
    }
    this.moveBody(p, dt, 15, true);
    // Select by proximity and facing; target lock remains visible while the order is active.
    const fenceDist = Math.abs(p.x - this.barricade.x),
      guardDist = Math.abs(p.x - this.guard.x);
    this.target =
      this.barricade.hp > 0 && fenceDist < 365 && this.barricade.x > p.x - 80
        ? "barricade"
        : this.guard.hp > 0 && guardDist < 390
          ? "guard"
          : null;
    if (this.pressed("recall")) this.recall();
    if (this.pressed("send")) this.send();
    if (this.pressed("attack") && p.cooldown === 0) this.attack();
    this.updateImps(dt, time);
    this.updateGuard(dt);
    if (this.mode !== "play") return;
    this.hero
      .setPosition(p.x, p.y)
      .setFlipX(p.facing < 0)
      .setTexture(
        `lord${p.ground && dir ? 1 + (Math.floor(time / 130) % 2) : 0}`,
      );
    this.hero.setAlpha(p.inv > 0 && Math.floor(time / 80) % 2 ? 0.4 : 1);
    this.shadow
      .setPosition(p.x, 407)
      .setScale(Math.max(0.4, 1 - (405 - p.y) / 220));
    this.sword
      .setPosition(p.x + p.facing * 27, p.y - 28)
      .setRotation(
        p.facing * (p.attack > 0 ? 1.4 - (p.attack / 0.18) * 2.8 : 0.3),
      )
      .setFlipX(p.facing < 0);
    this.cameras.main.scrollX = Phaser.Math.Linear(
      this.cameras.main.scrollX,
      Phaser.Math.Clamp(p.x - 340, 0, 1800),
      Math.min(1, dt * 5),
    );
    this.drawEffects(time);
    this.renderHud();
    if (p.hp <= 0) this.finish(false, "Votre règne aura été bref.");
    else if (!this.imps.some((m) => m.alive))
      this.finish(false, "Plus un seul larbin. Le syndicat a gagné.");
  }
  moveBody(b, dt, radius, solidFence = false) {
    const oldY = b.y;
    b.x += b.vx * dt;
    b.x = Phaser.Math.Clamp(b.x, radius, 2710);
    b.vy += 1100 * dt;
    b.y += b.vy * dt;
    b.ground = false;
    const solids = [...this.platforms];
    if (this.barricade.hp > 0)
      solids.push({ x: 996, y: 306, w: 88, h: 99, fence: true });
    for (const s of solids) {
      if (s.fence && !solidFence) continue;
      if (b.x + radius > s.x && b.x - radius < s.x + s.w) {
        if (oldY <= s.y + 1 && b.y >= s.y && b.vy >= 0) {
          b.y = s.y;
          b.vy = 0;
          b.ground = true;
        } else if (b.y > s.y + 3 && oldY > s.y + 1) {
          if (b.vx > 0) b.x = s.x - radius;
          else if (b.vx < 0) b.x = s.x + s.w + radius;
        }
      }
    }
    if (b.y >= 405) {
      b.y = 405;
      b.vy = 0;
      b.ground = true;
    }
  }
  send() {
    if (!this.target) {
      this.say("Approchez-vous d’une cible marquée en or.", 2);
      return;
    }
    audio.play("send");
    this.stats.orders++;
    for (const m of this.imps)
      if (m.alive) {
        m.mode = this.target;
        m.timer = 0;
        m.stuck = 0;
      }
    this.say(
      this.target === "barricade"
        ? "« Démolition ! Les échardes sont pour vous. »"
        : "« À son bouclier, mes petites déductions fiscales ! »",
      2.7,
    );
  }
  recall() {
    audio.play("recall");
    this.stats.recalls++;
    for (const m of this.imps)
      if (m.alive) {
        m.mode = "recall";
        m.timer = 0;
        m.vy = 0;
        m.stuck = 0;
        this.particles(m.x, m.y - 15, 0xabe1ca, 5);
      }
    this.say("« Ici ! Je n’ai pas fini de vous exploiter. »", 2);
  }
  attack() {
    const p = this.p;
    p.cooldown = 0.4;
    p.attack = 0.18;
    audio.play("sword");
    const g = this.guard;
    if (
      this.barricade.hp > 0 &&
      Math.abs(p.x - 1040) < 108 &&
      p.y > 315 &&
      Math.sign(1040 - p.x) === p.facing
    ) {
      this.say("Du bois syndiqué. Envoyez les larbins : K.", 2);
      this.particles(1000, 360, 0xd8b075, 7);
      audio.play("block");
    }
    if (
      g.hp > 0 &&
      Math.abs(p.x - g.x) < 105 &&
      p.y > 300 &&
      Math.sign(g.x - p.x) === p.facing
    ) {
      const front =
        (p.x < g.x && g.facing === -1) || (p.x > g.x && g.facing === 1);
      if (g.state === "shield" && front) {
        this.stats.blocks++;
        audio.play("block");
        this.particles(g.x + g.facing * 40, 355, 0xf9d99c, 15);
        p.x -= p.facing * 14;
        this.cameras.main.shake(80, 0.002);
        this.say("Le bouclier bloque ! Envoyez au moins deux larbins.", 2.5);
      } else if (g.inv <= 0) {
        g.hp--;
        g.inv = 0.25;
        this.stats.hits++;
        audio.play("hit");
        this.hitStop = 0.045;
        this.guardSprite.setTintFill(0xf3d49a);
        this.time.delayedCall(90, () => this.guardSprite.clearTint());
        this.particles(g.x, 340, 0xe1b57b, 16);
        this.cameras.main.shake(100, 0.003);
        if (g.hp <= 0) this.win();
      }
    }
  }
  updateImps(dt, time) {
    this.imps.forEach((m, i) => {
      if (!m.alive) return;
      const oldX = m.x;
      let destination = this.p.x - this.p.facing * (40 + i * 25),
        speed = 196;
      let attached = false;
      if (m.mode === "barricade" && this.barricade.hp > 0) {
        destination = 1001 - i * 15;
        speed = 240;
        if (Math.abs(m.x - destination) < 18) {
          m.timer += dt;
          if (m.timer > 0.32) {
            m.timer = 0;
            this.barricade.hp = Math.max(0, this.barricade.hp - 1);
            this.particles(1010, 350 + i * 13, 0xc7a267, 5);
            audio.tone(100 + i * 30, 0.06, "triangle", 0.2, 45);
            this.fence.setAngle(Math.sin(time) * 2);
            if (this.barricade.hp <= 0) {
              this.fence.setVisible(false);
              this.particles(1040, 365, 0xb18b57, 32);
              audio.play("smash");
              this.cameras.main.shake(170, 0.004);
              this.say(
                "« Une porte en moins. Un problème de voisinage en plus. »",
                3,
              );
            }
          }
        }
      } else if (m.mode === "barricade") m.mode = "follow";
      if (m.mode === "guard" && this.guard.hp > 0) {
        destination = this.guard.x - 28 + i * 9;
        speed = 255;
        if (Math.abs(m.x - destination) < 22) {
          m.mode = "attached";
          m.timer = 0;
        }
      }
      if (m.mode === "attached") {
        attached = true;
        m.x = this.guard.x + this.guard.facing * (27 + (i % 2) * 13);
        m.y = 382 - i * 18 + Math.sin(time / 90 + i) * 2;
        m.vy = 0;
      }
      if (m.mode === "recall") {
        speed = 365;
        const side = this.p.x < this.guard.x ? -1 : 1;
        const danger = ["windup", "smash"].includes(this.guard.state);
        destination = danger
          ? this.guard.x + side * (160 + i * 24)
          : this.p.x - this.p.facing * (35 + i * 24);
        if (!danger && Math.abs(m.x - destination) < 12) m.mode = "follow";
      }
      if (m.mode === "follow" && Math.abs(this.p.x - m.x) > 330) {
        m.stuck += dt;
        if (m.stuck > 1) {
          this.particles(m.x, m.y - 12, 0x99cdb6, 8);
          m.x = this.p.x - this.p.facing * (35 + i * 25);
          m.y = this.p.y;
          m.vy = 0;
          m.stuck = 0;
          this.particles(m.x, m.y - 12, 0x99cdb6, 12);
        }
      }
      if (!attached) {
        let distance = destination - m.x;
        m.vx = Math.abs(distance) > 8 ? Math.sign(distance) * speed : 0;
        if (m.ground) {
          const obstacle = this.platforms.find(
            (s) =>
              (Math.abs(s.x - m.x) < 55 && distance > 0 && m.y > s.y + 2) ||
              (Math.abs(s.x + s.w - m.x) < 55 && distance < 0 && m.y > s.y + 2),
          );
          if (obstacle) {
            m.vy = -365;
            m.ground = false;
          }
          if (
            this.p.y < m.y - 35 &&
            m.mode === "follow" &&
            Math.abs(distance) < 100
          ) {
            m.vy = -390;
            m.ground = false;
          }
        }
        this.moveBody(m, dt, 8, m.mode === "follow" || m.mode === "recall");
        if (Math.abs(m.x - oldX) < 0.2 && Math.abs(distance) > 30) {
          m.stuck += dt;
          if (m.stuck > 1.6) {
            m.x = destination;
            m.y = Math.min(this.p.y, 405);
            m.stuck = 0;
            this.particles(m.x, m.y - 10, 0x9fddbb, 10);
          }
        } else if (Math.abs(this.p.x - m.x) < 330) m.stuck = 0;
      }
      m.sprite
        .setPosition(m.x + (attached ? this.guard.facing * 8 : 0), m.y)
        .setFlipX(attached ? this.guard.facing > 0 : m.x < oldX)
        .setTexture(
          `imp${i}_${attached || Math.abs(m.x - oldX) > 0.1 ? 1 + (Math.floor(time / 90 + i) % 2) : 0}`,
        )
        .setAngle(attached ? (i % 2 ? 22 : -20) : 0);
      m.halo.setPosition(m.x, 407).setVisible(!attached);
    });
  }
  updateGuard(dt) {
    const g = this.guard;
    if (g.hp <= 0) return;
    g.inv -= dt;
    g.timer += dt;
    const attached = this.imps.filter(
      (m) => m.alive && m.mode === "attached",
    ).length;
    g.active = Math.abs(this.p.x - g.x) < 350 || attached > 0;
    if (g.state === "shield") {
      if (!g.active || Math.abs(this.p.x - g.x) >= 130) g.timer = 0;
      g.facing = this.p.x < g.x ? -1 : 1;
      if (attached >= 2) {
        g.state = "pinned";
        g.timer = 0;
        this.say("Bouclier abaissé ! À vous de frapper : J.", 2.5);
        audio.play("block");
      } else if (g.active && Math.abs(this.p.x - g.x) < 130 && g.timer > 2.8)
        this.windup();
    } else if (g.state === "pinned") {
      if (attached < 2) {
        g.state = "shield";
        g.timer = 0;
      } else if (g.timer > 2.15) this.windup();
    } else if (g.state === "windup" && g.timer > 1.8) {
      g.state = "smash";
      g.timer = 0;
      audio.play("smash");
      this.cameras.main.shake(230, 0.008);
      this.particles(g.x, 397, 0xc8ad87, 30);
      for (const m of this.imps) {
        if (
          m.alive &&
          (m.mode === "attached" || (Math.abs(m.x - g.x) < 105 && m.y > 340))
        ) {
          m.alive = false;
          m.sprite.setVisible(false);
          m.halo.setVisible(false);
          this.particles(m.x, m.y - 12, 0xa3c994, 12);
        }
      }
      if (Math.abs(this.p.x - g.x) < 113 && this.p.y > 345) this.hurt();
    } else if (g.state === "smash" && g.timer > 0.35) {
      g.state = "recover";
      g.timer = 0;
    } else if (g.state === "recover" && g.timer > 1.1) {
      g.state = "shield";
      g.timer = 0;
    }
    this.guardSprite.setFlipX(g.facing > 0);
    this.shield
      .setPosition(g.x + g.facing * 36, g.state === "shield" ? 363 : 392)
      .setAngle(g.state === "shield" ? 0 : g.facing * -38)
      .setFlipX(g.facing > 0);
    const wind = g.state === "windup",
      smash = g.state === "smash";
    this.mace
      .setPosition(g.x - g.facing * 35, wind ? 306 : smash ? 400 : 361)
      .setRotation(
        wind ? -g.facing * 0.7 : smash ? g.facing * 1.8 : g.facing * 0.18,
      );
    this.guardState.setText(
      {
        shield: "BOUCLIER LEVÉ",
        pinned: "VULNÉRABLE · FRAPPEZ !",
        windup: "ÉCRASEMENT · RAPPELEZ !",
        smash: "ÉCRASEMENT",
        recover: "VULNÉRABLE",
      }[g.state],
    );
    this.guardState.setColor(
      wind ? "#ffb182" : g.state === "shield" ? "#a9bab2" : "#e6ca80",
    );
    show("danger", wind);
    if (wind)
      $("danger").innerHTML = touchMode
        ? "⚠ IL VA FRAPPER ! <b>RAPPELEZ !</b>"
        : "⚠ IL VA FRAPPER ! <b>L · RAPPELER</b>";
  }
  windup() {
    this.guard.state = "windup";
    this.guard.timer = 0;
    audio.play("warn");
    this.say("Rappelez les larbins et éloignez-vous de la zone rouge !", 1.8);
  }
  hurt() {
    if (this.p.inv > 0) return;
    this.p.hp--;
    this.p.inv = 1;
    audio.play("death");
    this.particles(this.p.x, this.p.y - 35, 0xc87972, 15);
    this.p.x += this.p.x < this.guard.x ? -35 : 35;
    this.cameras.main.flash(100, 100, 20, 20);
  }
  drawEffects(time) {
    this.fx.clear();
    this.targetFx.clear();
    const g = this.guard;
    if (this.p.attack > 0) {
      const p = this.p;
      this.fx
        .lineStyle(4, 0xffe3a0, 0.7)
        .beginPath()
        .arc(
          p.x,
          p.y - 32,
          61,
          p.facing > 0 ? -0.9 : Math.PI - 0.9,
          p.facing > 0 ? 0.9 : Math.PI + 0.9,
          false,
        )
        .strokePath();
    }
    if (this.target) {
      const x = this.target === "guard" ? g.x : 1040,
        w = this.target === "guard" ? 75 : 62,
        y = this.target === "guard" ? 281 : 297;
      this.targetFx
        .lineStyle(2, 0xdac17f, 0.8)
        .strokeEllipse(x, 407, w * 2, 14);
      this.targetFx
        .fillStyle(0xe8d08c)
        .fillTriangle(
          x - 5,
          y - 10 + Math.sin(time / 220) * 3,
          x + 5,
          y - 10 + Math.sin(time / 220) * 3,
          x,
          y - 3 + Math.sin(time / 220) * 3,
        );
      for (const side of [-1, 1]) {
        this.targetFx
          .lineStyle(2, 0xdbbf79, 0.65)
          .beginPath()
          .moveTo(x + side * (w - 9), 315)
          .lineTo(x + side * w, 315)
          .lineTo(x + side * w, 332)
          .strokePath();
      }
    }
    if (g.state === "windup") {
      const f = g.timer / 1.8;
      this.fx
        .fillStyle(0xe36c52, 0.12 + f * 0.18)
        .fillEllipse(g.x, 404, 224, 34);
      this.fx
        .lineStyle(2, 0xf3a26e, 0.6 + Math.sin(time / 60) * 0.3)
        .strokeEllipse(g.x, 404, 224, 34);
      this.fx.fillStyle(0xffb480).fillRect(g.x - 48, 300, 96 * f, 3);
    }
    this.guardUI.clear();
    if (g.hp > 0) {
      this.guardUI.fillStyle(0x101c25).fillRect(g.x - 54, 272, 108, 8);
      this.guardUI
        .fillStyle(0xb66b57)
        .fillRect(g.x - 52, 274, (104 * g.hp) / g.max, 4);
    }
    if (this.target === "barricade") {
      this.guardUI.fillStyle(0x15232b).fillRect(1006, 310, 68, 5);
      this.guardUI
        .fillStyle(0xd3b06f)
        .fillRect(1006, 310, (68 * this.barricade.hp) / 12, 5);
    }
  }
  particles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const p = this.add
        .rectangle(x, y, 2 + (i % 2) * 2, 2 + (i % 3), color)
        .setDepth(24);
      this.tweens.add({
        targets: p,
        x: x + Phaser.Math.Between(-45, 45),
        y: y + Phaser.Math.Between(-35, 15),
        alpha: 0,
        angle: 90,
        duration: 250 + Math.random() * 200,
        onComplete: () => p.destroy(),
      });
    }
  }
  renderHud() {
    const key = `${this.p.hp}-${this.imps.map((m) => m.alive + ":" + m.mode).join()}`;
    if (key !== this.lastHud) {
      this.lastHud = key;
      $("health").innerHTML = Array.from(
        { length: 5 },
        (_, i) => `<i class="heart ${i >= this.p.hp ? "empty" : ""}"></i>`,
      ).join("");
      $("health").setAttribute(
        "aria-label",
        `${this.p.hp} points de vie sur 5`,
      );
      $("minions").innerHTML = this.imps
        .map(
          (m, i) =>
            `<span class="minion-status ${m.alive ? "" : "dead"}" style="--color:${["#b3cf86", "#e3bb74", "#9fd6cb"][i]}">◆ ${["MOUCHE", "ROGNE", "MIETTE"][i]}</span>`,
        )
        .join("");
    }
    let objective =
      this.p.x < 450
        ? "Rejoignez la forteresse. Courez, sautez, essayez votre épée."
        : this.barricade.hp > 0
          ? "La barricade : approchez, puis envoyez vos larbins."
          : "La porte : faites abaisser le bouclier, frappez, puis rappelez.";
    if (objective !== this.lastObjective) {
      $("objective-text").textContent = objective;
      this.lastObjective = objective;
    }
    show("target", !!this.target);
    $("target").textContent =
      this.target === "barricade"
        ? `${touchMode ? "ENVOYER" : "K · ENVOYER"} → BARRICADE`
        : `${touchMode ? "ENVOYER" : "K · ENVOYER"} → LE PERCEPTEUR`;
  }
  win() {
    this.guard.state = "dead";
    this.guardSprite.setTint(0x4f6060).setAngle(-85).setY(415);
    this.shield.setVisible(false);
    this.mace.setVisible(false);
    this.guardName.setVisible(false);
    this.guardState.setVisible(false);
    this.guardUI.clear();
    show("danger", false);
    for (const m of this.imps) if (m.alive) m.mode = "follow";
    this.mode = "opening";
    audio.play("win");
    this.say("« La porte est à nous. Faites suivre les factures. »", 4);
    this.tweens.add({
      targets: this.gate,
      y: -5,
      duration: 1500,
      ease: "Sine.easeInOut",
      onComplete: () => this.finish(true),
    });
    this.cameras.main.pan(2320, 270, 1300, "Sine.easeInOut");
  }
  finish(won, reason = "") {
    this.mode = won ? "victory" : "defeat";
    clearInput();
    this.input.keyboard.resetKeys();
    show("overlay", true);
    show("intro", false);
    show("pause-panel", false);
    show("result", true);
    show("touch", false);
    show("target", false);
    show("danger", false);
    $("subtitle").textContent = "";
    $("result-kicker").textContent = won
      ? "CHAPITRE I · CONQUIS"
      : "CHAPITRE I · DÉFAITE";
    $("result-title").textContent = won
      ? "Le bail est renouvelé."
      : "Retour à la case cachot.";
    $("result-copy").innerHTML = won
      ? "La porte de Crèvecœur est à vous.<br>Vos sujets vous détestent déjà. Tout va bien."
      : `${reason}<br>Gardez deux larbins en vie et rappelez-les dès l’alerte.`;
    $("result-stats").textContent =
      `${this.imps.filter((m) => m.alive).length}/3 larbins survivants · ${this.stats.orders} ordres · ${Math.floor(this.elapsed / 60)} min ${Math.floor(
        this.elapsed % 60,
      )
        .toString()
        .padStart(2, "0")} s`;
    if (!won) audio.play("death");
  }
}
const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 960,
  height: 540,
  backgroundColor: "#172832",
  pixelArt: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: Level,
  audio: { noAudio: true },
  input: { activePointers: 5 },
  render: { antialias: false },
  banner: false,
});
const scene = () => game.scene.getScene("Level");
$("start").onclick = () => scene().begin();
$("pause").onclick = () => scene().pause();
$("resume").onclick = () => scene().pause();
for (const b of document.querySelectorAll(".restart"))
  b.onclick = () => {
    clearInput();
    scene().scene.restart();
    scene().events.once("create", () => scene().begin());
  };
$("sound").onclick = () => {
  audio.enabled = !audio.enabled;
  $("sound").textContent = `Son : ${audio.enabled ? "activé" : "désactivé"}`;
};
window.addEventListener("blur", () => {
  clearInput();
  if (scene()?.mode === "play") scene().pause();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInput();
    if (scene()?.mode === "play") scene().pause();
  }
});

matchMedia("(orientation: portrait)").addEventListener("change", (e) => {
  if (touchMode && e.matches && scene()?.mode === "play") scene().pause();
});
