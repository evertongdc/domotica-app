/* Planta realista vista de cima, desenhada no navegador (sem IA), no estilo do modelo do Éverton:
   piso de madeira em tábuas nos cômodos secos, mármore escuro nas áreas molhadas, paredes escuras com sombra suave,
   brilho quente das luzes do teto e janelas de vidro. Enquadramento = caixa dos cômodos/paredes + 40 cm (mesma regra do portal).
   plantaRealista({ comodos, paredes, aberturas }, luzes: [[x, y, tipo]], largura?) -> dataURL JPEG */
(function () {
  function rnd(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function tipoPiso(c) {
    var n = (c.nome || '').toLowerCase();
    if (/banh|lavab|cozinh|lavand|servi|wc|gourmet/.test(n)) return 'marmore';
    if (/extern|quintal|jardim|garag|varanda|terra|area|área/.test(n)) return 'externo';
    return 'madeira';
  }
  function caminho(ctx, pts) { ctx.beginPath(); pts.forEach(function (q, i) { if (i) ctx.lineTo(+q[0], +q[1]); else ctx.moveTo(+q[0], +q[1]); }); ctx.closePath(); }
  function caixa(pts) { var xs = pts.map(function (q) { return +q[0]; }), ys = pts.map(function (q) { return +q[1]; }); return [Math.min.apply(null, xs), Math.min.apply(null, ys), Math.max.apply(null, xs), Math.max.apply(null, ys)]; }
  function madeira(ctx, c, r) {
    var b = caixa(c.pontos), horiz = (b[2] - b[0]) >= (b[3] - b[1]), larg = 19, comp = 140;
    var tons = ['#8a5e3c', '#835938', '#90643f', '#7d5434', '#87603e', '#946843'];
    if (horiz) { for (var y = b[1] - larg; y < b[3] + larg; y += larg) { var off = r() * comp; for (var x = b[0] - comp - off, w = 0; x < b[2] + comp; x += w) { w = comp * (0.7 + r() * 0.7); ctx.fillStyle = tons[(r() * tons.length) | 0]; ctx.fillRect(x, y, w, larg); ctx.fillStyle = 'rgba(40,24,12,.35)'; ctx.fillRect(x, y, 1, larg); } ctx.fillStyle = 'rgba(35,20,10,.4)'; ctx.fillRect(b[0] - comp, y, b[2] - b[0] + 2 * comp, .8); } }
    else { for (var x2 = b[0] - larg; x2 < b[2] + larg; x2 += larg) { var off2 = r() * comp; for (var y2 = b[1] - comp - off2, h = 0; y2 < b[3] + comp; y2 += h) { h = comp * (0.7 + r() * 0.7); ctx.fillStyle = tons[(r() * tons.length) | 0]; ctx.fillRect(x2, y2, larg, h); ctx.fillStyle = 'rgba(40,24,12,.35)'; ctx.fillRect(x2, y2, larg, 1); } ctx.fillStyle = 'rgba(35,20,10,.4)'; ctx.fillRect(x2, b[1] - comp, .8, b[3] - b[1] + 2 * comp); } }
    ctx.globalAlpha = .07; ctx.strokeStyle = '#2a1a0e'; ctx.lineWidth = .6;   /* veios da madeira */
    for (var i = 0; i < (b[2] - b[0]) * (b[3] - b[1]) / 900; i++) { var vx = b[0] + r() * (b[2] - b[0]), vy = b[1] + r() * (b[3] - b[1]); ctx.beginPath(); if (horiz) { ctx.moveTo(vx, vy); ctx.lineTo(vx + 30 + r() * 60, vy + (r() - .5) * 2); } else { ctx.moveTo(vx, vy); ctx.lineTo(vx + (r() - .5) * 2, vy + 30 + r() * 60); } ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  function marmore(ctx, c, r) {
    var b = caixa(c.pontos), t = 80;
    for (var x = b[0]; x < b[2]; x += t) for (var y = b[1]; y < b[3]; y += t) { var v = 92 + (r() * 12 | 0); ctx.fillStyle = 'rgb(' + v + ',' + (v - 3) + ',' + (v - 7) + ')'; ctx.fillRect(x, y, t, t); }
    ctx.strokeStyle = 'rgba(205,200,192,.22)'; ctx.lineWidth = 1.1;   /* veios do mármore */
    for (var i = 0; i < (b[2] - b[0]) * (b[3] - b[1]) / 7000 + 3; i++) { var x0 = b[0] + r() * (b[2] - b[0]), y0 = b[1] + r() * (b[3] - b[1]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0 + r() * 80 - 40, y0 + r() * 80 - 40, x0 + r() * 140 - 70, y0 + r() * 140 - 70, x0 + r() * 200 - 100, y0 + r() * 200 - 100); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(20,20,20,.45)'; ctx.lineWidth = .8;
    for (var gx = b[0]; gx < b[2]; gx += t) { ctx.beginPath(); ctx.moveTo(gx, b[1]); ctx.lineTo(gx, b[3]); ctx.stroke(); }
    for (var gy = b[1]; gy < b[3]; gy += t) { ctx.beginPath(); ctx.moveTo(b[0], gy); ctx.lineTo(b[2], gy); ctx.stroke(); }
  }
  function externo(ctx, c, r) {
    var b = caixa(c.pontos); ctx.fillStyle = '#55524c'; ctx.fillRect(b[0], b[1], b[2] - b[0], b[3] - b[1]);
    for (var i = 0; i < (b[2] - b[0]) * (b[3] - b[1]) / 60; i++) { var v = 70 + (r() * 30 | 0); ctx.fillStyle = 'rgba(' + v + ',' + v + ',' + (v - 4) + ',.35)'; ctx.fillRect(b[0] + r() * (b[2] - b[0]), b[1] + r() * (b[3] - b[1]), 2, 2); }
    ctx.strokeStyle = 'rgba(30,30,28,.5)'; ctx.lineWidth = 1; for (var gx = b[0]; gx < b[2]; gx += 100) { ctx.beginPath(); ctx.moveTo(gx, b[1]); ctx.lineTo(gx, b[3]); ctx.stroke(); } for (var gy = b[1]; gy < b[3]; gy += 100) { ctx.beginPath(); ctx.moveTo(b[0], gy); ctx.lineTo(b[2], gy); ctx.stroke(); }
  }
  /* trechos de parede sem as aberturas, para desenhar portas e janelas no vão */
  function trechos(w, abs) {
    var dx = w.x2 - w.x1, dy = w.y2 - w.y1, L = Math.hypot(dx, dy) || 1, vaos = abs.filter(function (a) { return a.parede === w.id; }).map(function (a) { var c = (+a.t || .5) * L, h = (+a.larg || 80) / 2; return [Math.max(0, c - h), Math.min(L, c + h), a]; }).sort(function (a, b) { return a[0] - b[0]; });
    var out = [], cur = 0; vaos.forEach(function (v) { if (v[0] > cur) out.push([cur, v[0]]); cur = Math.max(cur, v[1]); }); if (cur < L) out.push([cur, L]);
    return { L: L, ux: dx / L, uy: dy / L, cheio: out, vaos: vaos };
  }
  window.plantaRealista = function (pl, luzes, largura) {
    var xs = [], ys = []; pl.comodos.forEach(function (c) { (c.pontos || []).forEach(function (q) { xs.push(+q[0]); ys.push(+q[1]); }); }); pl.paredes.forEach(function (w) { xs.push(+w.x1, +w.x2); ys.push(+w.y1, +w.y2); });
    var pad = 40, x0 = Math.min.apply(null, xs) - pad, y0 = Math.min.apply(null, ys) - pad, W = Math.max.apply(null, xs) + pad - x0, H = Math.max.apply(null, ys) + pad - y0;
    var LP = largura || 2000, AP = Math.round(LP * H / W), k = LP / W;
    var cv = document.createElement('canvas'); cv.width = LP; cv.height = AP; var ctx = cv.getContext('2d');
    ctx.fillStyle = '#1c1a18'; ctx.fillRect(0, 0, LP, AP);
    ctx.setTransform(k, 0, 0, k, -x0 * k, -y0 * k);
    var r = rnd(7919), abs = pl.aberturas || [];
    /* 1) pisos */
    pl.comodos.forEach(function (c) { if ((c.pontos || []).length < 3) return; ctx.save(); caminho(ctx, c.pontos); ctx.clip(); var t = tipoPiso(c); if (t === 'madeira') madeira(ctx, c, r); else if (t === 'marmore') marmore(ctx, c, r); else externo(ctx, c, r); ctx.restore(); });
    /* 2) penumbra geral e sombra suave junto às paredes (dentro de cada cômodo) */
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgb(168,152,136)'; ctx.fillRect(x0, y0, W, H); ctx.restore();
    pl.comodos.forEach(function (c) { if ((c.pontos || []).length < 3) return; ctx.save(); caminho(ctx, c.pontos); ctx.clip(); ctx.filter = 'blur(' + (14 * k).toFixed(1) + 'px)'; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 40; caminho(ctx, c.pontos); ctx.stroke(); ctx.filter = 'none'; ctx.restore(); });
    /* 3) luz quente: poças de luz do teto e fitas (só dentro do cômodo da luz) */
    (luzes || []).forEach(function (l) {
      var x = +l[0], y = +l[1], fita = /fita|trilho/.test(l[2] || ''), rr = fita ? 150 : 210;
      var dono = pl.comodos.filter(function (c) { return (c.pontos || []).length > 2 && dentro(c.pontos, x, y); })[0];
      ctx.save(); if (dono) { caminho(ctx, dono.pontos); ctx.clip(); }
      ctx.globalCompositeOperation = 'screen';
      var g = ctx.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, 'rgba(255,200,125,.7)'); g.addColorStop(.4, 'rgba(255,170,90,.32)'); g.addColorStop(1, 'rgba(255,150,70,0)');
      ctx.fillStyle = g; ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      ctx.globalCompositeOperation = 'source-over'; var g2 = ctx.createRadialGradient(x, y, 0, x, y, fita ? 10 : 7); g2.addColorStop(0, 'rgba(255,244,214,.95)'); g2.addColorStop(1, 'rgba(255,214,150,0)'); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(x, y, fita ? 10 : 7, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
    /* 4) paredes escuras com sombra projetada; portas e janelas nos vãos */
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.65)'; ctx.shadowBlur = 18 * k; ctx.lineCap = 'square';
    pl.paredes.forEach(function (w) { var g = trechos(w, abs), e = Math.max(10, +w.esp || 15);
      g.cheio.forEach(function (s) { ctx.strokeStyle = w.vidro ? 'rgba(150,180,195,.55)' : '#141312'; ctx.lineWidth = w.vidro ? 4 : e; ctx.beginPath(); ctx.moveTo(w.x1 + g.ux * s[0], w.y1 + g.uy * s[0]); ctx.lineTo(w.x1 + g.ux * s[1], w.y1 + g.uy * s[1]); ctx.stroke(); }); });
    ctx.restore();
    pl.paredes.forEach(function (w) { var g = trechos(w, abs), e = Math.max(10, +w.esp || 15);
      g.cheio.forEach(function (s) { if (w.vidro) return; ctx.strokeStyle = 'rgba(70,66,60,.9)'; ctx.lineWidth = 1.2; ctx.lineCap = 'butt'; var nx = -g.uy * e / 2, ny = g.ux * e / 2; [1, -1].forEach(function (sg) { ctx.beginPath(); ctx.moveTo(w.x1 + g.ux * s[0] + nx * sg, w.y1 + g.uy * s[0] + ny * sg); ctx.lineTo(w.x1 + g.ux * s[1] + nx * sg, w.y1 + g.uy * s[1] + ny * sg); ctx.stroke(); }); });
      g.vaos.forEach(function (v) { var a = v[2], ax = w.x1 + g.ux * v[0], ay = w.y1 + g.uy * v[0], bx = w.x1 + g.ux * v[1], by = w.y1 + g.uy * v[1];
        if (a.tipo === 'janela') { ctx.strokeStyle = '#141312'; ctx.lineWidth = e; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.strokeStyle = 'rgba(160,195,210,.85)'; ctx.lineWidth = e * .45; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.strokeStyle = 'rgba(230,240,245,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); }
        else if (a.tipo === 'porta') { var nx2 = -g.uy, ny2 = g.ux, lw = v[1] - v[0]; ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 8 * k; ctx.strokeStyle = '#8a5f3c'; ctx.lineWidth = 4; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + nx2 * lw, ay + ny2 * lw); ctx.stroke(); ctx.restore(); }
        else if (a.tipo === 'portao') { ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = e * .6; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.strokeStyle = 'rgba(120,120,120,.6)'; ctx.lineWidth = 1; for (var t = 0; t < v[1] - v[0]; t += 12) { var px = ax + g.ux * t, py = ay + g.uy * t; ctx.beginPath(); ctx.moveTo(px - g.uy * e * .3, py + g.ux * e * .3); ctx.lineTo(px + g.uy * e * .3, py - g.ux * e * .3); ctx.stroke(); } }
      });
    });
    /* 5) vinheta e tom quente final */
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    var vg = ctx.createRadialGradient(LP / 2, AP / 2, Math.min(LP, AP) * .35, LP / 2, AP / 2, Math.max(LP, AP) * .72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, LP, AP);
    return cv.toDataURL('image/jpeg', .9);
  };
  function dentro(poly, x, y) { var d = false; for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) { var xi = +poly[i][0], yi = +poly[i][1], xj = +poly[j][0], yj = +poly[j][1]; if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) d = !d; } return d; }
})();
