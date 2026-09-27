/*
 * plano.js — dibuja un condominio en un <svg>. Lo usan el visor público
 * (index.html) y el editor (editor.html), así todos los planos comparten estilo.
 *
 * Tipos de forma que entiende:
 *   terreno  { puntos }                 contorno del terreno (se pinta como seto)
 *   area     { puntos, nombre, color? } áreas comunes (club, parque…)
 *   via      { puntos, nombre, color? } calles, pasajes, carretera
 *   rotonda  { cx, cy, rx, ry }         fin de calle / rotonda con arbustos
 *   lote     { puntos, numero, estado, area, perimetro, precio, … }
 *   texto    { x, y, texto, tam, color?, giro? }
 */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  var ESTADOS = {
    disponible:    { nombre: 'Disponible',    color: '#7cae2c' },
    separado:      { nombre: 'Separado',      color: '#ec8a16' },
    reservado:     { nombre: 'Reservado',     color: '#2f6fb0' },
    vendido:       { nombre: 'Vendido',       color: '#8e1618' },
    no_disponible: { nombre: 'No disponible', color: '#b0291f' }
  };

  var COLORES = { via: '#e6d54c', area: 'url(#cesped)', terreno: 'url(#seto)', texto: '#2a2a1c' };

  var ORDEN_CAPAS = ['terreno', 'area', 'via', 'rotonda', 'lote', 'texto'];

  function crear(tag, attrs, padre) {
    var n = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (padre) padre.appendChild(n);
    return n;
  }

  function ptsStr(p) { return p.map(function (q) { return q[0] + ',' + q[1]; }).join(' '); }

  function areaPoligono(p) {
    var a = 0;
    for (var i = 0; i < p.length; i++) {
      var j = (i + 1) % p.length;
      a += p[i][0] * p[j][1] - p[j][0] * p[i][1];
    }
    return a / 2;
  }

  function caja(p) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    p.forEach(function (q) {
      if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0];
      if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1];
    });
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  function centroide(p) {
    var a = areaPoligono(p);
    if (Math.abs(a) < 1e-6) {
      var b = caja(p);
      return [b.x + b.w / 2, b.y + b.h / 2];
    }
    var cx = 0, cy = 0;
    for (var i = 0; i < p.length; i++) {
      var j = (i + 1) % p.length;
      var f = p[i][0] * p[j][1] - p[j][0] * p[i][1];
      cx += (p[i][0] + p[j][0]) * f;
      cy += (p[i][1] + p[j][1]) * f;
    }
    return [cx / (6 * a), cy / (6 * a)];
  }

  /* Caja envolvente de todo el dibujo (para encuadrar la vista). */
  function cajaFormas(cond) {
    var pts = [];
    cond.formas.forEach(function (f) {
      if (f.puntos) pts = pts.concat(f.puntos);
      else if (f.tipo === 'rotonda') pts.push([f.cx - f.rx, f.cy - f.ry], [f.cx + f.rx, f.cy + f.ry]);
      else if (f.tipo === 'texto') pts.push([f.x, f.y]);
    });
    if (!pts.length) return { x: 0, y: 0, w: cond.lienzo.ancho, h: cond.lienzo.alto };
    return caja(pts);
  }

  function aNumero(v) {
    if (v === '' || v == null) return NaN;
    return Number(String(v).replace(/[^\d.]/g, ''));
  }

  function formatoPrecio(v, moneda) {
    var n = aNumero(v);
    if (!isFinite(n) || n <= 0) return v ? String(v) : '';
    return (moneda ? moneda + ' ' : '') + n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  function formatoArea(v) {
    if (v === '' || v == null) return '';
    return String(v) + ' m²';
  }

  function estadoDe(lote) { return ESTADOS[lote.estado] || ESTADOS.no_disponible; }

  function lineasLote(l, cond) {
    var titulo = 'LOTE ' + (l.numero || '—');
    if (l.estado === 'disponible') {
      var out = [{ t: titulo, c: 'l-n' }];
      if (l.area) out.push({ t: formatoArea(l.area), c: 'l-d' });
      var pr = formatoPrecio(l.precio, cond.moneda);
      if (pr) out.push({ t: pr, c: 'l-p' });
      return out;
    }
    return [{ t: titulo, c: 'l-n' }, { t: estadoDe(l).nombre.toUpperCase(), c: 'l-e' }];
  }

  /* Tamaño de letra según el espacio que tiene el lote. */
  function medidasEtiqueta(p, giro, nLineas) {
    var b = caja(p);
    var A = Math.abs(areaPoligono(p));
    var vertical = Math.abs(giro || 0) % 180 === 90;
    var largo = vertical ? b.h : A / Math.max(b.h, 1);
    var grosor = vertical ? A / Math.max(b.h, 1) : b.h;
    var s = Math.min(grosor / (nLineas * 1.45), largo / 7.2);
    return Math.max(7, Math.min(19, s));
  }

  function defs(svg) {
    var d = crear('defs', null, svg);
    var seto = crear('pattern', { id: 'seto', width: 9, height: 9, patternUnits: 'userSpaceOnUse' }, d);
    crear('rect', { width: 9, height: 9, fill: '#3b6a23' }, seto);
    crear('circle', { cx: 2.4, cy: 2.4, r: 2.3, fill: '#4f8631' }, seto);
    crear('circle', { cx: 7, cy: 6.6, r: 2.1, fill: '#46792b' }, seto);
    var cesped = crear('pattern', { id: 'cesped', width: 12, height: 12, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(35)' }, d);
    crear('rect', { width: 12, height: 12, fill: '#6f9e4b' }, cesped);
    crear('rect', { width: 12, height: 5, fill: '#79a855' }, cesped);
    return d;
  }

  /*
   * dibujar(svg, cond, op) → { capas, nodos }
   *   op.seleccionado   id de la forma resaltada
   *   op.filtro         'disponibles' atenúa el resto de lotes
   *   op.referencia     { src, opacidad } imagen de fondo para calcar (editor)
   *   op.mantenerVista  no reinicia el viewBox
   */
  function dibujar(svg, cond, op) {
    op = op || {};
    svg.replaceChildren();
    svg.classList.add('plano-svg');
    var W = cond.lienzo.ancho, H = cond.lienzo.alto;
    if (!op.mantenerVista || !svg.getAttribute('viewBox')) svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    defs(svg);

    var capas = {};
    capas.referencia = crear('g', { 'data-capa': 'referencia' }, svg);
    ORDEN_CAPAS.forEach(function (k) { capas[k] = crear('g', { 'data-capa': k }, svg); });
    capas.extra = crear('g', { 'data-capa': 'extra' }, svg);

    if (op.referencia && op.referencia.src) {
      crear('image', {
        href: op.referencia.src, x: 0, y: 0, width: W, height: H,
        preserveAspectRatio: 'xMinYMin meet', opacity: op.referencia.opacidad == null ? 0.5 : op.referencia.opacidad,
        style: 'pointer-events:none'
      }, capas.referencia);
    }

    var nodos = new Map();
    cond.formas.forEach(function (f) {
      var capa = capas[f.tipo];
      if (!capa) return;
      var g = crear('g', { 'data-id': f.id, class: 'forma forma-' + f.tipo }, capa);
      if (f.tipo === 'lote') dibujarLote(g, f, cond, op);
      else if (f.tipo === 'rotonda') dibujarRotonda(g, f);
      else if (f.tipo === 'texto') dibujarTexto(g, f);
      else dibujarPoligono(g, f);
      nodos.set(f.id, g);
    });
    return { capas: capas, nodos: nodos };
  }

  function dibujarPoligono(g, f) {
    if (!f.puntos || f.puntos.length < 2) return;
    var relleno = f.color || COLORES[f.tipo] || '#999';
    crear('polygon', { points: ptsStr(f.puntos), fill: relleno, stroke: f.tipo === 'via' ? relleno : 'none', 'stroke-width': f.tipo === 'via' ? 0.6 : null }, g);
    if (f.tipo === 'terreno') {
      g.firstChild.setAttribute('stroke', '#2f561c');
      g.firstChild.setAttribute('stroke-width', '1.5');
    }
    if (f.tipo === 'area' && f.nombre) {
      var c = centroide(f.puntos), b = caja(f.puntos);
      var s = Math.max(8, Math.min(16, b.w / (f.nombre.length * 0.62), b.h / 3));
      var t = crear('text', { x: c[0], y: c[1], 'font-size': s.toFixed(1), 'stroke-width': s / 5, class: 'etiqueta-area', 'dominant-baseline': 'middle' }, g);
      partirTexto(f.nombre, b.w / (s * 0.6)).forEach(function (linea, i, arr) {
        crear('tspan', { x: c[0], dy: i === 0 ? (-(arr.length - 1) * 0.6 * s).toFixed(1) : (1.2 * s).toFixed(1) }, t).textContent = linea;
      });
    }
  }

  function partirTexto(texto, maxCar) {
    var palabras = String(texto).split(/\s+/), lineas = [], act = '';
    palabras.forEach(function (w) {
      if (act && (act + ' ' + w).length > maxCar) { lineas.push(act); act = w; }
      else act = act ? act + ' ' + w : w;
    });
    if (act) lineas.push(act);
    return lineas;
  }

  function dibujarRotonda(g, f) {
    crear('ellipse', { cx: f.cx, cy: f.cy, rx: f.rx, ry: f.ry, fill: f.color || COLORES.via }, g);
    // arbustos alrededor
    crear('ellipse', {
      cx: f.cx, cy: f.cy, rx: f.rx + 1, ry: f.ry + 1, fill: 'none',
      stroke: '#467a2b', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-dasharray': '0 9.5'
    }, g);
  }

  function dibujarTexto(g, f) {
    var t = crear('text', {
      x: f.x, y: f.y, 'font-size': f.tam || 14, fill: f.color || COLORES.texto,
      class: 'texto-libre', 'dominant-baseline': 'middle',
      transform: f.giro ? 'rotate(' + f.giro + ' ' + f.x + ' ' + f.y + ')' : null
    }, g);
    t.textContent = f.texto || '';
  }

  function dibujarLote(g, l, cond, op) {
    if (!l.puntos || l.puntos.length < 3) return;
    var est = estadoDe(l);
    if (op.seleccionado === l.id) g.classList.add('sel');
    if (op.filtro === 'disponibles' && l.estado !== 'disponible') g.classList.add('atenuado');
    g.setAttribute('data-estado', l.estado || '');
    var poly = crear('polygon', { points: ptsStr(l.puntos), fill: est.color }, g);
    var titulo = crear('title', null, poly);
    titulo.textContent = 'Lote ' + (l.numero || '') + ' · ' + est.nombre;

    var lineas = lineasLote(l, cond);
    var giro = l.giroEtiqueta || 0;
    var c = centroide(l.puntos);
    if (l.etiqueta) { c = [c[0] + (l.etiqueta.dx || 0), c[1] + (l.etiqueta.dy || 0)]; }
    var s = medidasEtiqueta(l.puntos, giro, lineas.length);
    var tams = lineas.map(function (ln) { return ln.c === 'l-n' ? s * 1.08 : ln.c === 'l-p' ? s * 1.02 : s * 0.86; });
    var alto = tams.reduce(function (a, b) { return a + b * 1.2; }, 0);
    var t = crear('text', {
      x: c[0], y: c[1] - alto / 2, class: 'etiqueta-lote', 'text-anchor': 'middle',
      'stroke-width': (s / 5.5).toFixed(2),
      transform: giro ? 'rotate(' + giro + ' ' + c[0] + ' ' + c[1] + ')' : null
    }, g);
    var acumulado = 0;
    lineas.forEach(function (ln, i) {
      acumulado += tams[i] * (i === 0 ? 0.95 : 1.2);
      var sp = crear('tspan', { x: c[0], y: (c[1] - alto / 2 + acumulado).toFixed(1), 'font-size': tams[i].toFixed(1), class: ln.c }, t);
      if (ln.c === 'l-d') sp.setAttribute('font-weight', '600');
      sp.textContent = ln.t;
    });
  }

  /* ------------------------------------------------------------------
   * Vista: zoom y desplazamiento cambiando el viewBox.
   * ------------------------------------------------------------------ */
  function Vista(svg, base) {
    this.svg = svg;
    this.base = base; // {x,y,w,h}
    this.vb = { x: base.x, y: base.y, w: base.w, h: base.h };
    this.aplicar();
  }
  Vista.prototype.aplicar = function () {
    var v = this.vb;
    this.svg.setAttribute('viewBox', [v.x, v.y, v.w, v.h].map(function (n) { return +n.toFixed(2); }).join(' '));
  };
  Vista.prototype.reiniciar = function (base) {
    if (base) this.base = base;
    this.vb = { x: this.base.x, y: this.base.y, w: this.base.w, h: this.base.h };
    this.aplicar();
  };
  Vista.prototype.escala = function () { // píxeles de pantalla por unidad del plano
    var m = this.svg.getScreenCTM();
    return m ? m.a : 1;
  };
  Vista.prototype.aPlano = function (clientX, clientY) {
    var m = this.svg.getScreenCTM();
    if (!m) return [0, 0];
    var p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
    return [p.x, p.y];
  };
  Vista.prototype.zoom = function (factor, cx, cy) {
    var v = this.vb;
    if (cx == null) { cx = v.x + v.w / 2; cy = v.y + v.h / 2; }
    var nw = Math.max(this.base.w / 14, Math.min(this.base.w * 1.6, v.w / factor));
    var k = nw / v.w;
    v.x = cx - (cx - v.x) * k;
    v.y = cy - (cy - v.y) * k;
    v.w = nw; v.h = v.h * k;
    this.aplicar();
  };
  Vista.prototype.moverPx = function (dx, dy) {
    var s = this.escala();
    this.vb.x -= dx / s;
    this.vb.y -= dy / s;
    this.aplicar();
  };
  Vista.prototype.acercado = function () { return this.vb.w < this.base.w * 0.98; };

  global.Plano = {
    CLAVE_BORRADOR: 'planos-lotes:borrador',
    ESTADOS: ESTADOS,
    COLORES: COLORES,
    crear: crear,
    ptsStr: ptsStr,
    areaPoligono: areaPoligono,
    caja: caja,
    cajaFormas: cajaFormas,
    centroide: centroide,
    formatoPrecio: formatoPrecio,
    formatoArea: formatoArea,
    estadoDe: estadoDe,
    dibujar: dibujar,
    Vista: Vista
  };
})(window);
