import logging
import logger_config
import traceback
from datetime import datetime


def format_data_funct(usersDataString, fw):
    """
    Formatea una cadena de datos de usuarios VPN SSL en una lista de diccionarios.

    Esta función toma la salida cruda de un comando que lista los túneles de VPN SSL y la transforma en una
    lista de diccionarios, donde cada diccionario contiene información detallada de cada sesión de usuario.

    Args:
        usersDataString (str): Cadena de texto que contiene los datos de los usuarios conectados a través de VPN SSL.
        fw (str): Identificador del firewall asociado a los datos.

    Returns:
        list of dict: Una lista de diccionarios, donde cada diccionario contiene la siguiente información:
                      - 'email': Correo electrónico del usuario.
                      - 'ip_lan': Dirección IP LAN del usuario.
                      - 'ip_origin': Dirección IP de origen de la conexión.
                      - 'duration': Duración de la sesión en minutos.
                      - 'fw': Identificador del firewall.
                      - 'datetime': Fecha y hora en que se procesaron los datos.

                      Si ocurre un error durante el procesamiento, se devuelve una lista con un único diccionario 
                      que contiene valores de error.

    Raises:
        None: Los errores son capturados y registrados en los logs.

    Notes:
        - El tiempo de duración de la sesión se convierte de segundos a minutos.
        - Los errores se manejan devolviendo un diccionario con valores indicativos de error.
        - Los errores también se registran utilizando el módulo `logging`.
    """
    try:
        now = datetime.now()
        now_datetime = now.strftime("%Y-%m-%d %H:%M:%S")
        now_datetime = str(now_datetime)

        lines = usersDataString.splitlines()
        data = []
        for line in lines:
            user_data = line.split()
            if len(user_data) > 2:
                fw = fw
                email = user_data[1]
                ip_lan = user_data[6]
                ip_origin = user_data[3]
                duration = int(user_data[4])
                duration = int(duration / 60)
                user_dict = {
                    "email": email,
                    "ip_lan": ip_lan,
                    "ip_origin": ip_origin,
                    "duration": duration,
                    "fw": fw,
                    "datetime": now_datetime,
                }
                data.append(user_dict)

        return data

    except Exception as e:
        logging.error(traceback.format_exc())
        logging.error(
            "Error en la función `format_data_funct` en el archivo `format_data`"
        )
        logging.error(e)
        return [
            {
                "email": "Error DevNet",
                "ip_lan": "Error DevNet",
                "ip_origin": "Error DevNet",
                "duration": 0,
                "fw": fw,
                "datetime": str(datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
            }
        ]


# string = """
#  0       shc.cl.can.ing8@lundinmining.com        CD-SSLVPN-Gpolicy-B    191.113.5.244    7213    2927537/8230549        10.225.19.1
#  1       v-m.arriaza@lundinmining.com    CD-SSLVPN-Gpolicy-A    181.43.219.138   37550   8480295/28669865       10.225.19.2
#  """
# format_data_funct(string, 1)
