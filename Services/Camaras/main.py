import warnings, requests, os, time, traceback, datetime, sched, re,logging, json
import mysql.connector
import csv
from dotenv import load_dotenv
from config import database

# Esto evita que las respuestas de las API tengan warnings.
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
file_handler = logging.FileHandler('issues.log')
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logging.getLogger().addHandler(file_handler)

load_dotenv()
def get_devices_data():
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
    query = "SELECT * FROM dcs.data_devices"
    cursor.execute(query)
    
    column_names = [column[0] for column in cursor.description]

    # Convertir los resultados a una lista de diccionarios
    devices = []
    # devices = [{
    #     'id':1,
    #     'ip':'10.225.6.17',
    #     'type_device':'Camara',
    #     'site':'casa',
    #     'dpto': 'asda',
    #     'red': 'OT'
    # }]
    for row in cursor:
        row_dict = {}
        for i in range(len(column_names)):
            row_dict[column_names[i]] = row[i]
        devices.append(row_dict)
        
    try:
        username_cctv = os.getenv('CCTV_USER')
        password_cctv = os.getenv('CCT_PASS')
        auth = (username_cctv, password_cctv)
        # cctv_list_servers = ['10.224.116.199']
        cctv_list_servers = ['10.225.0.253', '10.231.0.253', '10.225.11.253', '10.231.10.253', '10.224.116.199']
        cctv_data = []
        
        for ip in cctv_list_servers:
            CCTV_API = os.getenv('CCTV_BASE_URL').format(ip_server=ip)  
            cctv_response = requests.get(CCTV_API, auth=auth).json()
            data = cctv_response['data']
            cctv_data = cctv_data + data

        # Nombre del archivo CSV
        csv_filename = 'numeros.csv'

        # Limpiar los diccionarios para que solo contengan la clave 'url'
        cleaned_data = [item['url'] for item in cctv_data]
        print(len(cleaned_data))
        # Escribir datos en el archivo CSV
        with open(csv_filename, 'w', newline='') as file:
            writer = csv.writer(file)          
            
            # Escribir los datos
            for item in cleaned_data:
                writer.writerow([item])

        print("Se han escrito los datos en el archivo:", csv_filename)

           
        cursor.close()
    
        logging.info('Terminado')       
                
    except Exception:
        logging.error(traceback.format_exc())
        logging.error(ip)
        # logging.error(cisco_device_id_response['queryResponse'])
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        cursor.execute(f"INSERT INTO dcs.fechas_consultas_devices (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'ERROR')")
        mydb.commit()
        # cursor.close()
        
get_devices_data()