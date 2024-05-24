import logging
import mysql.connector
import traceback
import os
from config import database
from dotenv import load_dotenv

load_dotenv()
env = os.getenv("ENVIRONMENT")


def database_connection():
    try:
        if env == "local":
            mydb = mysql.connector.connect(
                host=database["local"]["DB_HOST"],
                user=database["local"]["DB_USER"],
                password=database["local"]["DB_PASSWORD"],
                database=database["local"]["DB_DATABASE"],
            )
        else:
            mydb = mysql.connector.connect(
                host=database["production"]["DB_HOST"],
                user=database["production"]["DB_USER"],
                password=database["production"]["DB_PASSWORD"],
                database=database["production"]["DB_DATABASE"],
            )
        print("exito")
        return mydb
    except Exception as e:
        logging.error("Error al conectarse a la base de datos")
        logging.error(traceback.format_exc())
        logging.error(e)


mydb = database_connection()


def get_actility_data(ap_name):
    try:
        logging.info(f"Nombre del AP: {ap_name}")
        cursor = mydb.cursor()
        query = f"SELECT * FROM dcs.data_mesh_actility WHERE name = '{ap_name}'"
        cursor.execute(query)
        
        # Lee todas las filas para asegurarse de que no queden resultados sin leer
        rows = cursor.fetchall()
        if not rows:
            mydb.commit()
            return 99.999, 99.999
        
        # Usa la primera fila
        row = rows[0]
        column_names = [column[0] for column in cursor.description]

        device = {column_names[i]: row[i] for i in range(len(column_names))}

        mydb.commit()
        cursor.close()  # Cierra el cursor después de usarlo

        if device['latitude'] == 0.0 or device['longitude'] == 0.0:
            latitude = 99.999
            longitude = 99.999
            return latitude, longitude

        return device['latitude'], device['longitude']

    except Exception as e:
        logging.error(f"Error funcion `get_actility_data`: {e}")
        return 99.999, 99.999


# # Ejemplo de uso
# ap_name = "CAN-RAPRW-3"
# latitude, longitude = get_actility_data(ap_name)
# print(f"Latitud: {latitude}, Longitud: {longitude}")
