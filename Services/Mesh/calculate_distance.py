import math
import logging

def get_distance(lon1, lat1, lon2, lat2):
    try:
        # Verificar si alguno de los parámetros es una cadena (string)
        logging.info(f"AP LONGITUD {lon1}")
        logging.info(f"AP LATITUD {lat1}")
        logging.info(f"PALA LONGITUD {lon2}")
        logging.info(f"PALA LATITUD {lat2}")
     
        if lon1 == 99.999 or lat1 == 99.999 or lon2 == 99.999 or lat2 == 99.999:
            logging.info("Uno de los datos es 99.999, retornando 0 metros")
            return 0
        
        # Radio de la Tierra en metros
        R = 6371000  

        # Convertir grados decimales a radianes
        lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])

        # Diferencias de longitud y latitud
        dlon = lon2 - lon1 
        dlat = lat2 - lat1 

        # Aplicar la fórmula de Haversine
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a)) 
        distance = R * c
        distance = round(distance, 1)
        logging.info(f"{distance} metros")
        return distance
    
    except Exception as e:
        logging.error("Error en la funcion `get_distance`")
        logging.error(e)
        return 0.0