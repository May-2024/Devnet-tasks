import datetime
import os
import mysql.connector
import traceback
import logging
from dotenv import load_dotenv
from config import database
load_dotenv()


# def update_fail_datetime(mydb, last_data, current_data_fw):
def update_fail_datetime(last_data, current_data_fw):
    try:
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
        
        for last_data_fw in last_data:
            if (
                last_data_fw["fw"] == current_data_fw["name"]
                and last_data_fw["canal"] == current_data_fw["canal"]
            ):
                if (last_data_fw["state"] == "alive" and current_data_fw["state"] == "alive") or (last_data_fw["state"] == "Not Found" and current_data_fw["state"] == "Not Found"):
                    query = f"""
                            UPDATE dcs.firewalls SET fail_datetime = 'No fail reported' 
                            WHERE canal = '{last_data_fw['canal']}' and fw = '{last_data_fw['fw']}'
                            """
                    cursor.execute(query)
                    mydb.commit()

                if (
                    last_data_fw["state"] == "alive" and current_data_fw["state"] == "dead"
                ) or (
                    last_data_fw["state"] == "Not Found"
                    and current_data_fw["state"] == "dead"
                ):
                    now = datetime.datetime.now()
                    fail_datetime = now.strftime("%Y-%m-%d %H:%M:%S")
                    query = f"""
                            UPDATE dcs.firewalls SET fail_datetime = '{fail_datetime}' 
                            WHERE canal = '{last_data_fw['canal']}' and fw = '{last_data_fw['fw']}'
                            """
                    cursor.execute(query)
                    mydb.commit()

                if last_data_fw["state"] == "dead" and current_data_fw["state"] == "alive":
                    query = f"""
                            UPDATE dcs.firewalls SET fail_datetime = 'No fail reported' 
                            WHERE canal = '{last_data_fw['canal']}' and fw = '{last_data_fw['fw']}'
                            """
                    cursor.execute(query)
                    mydb.commit()
        cursor.close()
        mydb.close()
        
    except Exception as e:
        logging.error(f"Error: {e}")
        logging.error(traceback.format_exc())
        if 'mydb' in locals():
            mydb.close() 

# test_last_data = [{'id': 17, 'fw': 'FW-Copiapo', 'ip': '10.224.21.1', 'canal': 'wan1', 'num_users': '871', 'state': 'Not Found'}]

# test_current_data = {'id': 17, 'name': 'FW-Copiapo', 'ip': '10.224.21.1', 'canal': 'wan1', 'num_users': '871', 'state': 'Not Found'}

# update_fail_datetime(test_last_data,test_current_data)