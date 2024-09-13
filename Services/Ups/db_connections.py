import logger_config
import mysql.connector
import os
import traceback
import logging
from dotenv import load_dotenv

load_dotenv()
env = os.getenv("ENVIRONMENT")


def devnet_connection():
    # * Base de datos DevNet

    try:
        DB_HOST = os.getenv("DB_HOST")
        DB_USER = os.getenv("DB_USER")
        DB_PASSWORD = os.getenv("DB_PASSWORD")
        DB_DATABASE = os.getenv("DB_DATABASE")
        
        db_connector = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_DATABASE,
        )
        return db_connector

    except Exception as error:
        logging.error(traceback.format_exc())
        logging.error(
            "Error en la función `devnet_connection` en el archivo `db_connections`"
        )
        logging.error(error)
        return None


def historic_connection():
    # * Base de datos para guardar registros hasta 12 meses

    try:
        DB_HOST_HISTORIC = os.getenv("DB_HOST_HISTORIC")
        DB_USER_HISTORIC = os.getenv("DB_USER_HISTORIC")
        DB_PASSWORD_HISTORIC = os.getenv("DB_PASSWORD_HISTORIC")
        DB_DATABASE_HISTORIC = os.getenv("DB_DATABASE_HISTORIC")
        
        db_connector = mysql.connector.connect(
            host=DB_HOST_HISTORIC,
            user=DB_USER_HISTORIC,
            password=DB_PASSWORD_HISTORIC,
            database=DB_DATABASE_HISTORIC
        )

        return db_connector

    except Exception as error:
        logging.error(traceback.format_exc())
        logging.error(
            "Error en la función `historic_connection` en el archivo `db_connections`"
        )
        logging.error(error)
        return None

historic_connection()