/* MAELSTROM // GRID-07 — decorative enhancement of native Homepage.
   No service API calls, data relocation, or synthetic health indicators. */
(function () {
  'use strict';
  if (window.__maelstromDeck) return;
  window.__maelstromDeck = true;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const BOOT_KEY = 'ms_boot_samurai_v2';
  const GROUPS = {
    'MEDIA': ['media', 'BRD-01'],
    'DOWNLOADS': ['heist', 'DTH-02'],
    'WORKSPACE': ['personal', 'ENG-03'],
    'MONITORING': ['monitoring', 'OVR-04'],
    'INFRASTRUCTURE': ['core', 'COR-05'],
    'BACKGROUND TASKS': ['ghost', 'BG-06'],
    'SYSTEM HEALTH': ['health', 'SYS-00'],
    'NETWORK': ['tunnel', 'NET-01'],
    'STORAGE': ['storage', 'VOL-02'],
    'COMPUTE': ['host', 'HST-03'],
  };
  const values = new WeakMap();
  let frame = 0;
  let lastTab = '';
  let dismissBoot = () => {};

  var NW_ASCII = [
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⠿⠓⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⡟⠀⢀⡆⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⠀⠅⠀⠀⠀⠀⢀⡄⠀⠀⠀⣿⣿⣿⣗⣠⣾⡇⠀⠀⠀⠀⢠⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⢸⣆⠀⠀⢰⣿⣿⣿⣿⣿⣯⠀⢀⣴⠆⠀⠻⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⣷⠀⠀⠀⠀⠀⠀⢸⣿⠀⢀⣾⣿⣿⣿⣿⣿⡿⣥⣾⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⡆⠀⠀⣀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⢹⣿⠀⠀⠀⣴⠃⠀⣠⡆⢀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠱⣄⠀⠀⠀⠀⠈⣿⡇⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀⠘⠁⠀⠀⣰⣿⠀⢰⠟⠀⣤⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠀⠀⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⢀⠁⠀⢀⣰⣿⣿⡿⠆⠈⠀⣰⣷⡄⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠘⢿⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⣧⡜⠀⣠⣿⣿⣿⣿⡿⠋⣹⣿⣿⣿⠟⢸⣿⣦⣴⣿⣿⣿⡿⠁⠀⠀⣾⣿⣿⠁⠀⠀⠀⠀",
    "⠀⠀⠀⠀⢀⠀⠀⢹⣿⣧⠀⠀⠀⠀⡀⢀⣾⢀⣿⣿⣿⣾⣿⣿⣿⣿⠛⠁⢠⠿⠟⠉⠁⠀⢸⣹⣿⣿⠛⠻⣯⠁⠀⠀⣀⣿⠿⠁⠀⠀⠀⣆⢹",
    "⠀⠀⠰⣄⠸⣷⡄⠀⢿⣟⠀⠀⠀⠀⣷⡀⣇⠀⣿⣿⠿⣿⠛⣿⠏⠀⠀⡄⠀⢀⣴⡾⠁⠀⣼⣿⡿⠏⠀⠐⣿⡄⠀⣰⠋⠀⠀⣺⠀⠀⠀⢹⣘",
    "⠀⠀⠠⣽⣶⡿⠇⠀⠀⢉⠀⠶⠒⠀⠘⢷⣿⣥⠈⠿⠀⠘⢆⠘⠀⢠⣿⡁⠀⣾⣿⠃⠀⣸⢿⣿⣇⣀⠀⢀⣿⡇⠀⡘⠀⠀⠸⣿⠀⠀⠀⢸⠁",
    "⠀⠀⠀⠘⠋⢀⠀⣄⠀⣆⠁⣾⣿⣧⠀⠘⣿⣿⣦⢸⣦⠀⠈⣤⣼⣿⣿⣿⣾⡿⠁⠀⠈⣠⣾⣿⣿⣿⣿⣿⣿⡇⢀⣧⠀⠲⣀⣿⡆⠀⠐⠀⠀",
    "⠀⠀⠀⠀⡶⢠⣾⡿⠷⠿⢷⣿⣿⣿⠇⠀⠋⢹⣿⣶⣿⣷⣶⣿⣿⣿⠋⠉⣿⠃⠀⢀⣾⣿⣿⣿⣿⡿⠻⠙⠿⡇⠈⣿⠁⠀⣿⠏⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⡀⠙⡁⠶⣿⡿⢒⣠⠀⡤⠀⢐⠀⠸⣿⣿⣿⣿⣿⡟⠉⢿⠀⢸⣿⡀⠀⢸⣿⣿⣿⠟⠁⠀⠀⠀⠀⢱⠀⠎⠠⠔⠁⠀⠀⠀⠀⠀⠀",
    "⠀⠀⣶⠀⡇⢄⠘⠲⣦⠰⠟⠉⠒⠲⡄⠀⠁⢸⣿⠟⠁⢸⠟⢣⠀⠻⡀⠘⢿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠘⡆⠀⣶⠃⣰⡆⠀⠀⠀⠀⠀",
    "⠂⠀⣿⣦⠈⠈⠛⢶⣦⠀⡸⡀⠀⠀⡸⠀⠀⠈⠁⠀⠰⠃⠀⢸⣄⠀⠘⠂⡀⢻⣿⡿⠟⠀⢤⠀⠀⠀⠀⠀⠀⢰⠗⢠⡯⢰⣿⠁⠀⠀⠀⠀⠀",
    "⠀⣼⣿⡿⠁⠀⠈⢀⣄⠀⠷⣬⣑⡨⣴⡇⣴⠀⢀⣄⣠⣤⣴⣿⣾⣷⢄⡀⠀⠈⠀⠀⠈⠓⠋⠀⠀⠀⠀⢀⣼⠏⠀⣸⡇⢨⡏⠀⠀⠀⠀⠀⠀",
    "⠀⢫⣿⡃⠀⢰⣿⣦⣅⡀⠛⠶⠶⠶⠌⠁⠀⠀⠀⠀⠉⠉⣿⣹⣿⠉⠙⣌⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⡞⠁⠀⣰⢫⡇⠈⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠈⠇⠘⠘⢿⣥⣀⠉⠛⣿⣷⣶⣿⣿⡟⢀⣴⠂⠀⠀⠀⠹⣿⣧⡀⠀⠙⢦⡀⠀⠀⢦⣄⣤⣨⣭⣤⣠⠴⠋⠀⠸⠁⠀⢦⡀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⣬⣙⡛⠓⠒⢒⢀⣤⠀⣄⠻⣿⣄⠀⠀⠀⢀⣿⣿⣽⣦⡀⠀⠀⠳⣄⡀⠀⠈⠛⠛⠛⠁⠀⡠⠞⠁⠀⠻⣦⡹⣦⡐⢄⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⣻⠟⣛⣃⣸⣿⡇⣹⣿⡷⠀⣠⠟⢻⣿⢿⠛⠋⠃⡄⠀⠈⢿⣶⣶⠦⢶⡖⠆⢁⣄⠐⢿⣷⣄⠈⠻⣌⢻⣆⠡⡀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⢋⣼⣿⣿⡿⠙⢁⣾⣿⡇⠀⠀⣠⣾⣿⠀⠀⠀⣴⠃⠀⣀⣀⡈⠉⠛⢷⣾⠀⠻⣿⣷⣄⠙⠛⣡⣄⡹⣧⠹⡇⢱",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠘⠗⣠⣌⠛⠀⠹⠿⠿⣇⠀⠀⠻⠿⠋⠀⠀⠋⠁⡔⠚⠉⣉⡋⠐⠀⠀⢟⠀⠀⠈⠻⣿⠇⣀⠈⠛⢛⣿⡗⢃⡌",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⢛⣴⣿⣿⣧⠰⣷⢰⡆⣶⢠⠀⠰⣦⣤⣤⣴⠶⠉⠀⢰⣾⣿⣿⣦⠈⠀⠀⠀⠀⠀⠀⠨⡘⢿⣿⣿⣿⣿⠇⡼⠀",
    "⠀⠀⠀⠀⢀⣀⣤⠶⢟⣫⣴⣿⣿⣿⣿⠏⠰⣤⡤⠔⠀⠀⠀⠀⠉⠉⠉⠁⠀⠀⠀⠈⠻⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠈⠒⠦⠭⠭⠥⠚⠀⠀",
    "⠀⠀⠴⠞⣛⣭⣴⣾⣿⣿⣿⣿⠿⠛⣡⢸⣷⣌⠓⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⣦⠐⣌⠻⢿⣿⣿⣷⣦⣬⣓⡒⠤⠤⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠤⣭⣭⣭⣭⣭⣭⣭⣭⠐⢶⡃⠉⠘⠿⠿⠈⡁⣠⣾⣿⣿⢿⣷⣶⣄⡙⠂⢾⣿⠀⠟⣡⣤⣍⡛⠻⢿⣿⣿⣿⡿⠶⢒⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⠀⠈⢿⣤⣀⣀⣦⠿⠛⠉⢁⡀⠀⢀⣀⡀⠙⠹⠿⣷⣦⣤⣞⣿⣿⠟⠀⠘⠓⠲⠶⠶⠒⠋⠁⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠓⠋⣡⡴⢁⣴⣿⣿⣦⣶⣿⣷⣄⠀⢶⣤⣭⠍⠛⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢁⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠄⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠿⠿⠟⠻⠿⠿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  ].join("\n");

  function addStyles() {
    if (document.getElementById("nw-fx-styles")) return;
    var css = [
      "#nw-scanlines{position:fixed;inset:0;z-index:9990;pointer-events:none;",
      "background:repeating-linear-gradient(0deg,rgba(0,0,0,0) 0 2px,rgba(255,34,51,.022) 2px 3px,rgba(0,0,0,.05) 3px 4px);}",

      "#nw-boot{position:fixed;inset:0;z-index:9999;background:#050203;display:flex;",
      "align-items:center;justify-content:center;cursor:pointer;overflow:hidden;",
      "transition:opacity .18s ease;font-family:'Share Tech Mono','Courier New',monospace;}",
      "#nw-boot.nw-out{opacity:0;pointer-events:none;}",

      /* sigil */
      "#nw-boot .nw-ascii{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);",
      "margin:0;color:#ff2233;opacity:0;font-size:15px;line-height:1.04;",
      "text-shadow:-2px 0 rgba(0,229,255,.35),2px 0 rgba(255,34,51,.55),0 0 22px rgba(255,34,51,.5);",
      "user-select:none;pointer-events:none;",
      "animation:nwAsciiIn .5s ease .12s forwards,nwAsciiFlicker 2.4s steps(1) .7s infinite;}",
      "@keyframes nwAsciiIn{to{opacity:.2;}}",
      "@keyframes nwAsciiFlicker{0%,100%{opacity:.2;}43%{opacity:.2;}45%{opacity:.08;}",
      "47%{opacity:.24;}49%{opacity:.2;}81%{opacity:.2;}83%{opacity:.11;}85%{opacity:.2;}}",

      /* terminal lines */
      "#nw-boot .nw-term{position:relative;z-index:1;width:min(680px,86vw);color:#ff2233;font-size:15px;",
      "line-height:1.85;letter-spacing:.06em;text-shadow:0 0 12px rgba(255,34,51,.45);",
      "transition:opacity .25s ease;}",
      "#nw-boot .nw-term.nw-dim{opacity:.14;}",
      "#nw-boot .nw-term .nw-head{color:#ff5566;border:1px solid rgba(255,34,51,.4);",
      "padding:6px 14px;display:inline-block;margin-bottom:18px;letter-spacing:.3em;}",
      "#nw-boot .nw-line{white-space:pre;opacity:0;}",
      "#nw-boot .nw-line.nw-on{opacity:1;}",
      "#nw-boot .nw-ok{color:#ff8895;}",

      /* glitch decode finale — in-flow terminal line */
      "#nw-boot .nw-granted-line{margin-top:14px;}",
      "#nw-boot .nw-granted{position:relative;display:inline-block;white-space:pre;",
      "font-size:1.3em;letter-spacing:.22em;color:#ff5566;",
      "text-shadow:-1.5px 0 rgba(0,229,255,.45),1.5px 0 rgba(255,34,51,.7),0 0 16px rgba(255,34,51,.5);}",
      "#nw-boot .nw-granted::before,#nw-boot .nw-granted::after{content:attr(data-text);",
      "position:absolute;inset:0;opacity:0;}",
      "#nw-boot .nw-granted-line.nw-on .nw-granted::before{color:#00e5ff;opacity:.7;text-shadow:none;",
      "animation:nwSliceA .72s steps(6,end) 2;}",
      "#nw-boot .nw-granted-line.nw-on .nw-granted::after{color:#ff2233;opacity:.75;text-shadow:none;",
      "animation:nwSliceB .72s steps(6,end) 2;}",
      "@keyframes nwSliceA{0%{clip-path:inset(8% 0 78% 0);transform:translate(-3px,-1px);}",
      "20%{clip-path:inset(64% 0 12% 0);transform:translate(3px,1px);}",
      "40%{clip-path:inset(30% 0 52% 0);transform:translate(-2px,0);}",
      "60%{clip-path:inset(78% 0 4% 0);transform:translate(3px,1px);}",
      "80%{clip-path:inset(12% 0 70% 0);transform:translate(-3px,-1px);}",
      "100%{clip-path:inset(45% 0 40% 0);transform:translate(0,0);opacity:0;}}",
      "@keyframes nwSliceB{0%{clip-path:inset(70% 0 8% 0);transform:translate(3px,1px);}",
      "20%{clip-path:inset(10% 0 72% 0);transform:translate(-3px,-1px);}",
      "40%{clip-path:inset(52% 0 28% 0);transform:translate(2px,0);}",
      "60%{clip-path:inset(4% 0 82% 0);transform:translate(-3px,-1px);}",
      "80%{clip-path:inset(58% 0 18% 0);transform:translate(3px,1px);}",
      "100%{clip-path:inset(36% 0 48% 0);transform:translate(0,0);opacity:0;}}",

      /* sub line — in-flow */
      "#nw-boot .nw-sub{display:block;margin-top:10px;opacity:0;color:rgba(255,136,149,.75);",
      "font-size:12px;letter-spacing:.3em;transition:opacity .2s steps(2,end);}",
      "#nw-boot .nw-sub.nw-on{opacity:.85;}",

      /* tear bars */
      "#nw-boot .nw-bar{position:absolute;left:0;right:0;height:3px;opacity:0;z-index:3;",
      "background:linear-gradient(90deg,transparent,rgba(255,34,51,.5) 18%,rgba(0,229,255,.35) 55%,transparent);",
      "pointer-events:none;}",
      "#nw-boot.nw-glitch .nw-bar{animation:nwBar .5s steps(3,end) 2;}",
      "@keyframes nwBar{0%{opacity:0;transform:translateX(0) scaleY(1);}",
      "25%{opacity:.9;transform:translateX(-22px) scaleY(2.4);}",
      "55%{opacity:.4;transform:translateX(18px) scaleY(1);}",
      "100%{opacity:0;transform:translateX(0) scaleY(1);}}",

      /* whole-frame jolt at decode */
      "#nw-boot.nw-glitch .nw-ascii{",
      "animation:nwAsciiIn .5s ease .12s forwards,nwAsciiFlicker 2.4s steps(1) .7s infinite,",
      "nwJolt .42s steps(2,end) 1;}",
      "@keyframes nwJolt{0%{transform:translate(-50%,-50%) skewX(0);}",
      "30%{transform:translate(calc(-50% - 9px),calc(-50% + 3px)) skewX(3deg);}",
      "65%{transform:translate(calc(-50% + 7px),calc(-50% - 2px)) skewX(-2deg);}",
      "100%{transform:translate(-50%,-50%) skewX(0);}}",
      "#nw-boot.nw-glitch .nw-term{animation:nwJoltTerm .42s steps(2,end) 1;}",
      "@keyframes nwJoltTerm{0%{transform:translate(0,0) skewX(0);}",
      "30%{transform:translate(-9px,3px) skewX(3deg);}",
      "65%{transform:translate(7px,-2px) skewX(-2deg);}",
      "100%{transform:translate(0,0) skewX(0);}}",

      "#nw-boot .nw-skip{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);",
      "color:rgba(255,136,149,.45);font-size:11px;letter-spacing:.25em;z-index:2;}",
      "#nw-boot .nw-cursor{display:inline-block;width:9px;height:16px;background:#ff2233;",
      "vertical-align:-2px;animation:nwBlink .7s steps(1) infinite;}",
      "@keyframes nwBlink{50%{opacity:0;}}",
    ].join("");
    var tag = document.createElement("style");
    tag.id = "nw-fx-styles";
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  /* ---- boot overlay ---- */
  var LINES = [
    ["MAELSTROM BOOTSTRAP v7.7.1 — GRID-07", 0],
    ["> AUTHENTICATING NETRUNNER ......... <span class='nw-ok'>OK</span>", 200],
    ["> SPINNING UP DAEMONS .............. <span class='nw-ok'>OK</span>", 400],
    ["> ICE INTEGRITY .................... <span class='nw-ok'>100%</span>", 600],
    ["> DECRYPTING BLACKWALL KEYS ........ <span class='nw-ok'>OK</span>", 800],
    ["> BREACH PROTOCOL .................. <span class='nw-ok'>ARMED</span> <span class='nw-cursor'></span>", 1000],
  ];
  var GLITCH_AT = 1350;
  var SUB_AT = 2150;
  var DISMISS_AT = 3200;
  var GLYPHS = "!<>-_\\/[]{}=+*^?#$%&@01▓▒░";

  function runBoot() {
    var overlay = document.createElement("div");
    overlay.id = "nw-boot";

    var ascii = document.createElement("pre");
    ascii.className = "nw-ascii";
    ascii.setAttribute("aria-hidden", "true");
    ascii.textContent = NW_ASCII;
    overlay.appendChild(ascii);

    var term = document.createElement("div");
    term.className = "nw-term";
    term.innerHTML =
      "<div class='nw-head'>MAELSTROM</div>" +
      LINES.map(function (l) {
        return "<div class='nw-line'>" + l[0] + "</div>";
      }).join("");
    overlay.appendChild(term);

    var grantedLine = document.createElement("div");
    grantedLine.className = "nw-line nw-granted-line";
    var prompt = document.createElement("span");
    prompt.textContent = "> ";
    var granted = document.createElement("span");
    granted.className = "nw-granted";
    granted.setAttribute("data-text", "");
    grantedLine.appendChild(prompt);
    grantedLine.appendChild(granted);
    term.appendChild(grantedLine);

    var sub = document.createElement("div");
    sub.className = "nw-sub";
    sub.textContent = "// BREACH SUCCESSFUL — JACKING IN //";
    term.appendChild(sub);

    for (var b = 0; b < 4; b++) {
      var bar = document.createElement("div");
      bar.className = "nw-bar";
      bar.style.top = 12 + Math.random() * 76 + "%";
      bar.style.animationDelay = (Math.random() * 0.25).toFixed(2) + "s";
      overlay.appendChild(bar);
    }

    var skip = document.createElement("button");
    skip.type = "button";
    skip.className = "nw-skip";
    skip.textContent = "[ CLICK / ESC TO SKIP ]";
    overlay.appendChild(skip);

    document.body.appendChild(overlay);

    var lines = term.querySelectorAll(".nw-line");
    var timers = [];
    var intervals = [];
    LINES.forEach(function (l, i) {
      timers.push(
        setTimeout(function () {
          lines[i].classList.add("nw-on");
        }, l[1])
      );
    });

    /* scramble-decode "ACCESS GRANTED" as a terminal line */
    function decode(text, duration) {
      grantedLine.classList.add("nw-on");
      var steps = Math.ceil(duration / 38);
      var frame = 0;
      var iv = setInterval(function () {
        frame++;
        var prog = frame / steps;
        var out = "";
        for (var i = 0; i < text.length; i++) {
          if (text[i] === " ") {
            out += " ";
          } else if (i / text.length < prog * 1.15 - 0.15) {
            out += text[i];
          } else {
            out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
        }
        granted.textContent = out;
        granted.setAttribute("data-text", out);
        if (frame >= steps) {
          clearInterval(iv);
          granted.textContent = text;
          granted.setAttribute("data-text", text);
        }
      }, 38);
      intervals.push(iv);
    }

    timers.push(
      setTimeout(function () {
        overlay.classList.add("nw-glitch");
        decode("ACCESS GRANTED", 700);
      }, GLITCH_AT)
    );

    timers.push(
      setTimeout(function () {
        sub.classList.add("nw-on");
      }, SUB_AT)
    );

    var dismissed = false;
    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      overlay.classList.add("nw-out");
      setTimeout(function () {
        overlay.remove();
      }, 180);
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") dismiss();
    }
    dismissBoot = dismiss;
    overlay.addEventListener("click", dismiss);
    document.addEventListener("keydown", onKey);
    timers.push(setTimeout(dismiss, DISMISS_AT));
  }

  function boot() {
    let seen = false;
    try { seen = sessionStorage.getItem(BOOT_KEY) === '1'; } catch (_) {}
    const root = document.documentElement;
    const curtain = getComputedStyle(root, '::before');
    // After the CSS timeout the dashboard is already usable: don't cover it again.
    const expired = curtain.animationName === 'msBootFallback' && curtain.visibility === 'hidden';
    try {
      if (seen || expired || motion.matches || window.NW_BOOT_DISABLED === true) return;
      addStyles();
      runBoot();
      try { sessionStorage.setItem(BOOT_KEY, '1'); } catch (_) {}
    } finally {
      // The intro is now mounted, or deliberately skipped. Same paint handoff.
      root.classList.add('ms-boot-resolved');
    }
  }

  function enhance() {
    frame = 0;
    const greeting = document.querySelector('.information-widget-greeting');
    if (greeting && !greeting.querySelector('.ms-emblem')) {
      const emblem = document.createElement('img');
      emblem.className = 'ms-emblem';
      emblem.src = '/images/maelstrom-icon.png';
      emblem.alt = '';
      emblem.setAttribute('aria-hidden', 'true');
      greeting.appendChild(emblem);
    }
    for (const button of document.querySelectorAll('#myTab button')) {
      const label = button.textContent.trim();
      if (button.getAttribute('aria-label') !== label) button.setAttribute('aria-label', label);
    }
    const layout = document.getElementById('layout-groups');
    if (!layout) return;
    const tab = document.querySelector('#myTab button[aria-selected="true"]')?.textContent.trim() || 'GRID';
    const view = tab === 'GRID' ? 'grid' : tab === 'VITALS' ? 'vitals' : 'private';
    if (layout.dataset.msView !== view) layout.dataset.msView = view;
    const tabChanged = lastTab !== tab;
    lastTab = tab;
    const groups = layout.querySelectorAll('.services-group');
    groups.forEach((group, index) => {
      const groupName = group.querySelector('.service-group-name')?.textContent.trim();
      const [kind, code] = GROUPS[groupName] || [view === 'private' ? 'private' : 'custom', 'NODE'];
      const fresh = !group.dataset.msGroup;
      if (fresh) {
        group.dataset.msGroup = kind;
        group.dataset.msCode = code;
        group.style.setProperty('--ms-delay', Math.min(index * 35, 175) + 'ms');
      }
      if ((fresh || tabChanged) && !motion.matches) group.classList.add('ms-enter');
    });
    for (const card of layout.querySelectorAll('.service-card')) {
      const alert = card.textContent.includes('🔴');
      if (card.classList.contains('nw-alert') !== alert) card.classList.toggle('nw-alert', alert);
    }
    for (const value of layout.querySelectorAll('.service-block > :first-child')) {
      const next = value.textContent.trim();
      const previous = values.get(value);
      if (previous !== undefined && previous !== next && previous && next && next !== '-' && !motion.matches && !document.hidden && !tabChanged) {
        value.classList.add('ms-updated');
      }
      values.set(value, next);
    }
  }

  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(enhance);
  }
  function initBlackwall() {
    const layer = document.createElement('div');
    layer.id = 'ms-blackwall';
    layer.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas');
    layer.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const source = document.createElement('canvas');
    const sourceCtx = source.getContext('2d', {willReadFrequently: true});
    if (!sourceCtx) return;
    // Native paint filter distorts the rendered page; no DOM snapshots or text copies.
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    filter.setAttribute('aria-hidden', 'true');
    filter.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
    filter.innerHTML = '<defs><filter id="ms-frame-corruption" x="-3%" y="-2%" width="106%" height="104%" color-interpolation-filters="sRGB"><feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="bands"/><feDisplacementMap in="SourceGraphic" in2="bands" scale="0" xChannelSelector="R" yChannelSelector="G" result="shifted"/><feColorMatrix in="shifted" type="matrix" values="0 0 0 0 0  .15 .50 .05 0 0  .2126 .7152 .0722 0 0  0 0 0 .4 0" result="cyan"/><feComponentTransfer in="cyan" result="fadedCyan"><feFuncA type="linear" slope="0"/></feComponentTransfer><feOffset in="fadedCyan" dx="-4" result="cyanEcho"/><feMerge><feMergeNode in="cyanEcho"/><feMergeNode in="shifted"/></feMerge></filter></defs>';
    document.body.append(filter, layer);
    const displacement = filter.querySelector('feDisplacementMap');
    const bandImage = filter.querySelector('feImage');
    const bandMap = document.createElement('canvas');
    bandMap.width = 1; bandMap.height = 256;
    const echoAlpha = filter.querySelector('feFuncA');
    const patterns = [document.createElement('canvas'), document.createElement('canvas')];
    const patternIds = [-1, -1];
    const toggle = document.createElement('button');
    toggle.id = 'ms-fx-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Blackwall visual effects');
    document.body.appendChild(toggle);
    const wallpaper = new Image();
    let samples = [];
    let enabled = true;
    try { enabled = sessionStorage.getItem('ms_blackwall_off') !== '1'; } catch (_) {}
    let nextTimer = 0;
    let drawFrame = 0;
    let burstStart = 0;
    let lastDraw = 0;
    let burstSeed = 1;
    let pageActive = true;
    let burstDuration = 1800;
    let burstIntensity = .85;
    let nextDue = 0;
    // A long-tailed distribution avoids a detectable repeating cadence.
    function quietDelay() {
      return 30000 + Math.min(120000, -Math.log1p(-Math.random()) * 35000);
    }
    function smoothstep(value) { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); }
    function scheduleNext() {
      const now = performance.now();
      if (nextDue <= now) nextDue = now + quietDelay();
      nextTimer = setTimeout(burst, nextDue - now);
    }
    function allowed() {
      return pageActive && enabled && !motion.matches && !document.hidden &&
        !document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]:not([aria-hidden="true"])') &&
        !document.activeElement?.matches('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
    }
    function prepare() {
      const w = Math.min(1600, innerWidth);
      const h = Math.round(innerHeight * w / innerWidth);
      canvas.width = source.width = w;
      canvas.height = source.height = h;
      patterns.forEach(pattern => { pattern.width = w; pattern.height = h; });
      patternIds.fill(-1);
      samples = [];
      if (!wallpaper.naturalWidth) return;
      const scale = Math.min(w / wallpaper.naturalWidth, h / wallpaper.naturalHeight);
      const iw = wallpaper.naturalWidth * scale, ih = wallpaper.naturalHeight * scale;
      sourceCtx.drawImage(wallpaper, (w - iw) / 2, (h - ih) / 2, iw, ih);
      const pixels = sourceCtx.getImageData(0, 0, w, h).data;
      for (let y = 0; y < h; y += 3) for (let x = 0; x < w; x += 3) {
        const r = pixels[(y * w + x) * 4];
        if (r > 45) samples.push({x, y, r});
      }
    }
    const imageURL = getComputedStyle(document.getElementById('background') || document.body).backgroundImage.match(/url\(["']?([^"')]+)/)?.[1];
    if (imageURL) {
      const url = new URL(imageURL, location.href);
      // Sampling is restricted to the dashboard's own artwork, never remote images.
      if (url.origin === location.origin) { wallpaper.onload = prepare; wallpaper.src = url.href; }
    }
    prepare();
    function clearPaint() {
      if (drawFrame) cancelAnimationFrame(drawFrame);
      drawFrame = 0;
      document.body.classList.remove('ms-blackwall-active');
      document.querySelectorAll('.ms-signal-hit').forEach(element => element.classList.remove('ms-signal-hit'));
      displacement.setAttribute('scale', '0');
      echoAlpha.setAttribute('slope', '0');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    function clear() {
      clearTimeout(nextTimer);
      nextTimer = 0;
      clearPaint();
    }
    function renderPattern(target, phase) {
      const ctx = target.getContext('2d');
      const w = target.width, h = target.height;
      let seed = burstSeed + phase * 997;
      function random() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }
      const strength = 1;
      ctx.clearRect(0, 0, w, h);
      // Repeated slices of the actual wallpaper stretch into red data columns.
      if (samples.length) {
        ctx.globalAlpha = strength * .65;
        for (let i = 0; i < 150; i++) {
          const p = samples[Math.floor(random() * samples.length)];
          const stretch = 15 + random() ** 2 * h * .48;
          const dx = Math.floor(p.x / 3) * 3 + Math.round((random() - .5) * 18);
          const sy = Math.max(0, p.y - 2);
          ctx.drawImage(source, p.x, sy, 1, Math.min(5, h - sy), dx, p.y - stretch * random(), 1 + random() * 3, stretch);
          if (random() < .24) {
            ctx.fillStyle = '#00cfff';
            ctx.globalAlpha = .26;
            ctx.fillRect(dx - 3, p.y - stretch * .35, 1, stretch * .7);
            ctx.globalAlpha = strength * .65;
          }
        }
        // Larger compressed blocks slip sideways, leaving displaced afterimages.
        for (let i = 0; i < 24; i++) {
          const p = samples[Math.floor(random() * samples.length)];
          const sw = Math.min(w - p.x, 18 + random() * 150);
          const sh = Math.min(h - p.y, 2 + random() * 16);
          ctx.globalAlpha = strength * (.35 + random() * .4);
          ctx.drawImage(source, p.x, p.y, sw, sh, p.x + (random() - .5) * 130, p.y, sw, sh * (1 + random() * 2));
        }
      }
      // Terminal-blue channels cut through the red field, strongest at the margins.
      const count = Math.min(1700, Math.round(w * 1.2));
      for (let i = 0; i < count; i++) {
        const edge = random() < .66;
        const x = edge ? (random() < .5 ? random() * w * .14 : w * (.86 + random() * .14)) : random() * w;
        const y = random() * h;
        const length = random() < .08 ? 14 + random() * 65 : 1 + random() * 6;
        ctx.globalAlpha = strength * (.12 + random() * .55) * (edge ? 1 : .5);
        ctx.fillStyle = random() < .32 ? '#00cfff' : (random() < .35 ? '#ff4056' : '#ed1835');
        ctx.fillRect(Math.floor(x / 3) * 3, Math.floor(y / 2) * 2, random() < .12 ? 4 : 1, length);
      }
      ctx.font = '7px monospace';
      ctx.globalAlpha = strength * .6;
      for (let i = 0; i < 28; i++) {
        ctx.fillStyle = random() < .4 ? '#36dfff' : '#ff293d';
        const x = random() < .5 ? random() * w * .09 : w * (.9 + random() * .07);
        const y = random() * h;
        ctx.fillText(['1011', '0x7F', '░▒', '0100', '//'][Math.floor(random() * 5)], x, y);
      }
      ctx.globalAlpha = 1;
    }
    function paint(now) {
      drawFrame = 0;
      if (!allowed()) { sync(); return; }
      // RAF timestamps can precede performance.now() at burst creation.
      const elapsed = Math.max(0, now - burstStart);
      if (elapsed >= burstDuration) { clearPaint(); return; }
      if (now - lastDraw < 1000 / 30 - .5) { drawFrame = requestAnimationFrame(paint); return; }
      lastDraw = now;
      const progress = elapsed / burstDuration;
      const envelope = smoothstep(elapsed / 520) * smoothstep((burstDuration - elapsed) / 750);
      const strength = envelope * burstIntensity * (.78 + .22 * Math.sin(progress * Math.PI) ** 2);
      // Crossfade cached particle fields while the same displacement map eases
      // continuously. No per-frame random jumps or hard alpha changes.
      const position = elapsed / 480;
      const phase = Math.floor(position);
      const mix = smoothstep(position - phase);
      for (let i = phase; i <= phase + 1; i++) {
        const slot = i % 2;
        if (patternIds[slot] !== i) { renderPattern(patterns[slot], i); patternIds[slot] = i; }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = strength * (1 - mix);
      ctx.drawImage(patterns[phase % 2], 0, 0);
      ctx.globalAlpha = strength * mix;
      ctx.drawImage(patterns[(phase + 1) % 2], 0, 0);
      ctx.globalAlpha = 1;
      displacement.setAttribute('scale', (strength * 16).toFixed(3));
      echoAlpha.setAttribute('slope', strength.toFixed(3));
      drawFrame = requestAnimationFrame(paint);
    }
    function burst() {
      nextTimer = 0;
      if (!allowed()) { sync(); return; }
      if (!document.getElementById('nw-boot')) {
        burstStart = performance.now();
        burstSeed = Math.floor(Math.random() * 1000000);
        lastDraw = 0;
        burstDuration = 1400 + Math.random() * 800;
        burstIntensity = .7 + Math.random() * .3;
        patternIds.fill(-1);
        // A tiny precomputed stripe map avoids full-frame turbulence evaluation
        // on every paint (especially expensive on ultrawide software renderers).
        const map = bandMap.getContext('2d');
        for (let y = 0; y < 256;) {
          const rows = 2 + Math.floor(Math.random() * 6);
          const red = [30, 128, 128, 128, 225][Math.floor(Math.random() * 5)];
          map.fillStyle = `rgb(${red},128,128)`;
          map.fillRect(0, y, 1, rows);
          y += rows;
        }
        bandImage.setAttribute('href', bandMap.toDataURL());
        // Filter small visible surfaces rather than repainting the entire page.
        const cards = [...document.querySelectorAll('.services-group:not([data-ms-group="ghost"]) .service-card')].filter(card => {
          const r = card.getBoundingClientRect();
          return r.width > 0 && r.bottom > 0 && r.top < innerHeight && !card.matches(':hover,:focus-within');
        });
        for (let i = 0; i < 2 && cards.length; i++) cards.splice(Math.floor(Math.random() * cards.length), 1)[0].classList.add('ms-signal-hit');
        document.querySelector('.information-widget-greeting')?.classList.add('ms-signal-hit');
        document.body.classList.add('ms-blackwall-active');
        drawFrame = requestAnimationFrame(paint);
      }
      nextDue = performance.now() + quietDelay();
      scheduleNext();
    }
    function sync() {
      const running = allowed();
      toggle.setAttribute('aria-pressed', String(enabled && !motion.matches));
      toggle.disabled = motion.matches;
      toggle.textContent = motion.matches ? 'BLACKWALL FX / REDUCED' : 'BLACKWALL FX / ' + (enabled ? 'ON' : 'OFF');
      toggle.title = motion.matches ? 'Animations disabled by your reduced-motion preference' : 'Toggle Blackwall visual corruption';
      if (layer.dataset.running === String(running)) return;
      clear();
      layer.dataset.running = String(running);
      if (running) scheduleNext();
    }
    toggle.addEventListener('click', () => {
      enabled = !enabled;
      try { if (enabled) sessionStorage.removeItem('ms_blackwall_off'); else sessionStorage.setItem('ms_blackwall_off', '1'); } catch (_) {}
      sync();
    });
    document.addEventListener('focusin', sync);
    document.addEventListener('focusout', () => queueMicrotask(sync));
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('pagehide', () => { pageActive = false; sync(); });
    window.addEventListener('pageshow', () => { pageActive = true; sync(); });
    window.addEventListener('resize', () => { clearPaint(); prepare(); });
    motion.addEventListener('change', sync);
    new MutationObserver(sync).observe(document.body, {attributes: true, subtree: true, attributeFilter: ['open', 'aria-hidden']});
    sync();
  }

  function init() {
    const filters = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    filters.setAttribute('aria-hidden', 'true');
    filters.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
    filters.innerHTML = '<defs><filter id="ms-red-ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0 .0283 .0951 .0096 0 0 .0425 .143 .0144 0 0 0 0 0 1 0"/></filter></defs>';
    document.body.appendChild(filters);
    const reticle = document.createElement('div');
    reticle.id = 'ms-reticle';
    reticle.setAttribute('aria-hidden', 'true');
    document.body.appendChild(reticle);
    enhance();
    boot();
    initBlackwall();
    const root = document.getElementById('page_container') || document.body;
    new MutationObserver(schedule).observe(root, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ['aria-selected'],
    });
    document.addEventListener('animationend', event => {
      if (event.animationName === 'msAssemble') event.target.classList.remove('ms-enter');
      if (event.animationName === 'msData') event.target.classList.remove('ms-updated');
    });
    document.addEventListener('visibilitychange', () => {
      document.body.classList.toggle('ms-paused', document.hidden);
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        dismissBoot();
      } else schedule();
    });
    motion.addEventListener('change', () => {
      if (motion.matches) {
        dismissBoot();
        document.querySelectorAll('.ms-enter,.ms-updated').forEach(element => element.classList.remove('ms-enter', 'ms-updated'));
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();

/* PRIVATE — optional client-side convenience gate.
   Ctrl+Shift+L opens a masked dialog; the same shortcut re-locks.
   Configure a local key with scripts/set-password.py after setup.
   This hides UI only. Protect the dashboard and services with real auth.
   HTTPS or localhost is required for crypto.subtle. */
(function () {
  "use strict";
  var HASH = "";
  var KEY = "nw_vault_open";
  function tab(name) { return document.getElementById(name + '-tab'); }
  let dialog, field, status, submit, previousFocus;
  let attempt = 0;
  function reveal(activate) {
    document.body.classList.add('nw-vault-open');
    try { sessionStorage.setItem(KEY, '1'); } catch (_) {}
    if (activate) tab('PRIVATE')?.click();
  }
  function lock() {
    document.body.classList.remove('nw-vault-open');
    try { sessionStorage.removeItem(KEY); } catch (_) {}
    tab('GRID')?.click();
  }
  async function sha256hex(value) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  }
  function clearDialog() {
    attempt++;
    field.value = '';
    status.textContent = '';
    submit.disabled = false;
    field.removeAttribute('aria-invalid');
  }
  function closeDialog() {
    clearDialog();
    dialog.close();
    if (previousFocus?.isConnected) previousFocus.focus();
  }
  function buildDialog() {
    dialog = document.createElement('dialog');
    dialog.id = 'ms-vault';
    dialog.setAttribute('aria-labelledby', 'ms-vault-title');
    dialog.innerHTML = `
      <form id="ms-vault-form">
        <div class="ms-vault-topline"><span>GRID-07 // PRIVATE CHANNEL</span><button type="button" class="ms-vault-close" aria-label="Close unlock dialog">×</button></div>
        <img class="ms-vault-emblem" src="/images/maelstrom-icon.png" alt="" aria-hidden="true">
        <h2 id="ms-vault-title">PRIVATE</h2>
        <p class="ms-vault-subtitle">RESTRICTED CHANNEL // ACCESS KEY REQUIRED</p>
        <label for="ms-vault-key">Access key</label>
        <input id="ms-vault-key" name="password" type="password" autocomplete="current-password" autocapitalize="off" spellcheck="false" required aria-describedby="ms-vault-status">
        <p id="ms-vault-status" role="status" aria-live="polite"></p>
        <div class="ms-vault-actions"><button type="button" class="ms-vault-cancel">CANCEL / ESC</button><button type="submit" class="ms-vault-submit">UNLOCK CHANNEL →</button></div>
      </form>`;
    document.body.appendChild(dialog);
    field = dialog.querySelector('input');
    status = dialog.querySelector('[role="status"]');
    submit = dialog.querySelector('[type="submit"]');
    dialog.querySelector('.ms-vault-close').addEventListener('click', closeDialog);
    dialog.querySelector('.ms-vault-cancel').addEventListener('click', closeDialog);
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
    dialog.addEventListener('close', clearDialog);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
    });
    dialog.addEventListener('keydown', event => {
      // Keep normal typing out of Homepage's global quicklaunch shortcuts.
      if (!(event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'l')) event.stopPropagation();
    });
    dialog.querySelector('form').addEventListener('submit', async event => {
      event.preventDefault();
      if (submit.disabled || !field.value) return;
      if (!HASH) {
        field.value = '';
        status.textContent = 'No local key configured. Run scripts/set-password.py first.';
        return;
      }
      const currentAttempt = ++attempt;
      const password = field.value;
      field.value = '';
      submit.disabled = true;
      status.textContent = 'Checking access key…';
      try {
        const digest = await sha256hex(password);
        if (!dialog.open || currentAttempt !== attempt) return;
        if (digest === HASH) {
          closeDialog();
          reveal(true);
          tab('PRIVATE')?.focus();
        } else {
          status.textContent = 'Access key rejected. Try again.';
          field.setAttribute('aria-invalid', 'true');
          field.focus();
        }
      } catch (_) {
        if (dialog.open && currentAttempt === attempt) status.textContent = 'Could not check the key. Use the HTTPS homepage and try again.';
      } finally {
        if (currentAttempt === attempt) submit.disabled = false;
      }
    });
  }
  function tryUnlock() {
    if (!dialog) buildDialog();
    if (dialog.open) { field.focus(); return; }
    previousFocus = document.activeElement;
    clearDialog();
    dialog.showModal();
    field.focus();
  }
  function init() {
    try { if (HASH && sessionStorage.getItem(KEY) === '1') reveal(false); } catch (_) {}
    document.addEventListener('keydown', event => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        if (document.body.classList.contains('nw-vault-open')) lock();
        else tryUnlock();
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
