import warnings, requests, os, time, traceback, datetime, sched
import mysql.connector
from uptime import get_uptime
from dotenv import load_dotenv
from config import database

# Esto evita que las respuestas de las API tengan warnings.
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

def ups():
    load_dotenv()
    env = os.getenv('ENVIRONMENT')
    
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
        
    cursor = mydb.cursor()

    # Realizar una consulta para leer información de la base de datos
    query = "SELECT * FROM dcs.data_ups"
    cursor.execute(query)
    
    # Obtener los nombres de las columnas
    column_names = [column[0] for column in cursor.description]

    # Convertir los resultados a una lista de diccionarios
    upsList = []
    for row in cursor:
        row_dict = {}
        for i in range(len(column_names)):
            row_dict[column_names[i]] = row[i]
        upsList.append(row_dict)
    
    try:
        for ups in upsList:
            ip = ups['ip']
            print(ip)
            ubication = ups['ubication']
            url_prtg_ip = os.getenv('URL_PRTG_IP_UPS').format(ip=ip)
            prtg_response_ip = requests.get(url_prtg_ip, verify=False).json()
            if len(prtg_response_ip['devices']) == 0:
                cursor.execute(f"INSERT INTO dcs.ups (ip, name, status_ups, batery, id_ups, uptime, ubication) VALUES ('{ip}', 'Not Found', 0, 0, 'Not Found', 0, '{ubication}')")
                mydb.commit()
                
            else:
                prtg_response_ip = prtg_response_ip['devices'][0]
                name = prtg_response_ip['device']
                id_ups = prtg_response_ip['objid']
                
                url_prtg_id = os.getenv('URL_PRTG_ID_UPS').format(id=id_ups)
                prtg_response_id = requests.get(url_prtg_id, verify=False).json()
                sensors = prtg_response_id['sensors']
                if len(sensors) == 0:
                    cursor.execute(f"INSERT INTO dcs.ups (ip, name, status_prtg, status_ups, batery, id_ups, uptime, ubication) VALUES ('{ip}', 'Not Found', 'Not Found', 0, 0, 'Not Found', 0, '{ubication}')")
                    mydb.commit()
                    
                else:
                    status_prtg = os.getenv('URL_PRTG_GET_DATA_PING_WITH_ID').format(id_ups_ping=id_ups)
                    status_prtg = requests.get(status_prtg, verify=False).json()
                    try:
                        print(status_prtg['sensors'][0]['status'])
                        status_prtg = status_prtg['sensors'][0]['status']
                    except KeyError:
                        print('Not Found')
                        status_prtg = 'Not Found'
                        
                    get_id_ping = os.getenv('URL_PRTG_UPS_PING').format(id_snmp=id_ups)
                    ping_response = requests.get(get_id_ping, verify=False).json()
                    id_ping = ping_response['sensors'][0]['objid']
                    uptime = get_uptime(id_ping)
                    
                    for sensor in sensors:
                        if 'Output Status' in sensor['sensor']:
                            status_sensor = sensor['lastvalue_raw']
                            if status_sensor == '':
                                status_sensor = 0
                            else:
                                status_sensor = int(status_sensor)
                            
                    # batery = 'Not Found'        
                    for sensor in sensors:
                        if 'Cambio Bateria' in sensor['sensor']:
                            batery = sensor['lastvalue_raw']
                            if batery == '':
                                batery = 0
                            else:
                                batery = int(batery)
                            
                    cursor.execute(f"INSERT INTO dcs.ups (ip, name, status_prtg, status_ups, batery, id_ups, uptime, ubication) VALUES ('{ip}', '{name}', '{status_prtg}', {status_sensor}, {batery}, '{id_ups}', '{uptime}', '{ubication}')")
                    mydb.commit()
                        
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(f"INSERT INTO fechas_consultas_ups (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'OK')")
        mydb.commit()  
                
    except Exception as e:
        print(e)
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(f"INSERT INTO fechas_consultas_ups (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'ERROR')")
        mydb.commit()
        
        with open("/app/logs.txt", "a") as archivo:
            archivo.write('Fecha y hora del error: ' + str(fecha_y_hora) + ' Dispositivo del error ---> ' + str(ip) + '\n')
            archivo.write(traceback.format_exc())
            archivo.write("\n")
    print("Terminado con exito!")
    
def bucle(scheduler):
    ups()
    scheduler.enter(900, 1, bucle, (scheduler,))

if __name__ == '__main__':
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()