import logger_config
import logging
import traceback
from db_connections import devnet_connection

def get_data(table_name):
    #* Funcion para obtener los datos actuales de las UPS
    try:
        db_connector = devnet_connection()
        
        # En caso de que la conexion a las BD falle
        if db_connector is None:
            raise ValueError("No se pudo establecer la conexión con la base de datos: el conector es None.")

        devnet_cursor = db_connector.cursor()

        # Realizar una consulta para leer información de la base de datos
        query = f"SELECT * FROM dcs.{table_name}"
        devnet_cursor.execute(query)

        # Obtener los nombres de las columnas
        column_names = [column[0] for column in devnet_cursor.description]

        # Convertir los resultados a una lista de diccionarios
        data = []
        for row in devnet_cursor:
            row_dict = {}
            for i in range(len(column_names)):
                row_dict[column_names[i]] = row[i]
            data.append(row_dict)
        db_connector.close()
        
        return data
        
    except Exception as e:
        logging.error(traceback.format_exc())
        logging.error(e)
        logging.error(f"Error al obtener datos de la base de datos")
        return None