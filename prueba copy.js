function countStatus(data) {
    const result = data.reduce((acc, curr) => {
        // Si el grupo es "certificados candelaria", omitir el dispositivo
        if (curr.group && curr.group.toLowerCase() === "certificados candelaria") {
            return acc;
        }

        const existingItem = acc.find(item => item.device === curr.device);
        if (existingItem) {
            if (curr.status === "Up") {
                existingItem.up++;
            } else if (curr.status === "Down") {
                existingItem.down++;
            }
        } else {
            const newItem = {
                device: curr.device,
                group: curr.group,
                up: curr.status === "Up" ? 1 : 0,
                down: curr.status === "Down" ? 1 : 0
            };
            acc.push(newItem);
        }
        return acc;
    }, []);

    return result;
}

const data = [
    { device: "device1", status: "Up", group: "Certificados Candelaria" },
    { device: "device2", status: "Down", group: "Candelaria" },
    { device: "device1", status: "Down", group: "Candelaria" }
];

const result = countStatus(data);
console.log(result);
