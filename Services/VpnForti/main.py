import mysql.connector, time, sched, datetime, os
from netmiko import ConnectHandler
from dotenv import load_dotenv
from config import database
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

file_handler = logging.FileHandler('issues.log')
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logging.getLogger().addHandler(file_handler)

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


def get_users_data(output):
    try:
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        
        lines = output.splitlines()
        data = []
        for line in lines:
            user_data = line.split()
            if len(user_data) > 2:
                email = user_data[1]
                ip_lan = user_data[6]
                ip_origin = user_data[3]
                duration = int(user_data[4])
                duration = int(duration / 60)
                user_dict = {'email': email, 'ip_lan': ip_lan, 'ip_origin': ip_origin, 'duration': duration}
                data.append(user_dict)
        return data
    except Exception as e:
        logging.exception(e)
        cursor.execute(f"INSERT INTO fechas_consultas_vpn (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'ERROR')")
        mydb.commit()
        return []

def get_users_list(Hostname, table):
    try:
        now = datetime.datetime.now()
        fecha_y_hora = now.strftime("%Y-%m-%d %H:%M:%S")
        fecha_y_hora = str(fecha_y_hora)
        
        USER = os.getenv('NETMIKO_USER')
        PASSWORD = os.getenv('NETMIKO_PASSWORD')
        logging.info(f'Corriendo : {table}' )

        network_device_list = {
            "host": Hostname,
            "username": USER,
            "password": PASSWORD,
            "device_type": "fortinet",
            "port": 2221,
            "timeout": 180,
        }

        net_connect = ConnectHandler(**network_device_list)
        output = net_connect.send_command("execute vpn sslvpn list tunnel")
        net_connect.disconnect()
        output = output.split("\n", 2)[2]
        data = get_users_data(output)

        for user in data:
            email = user['email']
            ip_lan = user['ip_lan']
            ip_origin = user['ip_origin']
            duration = user['duration']

            query = f"INSERT INTO dcs.{table} (email, ip_lan, ip_origin, duration, datetime) "
            values = f"VALUES ('{email}', '{ip_lan}', '{ip_origin}', '{duration}', '{fecha_y_hora}')"
            cursor.execute(query + values)
            mydb.commit()

        num_users = len(data)
        cursor.execute(f"UPDATE dcs.vpn_number_users SET num_users = '{num_users}' WHERE vpn = '{table}'")
        mydb.commit()

        if table == 'vpn_3':
            logging.info("entro al if para guarda fecha")
            cursor.execute(f"INSERT INTO fechas_consultas_vpn (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'OK')")
            mydb.commit()
            
        logging.info('Datos guardados correctamente')
        
    except Exception as e:
        logging.exception(e)
        cursor.execute(f"INSERT INTO fechas_consultas_vpn (ultima_consulta, estado) VALUES ('{fecha_y_hora}', 'ERROR')")
        mydb.commit()

def bucle(scheduler):
    get_users_list("10.224.126.89", "vpn_1")
    get_users_list("10.224.126.93", "vpn_2")
    get_users_list("10.224.126.97", "vpn_3")
    scheduler.enter(300, 1, bucle, (scheduler,))

if __name__ == '__main__':
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, bucle, (s,))
    s.run()
