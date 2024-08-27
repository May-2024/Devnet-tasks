import traceback
import logging
from db_connections import devnet_connection
from datetime import datetime


def update_devnet_data(data):

    # Consulta SQL para actualizar los datos donde el valor de la columna 'ip' coincida
    query = """
    UPDATE dcs.ups SET 
        name = %s,
        status_prtg = %s,
        status_ups = %s,
        batery = %s,
        id_ups = %s,
        uptime = %s,
        ubication = %s
    WHERE ip = %s
    """

    data_tuple = [
        (
            ups["name"],
            ups["status_prtg"],
            ups["status_ups"],
            ups["batery"],
            ups["id_ups"],
            ups["uptime"],
            ups["ubication"],
            ups["ip"],  # Esto es lo que se utiliza para encontrar la fila a actualizar
        )
        for ups in data
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
    WHERE system_name = 'ups'
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
