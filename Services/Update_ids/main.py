import warnings, requests, os, time, traceback, datetime, sched
import mysql.connector
from dotenv import load_dotenv
from config import database

# Esto evita que las respuestas de las API tengan warnings.
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

def update_clients():

    load_dotenv()
    env = os.getenv('ENVIRONMENT')
    
    if env == 'local':
        mydb = mysql.connector.connect(
        host=database['local']['DB_HOST'],
        user=database['local']['DB_USER'],
        password=database['local']['DB_PASSWORD'],
        database=database['local']['DB_DATABASE']
        )
        
    if env == 'production':
        mydb = mysql.connector.connect(
        host=database['production']['DB_HOST'],
        user=database['production']['DB_USER'],
        password=database['production']['DB_PASSWORD'],
        database=database['production']['DB_DATABASE']
        )
        
    cursor = mydb.cursor()

    # Realizar una consulta para leer información de la base de datos
    query = "SELECT * FROM dcs.data_clients"
    cursor.execute(query)

    # Obtener los nombres de las columnas
    column_names = [column[0] for column in cursor.description]

    # Convertir los resultados a una lista de diccionarios
    clients = []
    for row in cursor:
        row_dict = {}
        for i in range(len(column_names)):
            row_dict[column_names[i]] = row[i]
        clients.append(row_dict)

    try:        
        for element in clients:
            ip = element['ip']
            print(ip)

            #Bloque de consulta API PRTG
            url_prtg_ip = os.getenv('URL_PRTG_IP').format(ip=ip)
            prtg_response = requests.get(url_prtg_ip, verify=False).json()
            if len(prtg_response['devices']) == 0:
                cursor.execute(f"UPDATE dcs.data_clients SET id_prtg = 'Not Found' WHERE ip = '{ip}'")
                mydb.commit()
            else:
                id_prtg = prtg_response['devices'][0]['objid']
                cursor.execute(f"UPDATE dcs.data_clients SET id_prtg = '{id_prtg}' WHERE ip = '{ip}'")
                mydb.commit()

            #Bloque de consulta API CISCO PRIME
            url_cisco_id = os.getenv('URL_CISCO_IP').format(ip=ip)
            cisco_response = requests.get(url_cisco_id, verify=False).json()
            if cisco_response['queryResponse']['@count'] == 0:
                cursor.execute(f"UPDATE dcs.data_clients SET id_cisco = 'Not Found' WHERE ip = '{ip}'")
                mydb.commit()
            else:
                cisco_id = cisco_response['queryResponse']['entityId'][0]['$']
                cursor.execute(f"UPDATE dcs.data_clients SET id_cisco = '{cisco_id}' WHERE ip = '{ip}'")
                mydb.commit()
            
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
            
        with open("/app/logs.txt", "a") as archivo:
        # with open("/home/donkami/Sona/APIS/DCS-Candelaria/Services/Update_ids/actualizacion_ids.txt", "a") as archivo:
            archivo.write(str(fecha_y_hora) + '\n')

    except Exception:
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        print(traceback.format_exc())
        with open("/app/logs.txt", "a") as archivo:
        # with open("/home/donkami/Sona/APIS/DCS-Candelaria/Services/Update_ids/actualizacion_ids.txt", "a") as archivo:
            archivo.write('Fecha y hora del error: ' + str(fecha_y_hora) + ' Dispositivo del error ---> ' + ip + '\n')
            archivo.write(traceback.format_exc())
            archivo.write("\n")
            
    
def bucle(scheduler):
    update_clients()
    scheduler.enter(86400, 1, bucle, (scheduler,))

if __name__ == '__main__':
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()