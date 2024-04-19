interfaces_description = [{'name_switch': 'SW CORE ADMIN', 'interface': 'Fa1', 'descrip': 'Prueba de descrip'}, {'name_switch': 'SW CORE ADMIN', 'interface': 'Te1/1', 'descrip': 'CANBUSSW002-CORE-Te1/1'}, {'name_switch': 'SW CORE ADMIN', 'interface': 'Te1/2', 'descrip': 'CANBUSSW002-CORE-Te1/2'}, {'name_switch': 'SW CORE ADMIN', 'interface': 'Te1/3', 'descrip': 'CNX-CDBUSDATACENTER-1 L2'}, {'name_switch': 'SW CORE ADMIN', 'interface': 'Te1/4', 'descrip': 'ASA FIREWALL INTERNET'}, {'name_switch': 'SW CORE ADMIN', 'interface': 'Te1/5', 'descrip': 'ASA FIREPOWER'}, {'name_switch': 'SW CORE ADMIN', 'interface': 'Te1/6', 'descrip': 'CORE_ADMIN TO DIST_CONC'}, {'name_switch': 'SW CORE ADMIN', 'interface': 'Te1/7', 'descrip': 'CANBUSSW001-SERV-DIST'}, {'name_switch': 'SW CORE ADMIN', 'interface': 'Te1/8', 'descrip': 'CANBUSSW001-OPER-DIST'}, {'name_switch': 'SW CORE ADMIN', 'interface': 'Te1/9', 'descrip': 'CANBUSSW001-T_SHOP-DIST'}, {'name_switch': 'SW CORE ADMIN', 'interface': 'Te1/10', 'descrip': 'CDBUSSDCENTER_1'}, {'name_switch': 'SW CORE ADMIN', 'interface': 'Te1/11', 'descrip': 'CANBUSSW003-OOB'}, {'name_switch': 'SW CORE ADMIN', 'interface': 'Te1/12', 'descrip': 'FIREWALL-OT'}]
status_data_neighbors = [{'ip_neighbor': '10.224.126.89', 'neighbor': 'bgp', 'red': 'it', 'name_switch': 'SW CORE ADMIN', 'ip_switch': '10.224.127.1', 'interface': 'Fa1', 'status': 'Up', 'descrip': ''}, {'ip_neighbor': '10.226.13.3', 'neighbor': 'bgp', 'red': 'it', 'name_switch': 'SW CORE ADMIN', 'ip_switch': '10.224.127.1', 'interface': 'N/A', 'status': 'Up', 'descrip': ''}, {'ip_neighbor': '10.224.125.46', 'neighbor': 'eigrp', 'red': 'it', 'name_switch': 'SW CORE ADMIN', 'ip_switch': '10.224.127.1', 'interface': 'Te2/6', 'status': 'Up', 'descrip': ''}, {'ip_neighbor': '10.224.126.82', 'neighbor': 'eigrp', 'red': 'it', 'name_switch': 'SW CORE ADMIN', 'ip_switch': '10.224.127.1', 'interface': 'Vl2408', 'status': 'Up', 'descrip': ''}]

for item in interfaces_description:
    for element in status_data_neighbors:
        print(item['name_switch'])
        print(element['name_switch'])
        print(item['interface'])
        print(element['interface'])
        if element['name_switch'] == item['name_switch'] and element['interface'] == item['interface']:
            element['descrip'] = item['descrip']
            print("ENTRO")
            break

print(status_data_neighbors)
