import requests
import os
import datetime
import time
import calendar
import logging
import traceback
import sched
import logger_config

def get_data_interfaces(data_anillo):
    # Se obtienen los ID de cada Nodo del Anillo
    # Despues para cada Nodo se consultan el grupo de interfaces relacionado
    # Y se almacena cada interfaz en la lista `data_interfaces`
    try:
        data_interfaces = [] 
        for element in data_anillo:
            ip_node = element['ip']
            logging.info(ip_node)
            get_id_url = os.getenv("URL_PRTG_GET_ID_WITH_IP").format(ip=ip_node)
            response_get_id_url = requests.get(get_id_url, verify=False).json()
            if response_get_id_url["devices"] == []:
                break
            
            id_node = response_get_id_url["devices"][0]
            id_node = id_node['objid']
            url_interfaces = os.getenv("URL_PRTG_GET_STATUS_INTERFACES").format(id_sensor=id_node)
            response_interfaces = requests.get(url_interfaces, verify=False).json()
            interfaces = response_interfaces.get("sensors")
            for interface in interfaces:
                data_interfaces.append(interface)
        

        return data_interfaces


    except Exception as e:
        logging.error(f"Error - Funcion get_data_interfaces")
        logging.error(e)
        logging.error(traceback.format_exc())