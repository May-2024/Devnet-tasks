data = [
    {'id': 1, 'ubication': 'Camion 201', 'device': 'Cisco AP', 'client': '10.117.115.201', 'last_mac': '2c5a.0f10.c5ca', 'current_mac': 'd7j1.0l2d.2d6g', 'note': 'No data', 'last_change_date': 'No data'},
    {'id': 2, 'ubication': 'Camion 201', 'device': 'Cisco RO', 'client': '10.117.116.201', 'last_mac': '0027.e3c7.5600', 'current_mac': '0027.e3c7.5600', 'note': 'No data', 'last_change_date': 'No data'},
    {'id': 3, 'ubication': 'Camion 201', 'device': 'Dispatch', 'client': '10.117.123.201', 'last_mac': '0080.0701.12d8', 'current_mac': '0080.0701.12d8', 'note': 'No data', 'last_change_date': 'No data'},
    {'id': 4, 'ubication': 'Camion 202', 'device': 'MEM', 'client': '10.117.122.201', 'last_mac': '0013.952d.2d05', 'current_mac': '0013.952d.2d05', 'note': 'No data', 'last_change_date': 'No data'},
    {'id': 5, 'ubication': 'Camion 202', 'device': 'MEM', 'client': '10.117.122.201', 'last_mac': '9913.955d.32d7', 'current_mac': '0027.e3c7.5600', 'note': 'No data', 'last_change_date': 'No data'},
    {'id': 6, 'ubication': 'Camion 203', 'device': 'MEM', 'client': '10.117.122.201', 'last_mac': 'd7j1.0l2d.2d6g', 'current_mac': 'd7j1.0l2d.2d6g', 'note': 'No data', 'last_change_date': 'No data'},
    {'id': 7, 'ubication': 'Camion 204', 'device': 'MEM', 'client': '10.117.122.201', 'last_mac': 'd7j1.0l2d.2d6g', 'current_mac': 'No data', 'note': 'No data', 'last_change_date': 'No data'},
    {'id':8, 'ubication': 'Camion 205', 'device': 'MEM', 'client': '10.117.122.201', 'last_mac': 'd7j1.0l2d.2d6g', 'current_mac': 'No data', 'note': 'No data', 'last_change_date': 'No data'},
]


def check_mac(data):
    result = {}

    # Construir el diccionario result
    for item in data:
        ubication = item['ubication']
        current_mac = item['current_mac']
        if ubication in result:
            if current_mac != 'No data':
                result[ubication].append(current_mac)
        else:
            result[ubication] = [current_mac]

    # Lista para almacenar los elementos repetidos
    repeated_elements = []

    # Validar repeticiones
    for ubication, mac_list in result.items():
        for mac in mac_list:
            if mac != 'No data':
                for other_ubication, other_mac_list in result.items():
                    if ubication != other_ubication:
                        if mac in other_mac_list and mac not in repeated_elements:
                            repeated_elements.append(mac)

    print("Elementos repetidos:", repeated_elements)

check_mac(data)