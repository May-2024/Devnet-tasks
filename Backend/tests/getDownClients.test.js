const { getDownClients } = require('../controllers/indicators/overallKpi');

describe("allClients", () => {
  it("#1, Debe retornar solo clientes que incluyan 'Down' o 'Paused (paused)'", async () => {
    const listAllClients = [
      { clave: 1, group: "CNS", importancia: "ALTA", status_prtg: 'Down' },
      { clave: 101, group: "CNS", importancia: "ALTA", status_prtg: 'Up' },
      { clave: 240, group: "CNS", importancia: "ALTA", status_prtg: 'Down (knowdelge)' },
      { clave: 312, group: "CNS", importancia: "ALTA", status_prtg: 'Paused by parent' },
      { clave: 244, group: "CNS", importancia: "ALTA", status_prtg: 'Paused (paused)' },
    ];

    const expectedClients = [
      { clave: 1, group: "CNS", importancia: "ALTA", status_prtg: 'Down' },
      { clave: 240, group: "CNS", importancia: "ALTA", status_prtg: 'Down (knowdelge)' },
      { clave: 244, group: "CNS", importancia: "ALTA", status_prtg: 'Paused (paused)' },
    ];

    const  result = await getDownClients(listAllClients);

    expect(result).toEqual(expect.arrayContaining(expectedClients));
    expect(result.length).toBe(expectedClients.length);
  });
});
