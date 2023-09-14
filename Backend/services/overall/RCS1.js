// RCS 1 = Red Cliente Servidor 1

function getRedClienteServidor_1(allDownClients) {
  let puntos_a_restar = 0;
  const claves_set = new Set();

  for (const cliente of allDownClients) {
    const clave = cliente["clave"];
    claves_set.add(clave);
  }

  const list_claves = Array.from(claves_set);

  // Create a dictionary for each key in list_claves
  const kpi1 = {};
  for (const clave of list_claves) {
    if ((clave > 100 && clave < 200) || clave === 1 || clave === 2) {
      kpi1[clave] = [];
    }
  }

  // Add elements to each corresponding list in the kpi1 dictionary
  for (const cliente of allDownClients) {
    if (
      cliente["clave"] in kpi1 &&
      (cliente["group"] === "CSP" || cliente["group"] === "CSS")
    ) {
      kpi1[cliente["clave"]].push(cliente);
    }
  }

  for (const [clave, cliente_por_clave] of Object.entries(kpi1)) {
    // If there are no elements other than HIGH 'todos_alta' will be True
    let todos_alta = true;
    for (const cliente of cliente_por_clave) {
      if (cliente["importancia"] != "ALTA") {
        todos_alta = false;
        break;
      }
    }
    if (todos_alta && cliente_por_clave.length === 4) {
      puntos_a_restar += 4;
    }
  }

  for (const [clave, cliente_por_clave] of Object.entries(kpi1)) {
    // If there are no elements other than MEDIUM 'todos_media' will be True
    let todos_media = true;
    for (const cliente of cliente_por_clave) {
      if (cliente["importancia"] != "MEDIA") {
        todos_media = false;
        break;
      }
    }
    if (todos_media && cliente_por_clave.length === 4) {
      puntos_a_restar += 2;
    }
  }

  for (const [clave, cliente_por_clave] of Object.entries(kpi1)) {
    // If there are no elements other than LOW 'todos_baja' will be True
    let todos_baja = true;
    for (const cliente of cliente_por_clave) {
      if (cliente["importancia"] != "BAJA") {
        todos_baja = false;
        break;
      }
    }
    if (todos_baja && cliente_por_clave.length === 4) {
      puntos_a_restar += 0.2;
    }
  }

  return puntos_a_restar;
}

module.exports = { getRedClienteServidor_1 };
