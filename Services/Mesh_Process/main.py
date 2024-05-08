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
from check_mac import check_mac


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
        # query = "SELECT * FROM dcs.mesh_process"
        # cursor.execute(query)
        
        # Convertimos los datos Antiguos en una lista de diccionarios
        # column_names = [column[0] for column in cursor.description]
        # last_data = []
        # for row in cursor:
        #     row_dict = {}
        #     for i in range(len(column_names)):
        #         row_dict[column_names[i]] = row[i]
        #     last_data.append(row_dict)
        
        # Obtenemos los datos actuales
        # current_data = get_mesh_process_data()
        # print(f"de la base de datos: {last_data}")
        # print(f"de la controladora: {current_data}")

        #! db_data_test
        last_data = [{'id': 1, 'ubication': 'Camion 201', 'device': 'Cisco AP', 'client': '10.117.115.201', 'last_mac': '1A', 'current_mac': 'CurrentMacVieja', 'note': 'No data', 'last_change_date': 'No data', 'status': 'ok'}, {'id': 2, 'ubication': 'Camion 201', 'device': 'Cisco RO', 'client': '10.117.116.201', 'last_mac': '0027.e3c7.5600', 'current_mac': '0027.e3c7.5600', 'note': 'No data', 'last_change_date': 'No data', 'status': 'ok'}, {'id': 3, 'ubication': 'Camion 201', 'device': 'Dispatch', 'client': '10.117.123.201', 'last_mac': '0080.0701.12d8', 'current_mac': '0080.0701.12d8', 'note': 'No data', 'last_change_date': 'No data', 'status': 'ok'}]
        
        #! controladora_data_test
        current_data = [{'ip': '10.117.115.201', 'mac': 'NuevaMac'}, {'ip': '10.117.116.24', 'mac': 'cc90.70c1.7480'}, {'ip': '10.117.126.21', 'mac': 'accc.8ed0.1d6b'}]
        
        # Si no hay datos desde la maquina manejamos esto como un error
        if current_data == []:
            return "a" #! Manejar el caso en que no lleguen datos
        
        # Actualizamos el Mac Anterior con el valor del Mac Actual solo si
        # la Mac actual de la ultima consulta y la mac actual de la consulta mas reciente
        # son diferentes
        for last in last_data:
            for current in current_data:
                if last['client'] == current['ip'] and last['current_mac'] != current["mac"]:
                    print("Entro al If de actualizar la mac anterior")
                    query_mac = f"UPDATE dcs.mesh_process SET last_mac = '{last['current_mac']}' WHERE client = '{last['client']}'"
                    cursor.execute(query_mac)
                    mydb.commit()
            
        # Actualizamos el valor de la Mac Actual     
        for current in current_data:
            client = current['ip']
            current_mac = current['mac']
            for last in last_data:
                if last['client'] == client and last['current_mac'] != current_mac:
                    now = datetime.datetime.now()
                    fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
                    fecha_y_hora = str(fecha_y_hora)
                    query_mac = f"UPDATE dcs.mesh_process SET current_mac = '{current_mac}', last_change_date = '{fecha_y_hora}' WHERE client = '{client}'"
                    cursor.execute(query_mac)
                    mydb.commit()
                    break
                
        query = "SELECT * FROM dcs.mesh_process"
        cursor.execute(query)
        
        # Obtenemos la lista con los datos de los diccionarios actualizados
        column_names = [column[0] for column in cursor.description]
        data_updated = []
        for row in cursor:
            row_dict = {}
            for i in range(len(column_names)):
                row_dict[column_names[i]] = row[i]
            data_updated.append(row_dict)
            
        # Validamos que los elementos no se repitan
        repeated_mac = check_mac(data_updated)
        
        for item in data_updated:
            item['status'] = 'ok'  # Establece el estado inicial a 'ok'
            if item['current_mac'] in repeated_mac:
                item['status'] = 'fail'  # Cambia el estado a 'fail' si el elemento está repetido
                
        for data in data_updated:
            if data['client'] != '10.117.126.100':
                status = data['status']
                query_mac = f"UPDATE dcs.mesh_process SET status = '{status}' WHERE client = '{data['client']}'"
                cursor.execute(query_mac)
                mydb.commit()        
                
                
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        
        cursor.execute(
            f"UPDATE dcs.fechas_consultas_mesh_process SET `ultima_consulta` = '{fecha_y_hora}' WHERE `id` = 1"
        )
        mydb.commit()
        cursor.close()
        logging.info("Ciclo Terminado")
        
    except Exception as e:
        logging.error("Error en funcion Main")
        logging.error(e)
        logging.error(traceback.format_exc())
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(
            f"UPDATE dcs.fechas_consultas_mesh_process SET `ultima_consulta` = '{fecha_y_hora}', `estado` = 'ERROR' WHERE `id` = 1"
        )
        mydb.commit()
        cursor.close()
        return "Error"
    
# def bucle(scheduler):
#     main()
#     scheduler.enter(43000, 1, bucle, (scheduler,))

# if __name__ == "__main__":
#     s = sched.scheduler(time.time, time.sleep)
#     s.enter(0, 1, bucle, (s,))
#     s.run()
    
main()