/*
 * visor.js — página pública: pestañas de condominios, plano interactivo y
 * ficha de cada lote.
 *
 * Parámetros de la dirección:
 *   index.html#la-finca     abre ese condominio
 *   index.html?embed        oculta cabecera y pie (para usar en un iframe)
 *   index.html?borrador     muestra el borrador guardado por el editor
 */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  if (params.has('embed')) document.documentElement.classList.add('embed');

  var sitio = window.SITIO || {};
  var lista = window.CONDOMINIOS || [];

  if (params.has('borrador')) {
    try {
      var b = JSON.parse(localStorage.getItem(Plano.CLAVE_BORRADOR));
      if (b && Array.isArray(b.condominios)) {
        lista = b.condominios;
        if (b.sitio) sitio = b.sitio;
        document.getElementById('avisoBorrador').hidden = false;
      }
    } catch (e) { /* sin borrador: se usan los datos publicados */ }
  }

  var $ = function (id) { return document.getElementById(id); };
  var svg = $('plano'), marco = $('marco'), panel = $('panel');
  var estado = { cond: null, sel: null, filtro: null };
  var vista = null;

  if (sitio.nombre) {
    $('sitioNombre').textContent = sitio.nombre;
    document.title = sitio.nombre;
  }

  function lotes(cond) {
    return cond.formas.filter(function (f) { return f.tipo === 'lote'; })
      .sort(function (a, b) { return String(a.numero).localeCompare(String(b.numero), 'es', { numeric: true }); });
  }

  function texto(tag, contenido, clase) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (contenido != null) n.textContent = contenido;
    return n;
  }

  /* ---------- Pestañas ---------- */
  function pintarPestanas() {
    var nav = $('pestanas');
    nav.replaceChildren();
    lista.forEach(function (c) {
      var b = texto('button', c.nombre, 'pestana');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(estado.cond && estado.cond.id === c.id));
      b.addEventListener('click', function () { elegir(c.id, true); });
      nav.appendChild(b);
    });
    nav.hidden = lista.length < 2;
  }

  function elegir(id, cambiarHash) {
    var c = lista.find(function (x) { return x.id === id; }) || lista[0];
    if (!c) {
      $('condNombre').textContent = 'No hay condominios cargados';
      return;
    }
    estado.cond = c;
    estado.sel = null;
    if (cambiarHash) history.replaceState(null, '', '#' + c.id);
    $('condNombre').textContent = c.nombre;
    $('condUbicacion').textContent = [c.ubicacion, c.descripcion].filter(Boolean).join(' · ');
    pintarPestanas();
    pintarResumen();
    pintarLeyenda();
    Plano.dibujar(svg, c, {});
    svg.style.aspectRatio = '';
    var b = Plano.cajaFormas(c), m = 10;
    var base = { x: b.x - m, y: b.y - m, w: b.w + 2 * m, h: b.h + 2 * m };
    svg.style.aspectRatio = base.w + ' / ' + base.h;
    if (vista) vista.reiniciar(base); else vista = new Plano.Vista(svg, base);
    actualizarTouch();
    redibujar();
    pintarPanel();
  }

  function redibujar() {
    Plano.dibujar(svg, estado.cond, { seleccionado: estado.sel, filtro: estado.filtro, mantenerVista: true });
  }

  function pintarResumen() {
    var ls = lotes(estado.cond);
    var disp = ls.filter(function (l) { return l.estado === 'disponible'; }).length;
    var r = $('resumen');
    r.replaceChildren();
    [[disp, 'disponibles', 'cifra cifra-verde'], [ls.length, 'lotes en total', 'cifra']].forEach(function (x) {
      var d = texto('div', null, x[2]);
      d.appendChild(texto('b', String(x[0])));
      d.appendChild(texto('small', x[1]));
      r.appendChild(d);
    });
  }

  function pintarLeyenda() {
    var usados = {};
    lotes(estado.cond).forEach(function (l) { usados[l.estado] = true; });
    var ley = $('leyenda');
    ley.replaceChildren();
    // estados con el mismo color comparten una sola entrada ("Vendido / No disponible")
    var porColor = {};
    Object.keys(Plano.ESTADOS).forEach(function (k) {
      if (!usados[k]) return;
      var c = Plano.ESTADOS[k].color;
      (porColor[c] = porColor[c] || []).push(Plano.ESTADOS[k].nombre);
    });
    Object.keys(porColor).forEach(function (c) {
      var s = texto('span');
      var m = texto('i', null, 'muestra');
      m.style.background = c;
      s.appendChild(m);
      s.appendChild(document.createTextNode(porColor[c].join(' / ')));
      ley.appendChild(s);
    });
  }

  /* ---------- Panel lateral ---------- */
  function pintarPanel() {
    panel.replaceChildren();
    var c = estado.cond;
    var sel = estado.sel && c.formas.find(function (f) { return f.id === estado.sel; });
    if (sel) return pintarDetalle(sel);

    var disp = lotes(c).filter(function (l) { return l.estado === 'disponible'; });
    panel.appendChild(texto('h2', 'Lotes disponibles (' + disp.length + ')'));
    if (!disp.length) {
      panel.appendChild(texto('p', 'No hay lotes disponibles en este momento.', 'vacio'));
      return;
    }
    var ul = texto('ul', null, 'lista-lotes');
    disp.forEach(function (l) {
      var li = document.createElement('li');
      var b = texto('button', null, 'fila-lote');
      b.type = 'button';
      var m = texto('i', null, 'muestra');
      m.style.background = Plano.estadoDe(l).color;
      var info = texto('span');
      info.appendChild(texto('strong', 'Lote ' + l.numero));
      info.appendChild(texto('small', [Plano.formatoArea(l.area), l.perimetro ? l.perimetro + ' ml' : ''].filter(Boolean).join(' · ')));
      b.append(m, info, texto('span', Plano.formatoPrecio(l.precio, c.moneda), 'fila-precio'));
      b.addEventListener('click', function () { seleccionar(l.id); });
      li.appendChild(b);
      ul.appendChild(li);
    });
    panel.appendChild(ul);
  }

  function pintarDetalle(l) {
    var c = estado.cond;
    var est = Plano.estadoDe(l);
    var d = texto('div', null, 'detalle');

    var cab = texto('div', null, 'detalle-cab');
    var tit = texto('div');
    tit.appendChild(texto('h2', c.nombre));
    tit.appendChild(texto('h3', 'Lote ' + l.numero));
    var pas = texto('span', est.nombre, 'pastilla');
    pas.style.background = est.color;
    cab.append(tit, pas);
    d.appendChild(cab);

    if (l.estado === 'disponible' && l.precio) {
      var p = texto('div', null, 'precio-grande');
      p.appendChild(texto('small', 'Precio'));
      p.appendChild(document.createTextNode(Plano.formatoPrecio(l.precio, c.moneda)));
      d.appendChild(p);
    }

    var dl = texto('dl', null, 'datos');
    function dato(nombre, valor, ancho) {
      if (!valor) return;
      var w = texto('div', null, ancho ? 'ancho' : '');
      w.append(texto('dt', nombre), texto('dd', valor));
      dl.appendChild(w);
    }
    dato('Área', Plano.formatoArea(l.area));
    dato('Perímetro', l.perimetro ? l.perimetro + ' ml' : '');
    dato('Manzana', l.manzana);
    dato('Medidas de los lados', l.medidas, true);
    dato('Nota', l.nota, true);
    if (dl.children.length) d.appendChild(dl);

    if (l.estado === 'disponible' && c.whatsapp) {
      var num = String(c.whatsapp).replace(/\D/g, '');
      var msj = 'Hola, me interesa el Lote ' + l.numero + ' de ' + c.nombre + '.';
      var cont = texto('div', null, 'contacto');
      var a = texto('a', 'Consultar por WhatsApp', 'btn btn-primario');
      a.href = 'https://wa.me/' + num + '?text=' + encodeURIComponent(msj);
      a.target = '_blank';
      a.rel = 'noopener';
      cont.append(a, texto('span', 'WhatsApp: +' + num));
      d.appendChild(cont);
    }

    var volver = texto('button', 'Ver lotes disponibles', 'btn');
    volver.type = 'button';
    volver.addEventListener('click', function () { seleccionar(null); });
    d.appendChild(volver);
    panel.appendChild(d);
  }

  function seleccionar(id) {
    estado.sel = id;
    redibujar();
    pintarPanel();
    if (id && window.matchMedia('(max-width: 960px)').matches) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* ---------- Filtro ---------- */
  function filtrar(f) {
    estado.filtro = f;
    $('filtroTodos').setAttribute('aria-pressed', String(!f));
    $('filtroDisp').setAttribute('aria-pressed', String(f === 'disponibles'));
    redibujar();
  }
  $('filtroTodos').addEventListener('click', function () { filtrar(null); });
  $('filtroDisp').addEventListener('click', function () { filtrar('disponibles'); });

  /* ---------- Zoom y arrastre ---------- */
  function actualizarTouch() {
    // Sin zoom, el dedo desplaza la página; con zoom, mueve el plano.
    marco.style.touchAction = vista && vista.acercado() ? 'none' : 'pan-x pan-y';
  }
  $('zoomMas').addEventListener('click', function () { vista.zoom(1.4); actualizarTouch(); });
  $('zoomMenos').addEventListener('click', function () { vista.zoom(1 / 1.4); actualizarTouch(); });
  $('zoomReset').addEventListener('click', function () { vista.reiniciar(); actualizarTouch(); });

  svg.addEventListener('wheel', function (e) {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    var p = vista.aPlano(e.clientX, e.clientY);
    vista.zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, p[0], p[1]);
    actualizarTouch();
  }, { passive: false });

  var arrastre = null, huboArrastre = false;
  svg.addEventListener('pointerdown', function (e) {
    huboArrastre = false;
    if (!vista.acercado()) return;
    arrastre = { x: e.clientX, y: e.clientY, activo: false, id: e.pointerId };
  });
  svg.addEventListener('pointermove', function (e) {
    if (!arrastre || e.pointerId !== arrastre.id) return;
    var dx = e.clientX - arrastre.x, dy = e.clientY - arrastre.y;
    if (!arrastre.activo && Math.hypot(dx, dy) > 5) {
      arrastre.activo = true;
      svg.setPointerCapture(e.pointerId);
    }
    if (arrastre.activo) {
      vista.moverPx(dx, dy);
      arrastre.x = e.clientX; arrastre.y = e.clientY;
      huboArrastre = true;
    }
  });
  function soltar() { arrastre = null; }
  svg.addEventListener('pointerup', soltar);
  svg.addEventListener('pointercancel', soltar);

  svg.addEventListener('click', function (e) {
    if (huboArrastre) return;
    var g = e.target.closest('.forma-lote');
    seleccionar(g ? g.getAttribute('data-id') : null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && estado.sel) seleccionar(null);
  });

  window.addEventListener('hashchange', function () {
    var id = location.hash.slice(1);
    if (id && (!estado.cond || id !== estado.cond.id)) elegir(id, false);
  });

  var pie = $('pie');
  pie.textContent = sitio.pie || 'Plano referencial. Áreas y medidas sujetas a verificación.';

  elegir(location.hash.slice(1), false);
})();
