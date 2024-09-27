import os
import time
import traceback
import sched
import logging
import logger_config

from dotenv import load_dotenv
from mesh_data import get_mesh_process_data
from status_prtg import status_prtg
from command_mac_detail import run_mac_detail
from validate_status import validate_status

from db_get_data import get_data
from update_current_mac import update_mac, check_ip_in_output
from db_update_devnet import update_devnet_data, datetime_register

load_dotenv()
env = os.getenv("ENVIRONMENT")



def main():
    try:
        logging.info("##### Iniciando ciclo")
        
        # Obtenemos los datos actuales de la BD
        last_data = get_data(table_name="mesh_process")

        # Obtenemos los datos actuales de la controladora
        logging.info("##### Obteniendo informacion del comando show ip arp | in Vlan112")
        current_data = get_mesh_process_data()

        # Si no hay datos desde la maquina manejamos esto como un error
        if current_data == []:
            raise ValueError("##### No se obtuvieron datos del comando `show ip arp | in Vlan112`")

        # Actualizamos los valores de la MAC si es necesario
        logging.info("##### Actualizando valores de MAC actual y pasado")
        data_updated = update_mac(last_data, current_data)

        # Validamos si la ip del cliente esta en el output del comando
        logging.info("##### Asignando estado Not Found a aquellas IP que no esten en el comando show up arp")
        notFound_data_updated = check_ip_in_output(data_updated, current_data)

        mesh_clients_updated = notFound_data_updated
  
        cisco_ap_list = [ e for e in mesh_clients_updated if e["device"] == "Cisco AP"]
        logging.info("##### Extrayendo listado de MAC de cada cliente para cada Cisco AP")   
        data_command_mac_detail = run_mac_detail(cisco_ap_list)
        
        logging.info("##### Validando si algun cliente esta asignado en un AP incorrecto")
        status_clients_list = validate_status(mesh_clients_updated, data_command_mac_detail)
        
        for client in status_clients_list:
            if client["device"] != "Cisco AP":
                client["status"] = "N/A"
                client["status_num_clients"] = "N/A"
                

        # Funcion para actualizar el estado y id de PRTG
        logging.info("##### Obteniendo estados PRTG y Operativo de cada Pala")
        final_updated_data = status_prtg(status_clients_list)

        db_response = update_devnet_data(final_updated_data)
        
        if db_response:
            datetime_register(status="OK", system_name="mesh_process")
        else:
            datetime_register(status="ERROR", system_name="mesh_process")
        
        logging.info("##### Ciclo Terminado")

    except Exception as e:
        logging.error(e)
        logging.error(traceback.format_exc())
        logging.error("Error en funcion Main")
        datetime_register(status="ERROR", system_name="mesh_process")


def bucle(scheduler):
    main()
    scheduler.enter(900, 1, bucle, (scheduler,))


if __name__ == "__main__":
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()
