function clasifyGroupPrtg(data) {
    let result = {};

    // Iterar sobre el array
    data.forEach(obj => {
        // Verificar si ya existe una clave para este dispositivo
        if (result[obj.device]) {
            // Si existe, agregar este objeto al array existente
            result[obj.device].push(obj);
        } else {
            // Si no existe, crear un nuevo array con este objeto
            result[obj.device] = [obj];
        }
    });

    return result;
}

// Ejemplo de uso
let a = [
    { device: "device1", data: "texto1" },
    { device: "device2", data: "texto2" },
    { device: "device1", data: "texto3" }
];

let b = clasifyGroupPrtg(a);
console.log(b);
