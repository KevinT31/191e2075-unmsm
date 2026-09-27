/*
 * Datos de los condominios que muestra el sitio.
 * Este archivo lo genera el editor (editor.html → "Publicar cambios").
 * Puedes editarlo a mano: cada forma del plano ocupa una línea.
 */
window.SITIO = {"nombre": "Mapa de Lotes"};

window.CONDOMINIOS = [
  {
    "id": "la-finca",
    "nombre": "La Finca",
    "ubicacion": "El Carmen, Chincha",
    "descripcion": "Eco-condominio Waka. Lotes campestres de 730 a 1,000 m² junto a la carretera Chincha – El Carmen.",
    "moneda": "US$",
    "whatsapp": "",
    "lienzo": {"ancho": 1755, "alto": 906},
    "referencia": "assets/img/la-finca-referencia.webp",
    "formas": [
      {"id": "terreno", "tipo": "terreno", "nombre": "Terreno", "puntos": [[599, 27], [1748, 9], [1152, 857], [8, 862]]},
      {"id": "area-club", "tipo": "area", "nombre": "Club house y piscina", "puntos": [[414, 752], [576, 752], [589, 858], [366, 858]]},
      {"id": "area-deportiva", "tipo": "area", "nombre": "Zona deportiva", "puntos": [[630, 752], [764, 752], [764, 858], [625, 858]]},
      {"id": "carretera", "tipo": "via", "nombre": "Carretera Chincha – El Carmen", "color": "#8d9189", "puntos": [[0, 868], [1755, 868], [1755, 906], [0, 906]]},
      {"id": "via-izquierda", "tipo": "via", "nombre": "Vía izquierda", "puntos": [[868, 96], [908, 96], [376, 797], [336, 797]]},
      {"id": "via-derecha", "tipo": "via", "nombre": "Vía derecha", "puntos": [[1385, 80], [1423, 80], [883, 794], [841, 745], [882, 745]]},
      {"id": "area-de-paso", "tipo": "via", "nombre": "Área de paso", "puntos": [[400, 716], [934, 716], [911, 749], [375, 749]]},
      {"id": "ingreso", "tipo": "via", "nombre": "Ingreso", "puntos": [[580, 747], [626, 747], [622, 868], [594, 868]]},
      {"id": "rotonda-izquierda", "tipo": "rotonda", "nombre": "Rotonda", "cx": 884, "cy": 100, "rx": 36, "ry": 26},
      {"id": "rotonda-derecha", "tipo": "rotonda", "nombre": "Rotonda", "cx": 1404, "cy": 82, "rx": 35, "ry": 24},
      {"id": "lote-01", "tipo": "lote", "numero": "01", "estado": "no_disponible", "area": "933.21", "perimetro": "148.92", "puntos": [[59, 799], [16, 858], [352, 858], [389, 796]]},
      {"id": "lote-02", "tipo": "lote", "numero": "02", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[392, 714], [116, 718], [62, 795], [336, 789]]},
      {"id": "lote-03", "tipo": "lote", "numero": "03", "estado": "disponible", "area": "896.20", "perimetro": "138.29", "precio": 40000, "precioBase": 37000, "responsable": "Freddy", "medidas": "47.83 · 20.86 · 47.85 · 21.75 ml", "puntos": [[119, 714], [399, 708], [452, 635], [176, 632]]},
      {"id": "lote-04", "tipo": "lote", "numero": "04", "estado": "vendido", "area": "898.76", "perimetro": "138.24", "puntos": [[178, 631], [455, 633], [514, 555], [233, 552]]},
      {"id": "lote-05", "tipo": "lote", "numero": "05", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[573, 476], [287, 479], [239, 546], [514, 550]]},
      {"id": "lote-06", "tipo": "lote", "numero": "06", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[626, 400], [346, 400], [294, 465], [576, 469]]},
      {"id": "lote-07", "tipo": "lote", "numero": "07", "estado": "no_disponible", "area": "902.27", "perimetro": "141.47", "puntos": [[694, 319], [396, 321], [345, 395], [636, 395]]},
      {"id": "lote-08", "tipo": "lote", "numero": "08", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[750, 240], [452, 248], [404, 318], [698, 313]]},
      {"id": "lote-09", "tipo": "lote", "numero": "09", "estado": "no_disponible", "area": "900.03", "perimetro": "145.37", "puntos": [[810, 166], [501, 173], [452, 245], [759, 236]]},
      {"id": "lote-10", "tipo": "lote", "numero": "10", "estado": "no_disponible", "area": "899.01", "perimetro": "141.88", "puntos": [[837, 89], [557, 96], [503, 171], [812, 163], [841, 127]]},
      {"id": "lote-11", "tipo": "lote", "numero": "11", "estado": "disponible", "area": "731.90", "perimetro": "138.35", "precio": 37000, "precioBase": 30000, "responsable": "Freddy", "medidas": "53.45 · 12.59 · 49.28 · 15.56 + curva ml", "puntos": [[603, 34], [559, 93], [843, 86], [846, 85], [855, 76], [864, 71], [876, 68], [887, 67], [911, 29]]},
      {"id": "lote-12", "tipo": "lote", "numero": "12", "estado": "disponible", "area": "827.38", "perimetro": "132.61", "precio": 37000, "precioBase": 32000, "responsable": "Freddy", "medidas": "43.04 · 23.60 · 37.61 + curva ml", "puntos": [[919, 28], [888, 67], [898, 69], [906, 72], [919, 80], [926, 92], [927, 100], [926, 108], [927, 109], [1144, 112], [1208, 23]]},
      {"id": "lote-13", "tipo": "lote", "numero": "13", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[927, 116], [881, 143], [837, 202], [1074, 202], [1136, 114]]},
      {"id": "lote-14", "tipo": "lote", "numero": "14", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[755, 307], [995, 306], [1067, 210], [831, 206]]},
      {"id": "lote-15", "tipo": "lote", "numero": "15", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[987, 313], [749, 316], [685, 408], [918, 409]]},
      {"id": "lote-16", "tipo": "lote", "numero": "16", "estado": "disponible", "area": "1000", "perimetro": "150", "precio": 45000, "precioBase": 40000, "responsable": "Freddy", "puntos": [[913, 416], [676, 416], [601, 515], [839, 511]]},
      {"id": "lote-17", "tipo": "lote", "numero": "17", "estado": "disponible", "area": "1000", "perimetro": "150", "precio": 45000, "precioBase": 40000, "responsable": "Freddy", "puntos": [[835, 518], [595, 522], [526, 616], [765, 613]]},
      {"id": "lote-18", "tipo": "lote", "numero": "18", "estado": "disponible", "area": "1000", "perimetro": "150", "precio": 45000, "precioBase": 40000, "responsable": "Freddy", "puntos": [[758, 621], [520, 622], [446, 717], [684, 712]]},
      {"id": "lote-19", "tipo": "lote", "numero": "19", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[987, 597], [784, 597], [697, 711], [905, 707]]},
      {"id": "lote-20", "tipo": "lote", "numero": "20", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[1082, 478], [875, 478], [791, 587], [992, 591]]},
      {"id": "lote-21", "tipo": "lote", "numero": "21", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[1169, 360], [961, 360], [878, 472], [1084, 473]]},
      {"id": "lote-22", "tipo": "lote", "numero": "22", "estado": "no_disponible", "area": "", "perimetro": "", "nota": "En el plano original figuraba como SEPARADO.", "puntos": [[1258, 241], [1048, 240], [968, 354], [1174, 353]]},
      {"id": "lote-23", "tipo": "lote", "numero": "23", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[1300, 185], [1093, 185], [1058, 237], [1262, 237]]},
      {"id": "lote-24", "tipo": "lote", "numero": "24", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[1343, 128], [1139, 128], [1099, 177], [1304, 177]]},
      {"id": "lote-25", "tipo": "lote", "numero": "25", "estado": "no_disponible", "area": "866.53", "perimetro": "133.32", "puntos": [[1211, 23], [1141, 122], [1351, 122], [1369, 99], [1364, 91], [1362, 84], [1363, 76], [1367, 67], [1373, 61], [1382, 55], [1394, 52], [1405, 51], [1430, 19]]},
      {"id": "lote-26", "tipo": "lote", "numero": "26", "estado": "no_disponible", "area": "780.91", "perimetro": "135.56", "puntos": [[1437, 17], [1410, 51], [1424, 55], [1435, 61], [1443, 70], [1446, 82], [1448, 83], [1696, 78], [1744, 14]]},
      {"id": "lote-27", "tipo": "lote", "numero": "27", "estado": "disponible", "area": "976.12", "perimetro": "142.59", "precio": 40000, "precioBase": 37000, "responsable": "Freddy", "medidas": "44.25 · 24.34 · 46.99 · 16.42 + curva ml", "puntos": [[1448, 88], [1438, 100], [1431, 106], [1364, 176], [1634, 170], [1696, 82]]},
      {"id": "lote-28", "tipo": "lote", "numero": "28", "estado": "disponible", "area": "971.10", "perimetro": "142.02", "precio": 40000, "precioBase": 37000, "responsable": "Freddy", "medidas": "46.99 · 23.60 · 47.63 · 23.60 ml", "puntos": [[1631, 174], [1359, 181], [1296, 266], [1570, 260]]},
      {"id": "lote-29", "tipo": "lote", "numero": "29", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[1560, 265], [1296, 269], [1233, 350], [1504, 346]]},
      {"id": "lote-30", "tipo": "lote", "numero": "30", "estado": "disponible", "area": "961.17", "perimetro": "142.48", "precio": 40000, "precioBase": 37000, "responsable": "Freddy", "medidas": "48.26 · 22.90 · 48.66 · 22.66 ml", "puntos": [[1503, 353], [1225, 357], [1165, 439], [1441, 436]]},
      {"id": "lote-31", "tipo": "lote", "numero": "31", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[1440, 444], [1166, 445], [1109, 518], [1384, 518]]},
      {"id": "lote-32", "tipo": "lote", "numero": "32", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[1381, 526], [1097, 528], [1047, 603], [1324, 603]]},
      {"id": "lote-33", "tipo": "lote", "numero": "33", "estado": "vendido", "area": "949.11", "perimetro": "143.90", "puntos": [[1321, 609], [1037, 608], [975, 687], [1267, 685]]},
      {"id": "lote-34", "tipo": "lote", "numero": "34", "estado": "disponible", "area": "945.30", "perimetro": "144.34", "precio": 40000, "precioBase": 37000, "responsable": "Freddy", "medidas": "50.64 · 21.17 · 51.20 · 21.32 ml", "puntos": [[1264, 690], [971, 690], [913, 769], [1209, 766]]},
      {"id": "lote-35", "tipo": "lote", "numero": "35", "estado": "vendido", "area": "", "perimetro": "", "puntos": [[1205, 773], [910, 772], [853, 853], [1145, 851]]},
      {"id": "lote-36", "tipo": "lote", "numero": "36", "estado": "vendido", "area": "", "perimetro": "", "nota": "Número provisional: en el plano original este lote no muestra número.", "giroEtiqueta": -90, "puntos": [[770, 754], [770, 857], [840, 857], [879, 800], [842, 753]]},
      {"id": "texto-paso", "tipo": "texto", "texto": "ÁREA DE PASO", "x": 648, "y": 737, "tam": 13, "color": "#4a4420"},
      {"id": "texto-carretera", "tipo": "texto", "texto": "CARRETERA CHINCHA – EL CARMEN", "x": 877, "y": 892, "tam": 15, "color": "#f5f5ef"}
    ]
  }
];
