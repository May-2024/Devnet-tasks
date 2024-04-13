import warnings
import requests
import os
import time
import traceback
import datetime
import sched 
import re
import logging
import mysql.connector
import paramiko
from dotenv import load_dotenv
from config import database
from mesh_data import get_mesh_process_data


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s: %(message)s")
file_handler = logging.FileHandler("issues.log")
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s: %(message)s"))
logging.getLogger().addHandler(file_handler)

load_dotenv()
env = os.getenv('ENVIRONMENT')

def database_connection():
    try:
        if env == 'local':
            mydb = mysql.connector.connect(
            host=database['local']['DB_HOST'],
            user=database['local']['DB_USER'],
            password=database['local']['DB_PASSWORD'],
            database=database['local']['DB_DATABASE']
            )

        else:
            mydb = mysql.connector.connect(
            host=database['production']['DB_HOST'],
            user=database['production']['DB_USER'],
            password=database['production']['DB_PASSWORD'],
            database=database['production']['DB_DATABASE']
            )
        return mydb

    except Exception as e:
        logging.error("Error al conectarse a la base de datos")
        logging.error(traceback.format_exc())
        logging.error(e)
        
def main():
    try:
        mydb = database_connection()
        cursor = mydb.cursor()
        query = "SELECT * FROM dcs.mesh_process"
        cursor.execute(query)
        
        # Convertimos los datos Antiguos en una lista de diccionarios
        column_names = [column[0] for column in cursor.description]
        last_data = []
        for row in cursor:
            row_dict = {}
            for i in range(len(column_names)):
                row_dict[column_names[i]] = row[i]
            last_data.append(row_dict)

        # Obtenemos los datos actuales
        current_data = get_mesh_process_data()

        # Si no hay datos desde la maquina manejamos esto como un error
        if current_data == []:
            return "a" #! Manejar el caso en que no lleguen datos
        
        # Actualizamos el Mac Anterior con el valor del Mac Actual
        for data in last_data:
            client = data['client']
            current_mac = data['current_mac']
            query_mac = f"UPDATE dcs.mesh_process SET last_mac = '{current_mac}' WHERE client = '{client}'"
            cursor.execute(query_mac)
            mydb.commit()
        
        # Actualizamos el Mac Actual con el valor del Mac Actual    
        for data in current_data:
            client = data['ip']
            current_mac = data['mac']
            query_mac = f"UPDATE dcs.mesh_process SET current_mac = '{current_mac}' WHERE client = '{client}'"
            cursor.execute(query_mac)
            mydb.commit()
            
        cursor.close()
            
    except Exception as e:
        logging.error("Error en funcion Main")
        logging.error(e)
        logging.error(traceback.format_exc())
        return "Error"
    
main()