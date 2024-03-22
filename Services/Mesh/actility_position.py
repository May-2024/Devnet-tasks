import logging

def get_actility_data(mydb, ap_name):
    try:
        logging.info(f"Nombre del AP: {ap_name}")
        cursor = mydb.cursor()
        query = f"SELECT * FROM dcs.data_mesh_actility WHERE name = '{ap_name}'"
        cursor.execute(query)
        
        column_names = [column[0] for column in cursor.description]
        row = cursor.fetchone()  # Obtenemos solo una fila

        if row is not None:  # Verificamos si se encontró una fila
            device = {}  # Creamos un diccionario para almacenar el resultado
            for i in range(len(column_names)):
                device[column_names[i]] = row[i]

            mydb.commit()
            if device['latitude'] == 0.0 or device['longitude'] == 0.0 :
                latitude = 99.999
                longitude = 99.999
                return latitude, longitude
                
            return device['latitude'], device['longitude']
        else:
            logging.info("ACTILITY: No se encontraron coincidencias con los AP reportados por la controladora.")
            mydb.commit()
            return 99.999, 99.999
        
    except Exception as e:
        logging.error(f"Error funcion `get_actility_data`: {e}")
        return 99.999, 99.999
