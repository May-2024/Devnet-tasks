import time
import traceback
import sched
import logging
import logger_config
from dotenv import load_dotenv
from ups import define_ups_status
from db_get_data import get_data
from api_cctv import get_cctv_data, set_cctv_status
from api_prtg import get_prtg_data
from api_cisco import get_cisco_data
from db_insert_historic import save_historic_data
from db_update_devnet import update_devnet_data, datetime_register


def get_devices_data():
    try:
        load_dotenv()

        # Obtenemos la informacion actual de los dispositivos de la BD DevNet
        devices = get_data(table_name="devices")

        # Obtenemos la informacion actual de los servidores CCTV
        cctv_data = get_cctv_data()

        final_data = []
        counter = 1
        for device in devices:
            ip = device["host"]
            logging.info(f"Dispositivo # {counter} de {len(devices)} en actualizacion ({ip}) ")
            counter = counter + 1
            type = device["type"]
            red = device["red"]

            # Obtenemos la informacion actual de la API de PRTG
            prtg_data = get_prtg_data(ip)
            device.update(prtg_data)

            # Obtenemos la informacion actual de la API de CISCO
            cisco_data = get_cisco_data(red, ip)
            device.update(cisco_data)

            # Inicializamos estados de CCTV
            cctv_status = {"cctv_enabled": "N/A", "cctv_valid": "N/A"}

            # Si el tipo de dispositivo es camara buscamos la IP de esta 
            # en el listado obtenido de la API de CCTV
            # Si no lo encuentra enabled y valid son Not Found
            if type == "Camara" or type == "Cámara":
                cctv_status = set_cctv_status(ip, cctv_data)
            device.update(cctv_status)

            # Finalmente actualizamos el estado de las UPS para cada dispositivo
            device["ups_status"] = define_ups_status(device["cisco_device_name"])

            final_data.append(device)

        devnet_bd_response = update_devnet_data(final_data)
        historic_bd_response = save_historic_data(final_data)

        if devnet_bd_response is True and historic_bd_response is True:
            datetime_register(system_name="devices", status="OK")
        else:
            datetime_register(system_name="devices", status="ERROR")

        logging.info("Ciclo finalizado con Exito!")


    except Exception as e:
        datetime_register(system_name="devices", status="ERROR")
        logging.error(traceback.format_exc())
        logging.error(e)
        logging.error(
            "Error en la función `main` en el archivo `main`"
        )
        logging.error(ip)


def bucle(scheduler):
    get_devices_data()
    scheduler.enter(300, 1, bucle, (scheduler,))


if __name__ == "__main__":
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()
