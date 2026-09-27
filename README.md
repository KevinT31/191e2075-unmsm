# Mapa de Lotes

Plataforma web para mostrar planos de condominios con sus lotes. Al tocar un lote
se ve su ficha: estado, área, perímetro, medidas y precio. Todos los condominios
comparten el mismo estilo y cada uno tiene su propia pestaña.

Hay dos páginas:

| Página | Para quién | Qué hace |
| --- | --- | --- |
| `index.html` | Visitantes de la web | Plano interactivo, lista de lotes disponibles y ficha de cada lote. |
| `editor.html` | Tú | Dibujar y editar planos, cambiar estados y precios, crear condominios nuevos. |

No necesita servidor ni base de datos: son archivos estáticos. Funciona abriendo
`index.html` con doble clic o publicándolo en GitHub Pages.

## Estructura

```
index.html              visor público
editor.html             editor de planos
data/condominios.js     TODOS los datos (condominios, lotes, vías, precios…)
assets/js/plano.js      dibujo del plano (compartido: mismo estilo en todo)
assets/js/visor.js      lógica del visor
assets/js/editor.js     lógica del editor
assets/css/estilo.css   estilos
assets/img/             imágenes para calcar (solo las usa el editor)
```

## Publicar la web con GitHub Pages

1. Une esta rama con `main` (o la rama que quieras publicar).
2. En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**,
   elige `main` y la carpeta `/ (root)`.
3. En uno o dos minutos la web queda en `https://<tu-usuario>.github.io/<repositorio>/`.

### Ponerlo dentro de otra página web

Con un enlace directo a un condominio:

```
https://<tu-usuario>.github.io/<repositorio>/#la-finca
```

O incrustado (sin cabecera ni pie) con un `iframe`:

```html
<iframe src="https://<tu-usuario>.github.io/<repositorio>/?embed#la-finca"
        style="width:100%;height:900px;border:0" loading="lazy"></iframe>
```

## Cómo editar

1. Abre `editor.html`.
2. Haz los cambios. Se guardan solos en tu navegador (borrador).
3. **Vista previa** abre la web con tu borrador para revisarla.
4. **Publicar cambios** descarga `condominios.js`. Súbelo a la carpeta `data/`
   del repositorio reemplazando el anterior (en GitHub: *Add file → Upload files*).

> El borrador vive solo en el navegador donde editas. Si cambias de computadora,
> publica primero o usa **Importar** con el archivo `condominios.js`.

### Herramientas y atajos

| Herramienta | Tecla | Uso |
| --- | --- | --- |
| Mover | `V` | Clic para seleccionar; arrastra la forma o sus puntos azules. |
| Vista | `H` o mantener `Espacio` | Arrastra para desplazarte. La rueda del ratón acerca y aleja. |
| Lote | `L` | Clic en cada esquina; termina con `Enter`, doble clic o clic en el primer punto. |
| Vía | `R` | Igual que lote. Para calles, pasajes o carretera (color editable). |
| Área | `A` | Áreas comunes (club, parque…). Su nombre se escribe dentro. |
| Terreno | `T` | Contorno del terreno; se pinta como seto verde. |
| Rotonda | `O` | Arrastra para dibujarla. |
| Texto | `X` | Clic donde va el texto. |

Más atajos: `Ctrl+Z` deshacer, `Ctrl+Y` rehacer, `Ctrl+D` duplicar,
`Supr` eliminar, flechas para mover fino (`Shift` = 10 unidades), `Esc` cancelar.
Las esquinas se pegan a esquinas y bordes cercanos para que los lotes vecinos
compartan borde; mantén `Alt` para evitarlo. Doble clic en un borde agrega un
punto; doble clic en un punto lo borra. El cuadrito azul de un lote mueve su texto.

### Crear otro condominio

1. En el editor: **+ Nuevo condominio**.
2. En el panel derecho, **Imagen para calcar → Cargar imagen…** con la foto del
   plano. Si el lienzo está vacío, se ajusta al tamaño de la imagen.
3. Dibuja el terreno (`T`), las vías (`R`), las áreas (`A`) y los lotes (`L`)
   encima de la foto. Luego oculta la foto y completa los datos de cada lote.
4. **Publicar cambios**.

Si quieres que la foto de referencia quede disponible en cualquier computadora,
súbela a `assets/img/` y pon esa ruta en el campo `referencia` del condominio.

## Estados de los lotes

| Estado | Color |
| --- | --- |
| Disponible | verde |
| Separado | naranja |
| Reservado | azul |
| Vendido | rojo oscuro |
| No disponible | rojo |

Los estados y colores están en `assets/js/plano.js` (`ESTADOS`). En el mapa, los
lotes disponibles muestran número, área y perímetro (el precio solo aparece en la ficha
al tocar el lote); los demás, número y estado.

## Datos de La Finca

El plano se digitalizó desde la foto original (`assets/img/la-finca-referencia.webp`)
detectando cada lote por su color, así que las formas calzan con la foto.

- Verdes (disponibles) con precio: lotes 03, 11, 12, 16, 17, 18, 27, 28, 30 y 34.
  `precio` es el valor en verde de la lista y `precioBase` el valor en azul.
- 16, 17 y 18 tienen 1000 m² y 150 ml.
- Los demás están en rojo: *Vendido* si así figuraba en la foto, y
  *No disponible* para 01, 07, 09, 10, 22 (antes separado), 25 y 26.
- La foto tapa con "VENDIDO" el número de varios lotes; se numeraron siguiendo
  el orden del plano (01–11 a la izquierda de abajo hacia arriba, 12, 13–18 bajando,
  19–24 subiendo, 25, 26–35 a la derecha bajando). El lote junto al ingreso no
  tiene número en la foto: quedó como 36. Todo se corrige desde el editor.
- Las medidas de los lados se leyeron de los números pequeños de la foto. Verifícalas.
- Moneda: `US$`. Se cambia en el editor (campo *Moneda*).

**Importante:** todo lo que está en `data/condominios.js` es público cuando la web
está publicada, aunque el visor no lo muestre. Eso incluye `precioBase` y
`responsable`. Si esos datos son privados, bórralos antes de publicar.
