import traceback
import logging
from db_connections import devnet_connection
from datetime import datetime


def update_devnet_data(data):

    # Consulta SQL para actualizar los datos donde el valor de la columna 'ip' coincida
    query = """
    UPDATE dcs.candelaria_clients SET 
        status_prtg = %s,
        lastup_prtg = %s,
        lastdown_prtg = %s
        device_ip_cisco = %s,
        device_cisco = %s,
        port_cisco = %s,
        status_cisco = %s,
        reachability_cisco = %s,
        id_prtg = %s,
        status_device_cisco = %s
        data_backup = %s
    WHERE ip = %s
    """

    data_tuple = [
        (
            client["status_prtg"],
            client["lastup_prtg"],
            client["lastdown_prtg"],
            client["device_ip_cisco"],
            client["device_cisco"],
            client["port_cisco"],
            client["status_cisco"],
            client["reachability_cisco"],
            client["id_prtg"],
            client["status_device_cisco"],
            client["data_backup"],
        )
        for client in data
    ]

    try:

        db_connector = devnet_connection()
        devnet_cursor = db_connector.cursor()

        devnet_cursor.executemany(query, data_tuple)
        db_connector.commit()

        db_connector.close()

    except Exception as e:
        logging.error(traceback.format_exc())
        logging.error(
            "Error en la función `update_devnet_data` en el archivo `db_update_devnet`"
        )
        logging.error(e)


def datetime_register(status):
    now = datetime.now()
    now_datetime = now.strftime("%Y-%m-%d %H:%M:%S")
    now_datetime = str(now_datetime)

    query = f"""
    UPDATE dcs.datetime_systems SET 
    status = '{status}', 
    datetime = '{now_datetime}' 
    WHERE system_name = 'candelaria_clients'
    """

    try:

        db_connector = devnet_connection()
        devnet_cursor = db_connector.cursor()

        devnet_cursor.execute(query)
        db_connector.commit()

        db_connector.close()

    except Exception as e:
        logging.error(traceback.format_exc())
        logging.error(
            "Error en la función `datetime_register` en el archivo `db_update_devnet`"
        )
        logging.error(e)
