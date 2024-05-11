last_data = [
    {'id': 1, 'ubication': 'Camion 201', 'device': 'Cisco AP', 'client': '10.117.115.201', 'last_mac': 'B', 'current_mac': 'C', 'note': 'No data', 'last_change_date': 'No data', 'status': 'ok'}, 
    {'id': 2, 'ubication': 'Camion 201', 'device': 'Cisco RO', 'client': '10.117.116.201', 'last_mac': 'B', 'current_mac': 'No data', 'note': 'No data', 'last_change_date': 'No data', 'status': 'ok'}, 
    {'id': 3, 'ubication': 'Camion 201', 'device': 'Dispatch', 'client': '10.117.123.201', 'last_mac': 'B', 'current_mac': 'C', 'note': 'No data', 'last_change_date': 'No data', 'status': 'ok'}
]

for i, data in enumerate(last_data):
    current_mac = data['current_mac']
    if current_mac != 'No data' and current_mac != 'Not Found' and current_mac != 'b827.eb80.f108':
        for j, other_data in enumerate(last_data):
            if i != j and other_data['current_mac'] == current_mac:
                data['status'] = 'fail'
                break

print(last_data)
