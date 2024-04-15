import re
from datetime import datetime

# Datos de prueba
data = [
    {
        "id": 1,
        "ip": "10.117.115.110",
        "device": "Pala 10",
        "ping_avg": "23 msec",
        "minimo": "11 msec",
        "maximo": "43 msec",
        "packet_loss": "0 %",
        "lastvalue": "693 msec",
        "lastup": "03-04-2024 15:57:57 [30 s ago]",
        "lastdown": "03-04-2024 15:18:01 [40 m 26 s ago]",
        "nivel_senal": "-166 dBm", #!
        "ruido_senal": "15 dB",
        "tiempo_conexion": "172 Min",
        "conectado_a": "CAN-RAP10",
        "status_dispatch": "2-NORMAL",
        "operador": "CONTRERAS SAEZ JORGE",
        "snr": 1,
        "id_prtg": "13588",
        "distance": 0.0,
        "fail_senal": 1,
        "fail_time_senal": 16,
        "fail_snr": 2,
        "fail_time_snr": 15,
        "date": "2024-04-11 11:00:00",
    }
]

def get_number(nivel):
    if isinstance(nivel, int):
        nivel = str(nivel)

    if "N/A" in nivel:
        return "N/A"

    match = re.search(r"(-?\d+(\.\d+)?)", nivel)
    if match:
        return float(match.group(0))  # Convertimos el resultado a un número decimal
    else:
        return "Not Found"


def counter_function(ip_device, signal_strength, snr_level, data):
    
    # Inicializamos variables
    fail_senal = 999
    fail_time_senal = 999
    fail_snr = 999
    fail_time_snr = 999
    
    for mesh_element in data:
        if mesh_element["ip"] == ip_device:
            fail_senal = mesh_element["fail_senal"]
            fail_time_senal = mesh_element["fail_time_senal"]
            fail_snr = mesh_element["fail_snr"]
            fail_time_snr = mesh_element["fail_time_snr"]
            date_last_data = mesh_element["date"]
             
        # Primera Validacion: Estado Dispatch 2 y obtener el elemento de la IP correspondiente
        if "2" in mesh_element["status_dispatch"] and mesh_element["ip"] == ip_device:
            signal_strength = get_number(signal_strength)
            snr_level = get_number(snr_level)
            mesh_element["nivel_senal"] = get_number(mesh_element["nivel_senal"])
            mesh_element["snr"] = get_number(mesh_element["snr"])
            
            # Inicializamos los fails con los datos de la ultima consulta
            fail_senal = mesh_element["fail_senal"]
            fail_time_senal = mesh_element["fail_time_senal"]
            fail_snr = mesh_element["fail_snr"]
            fail_time_snr = mesh_element["fail_time_snr"]

            # Segunda Validacion: Nivel de Senal
            # Dato actual
            if (
                signal_strength != "Not Found"
                and signal_strength != "N/A"
                and abs(signal_strength) >= 85
            ):
                # Si el Dato Anterior esta dentro de los rangos el contador down nivel senal y el fail time aumentan
                if (
                    mesh_element["nivel_senal"] == "Not Found"
                    or mesh_element["nivel_senal"] == "N/A"
                    or abs(mesh_element["nivel_senal"]) <= 85
                ):
                    fail_senal = mesh_element["fail_senal"] + 1
                    fail_time_senal = 5
                    print(f"fail_senal: {fail_senal}")
                    print(f"fail_time_senal: {fail_time_senal}")
                
                # Si el Dato Anterior esta fuera de los rangos el contador down nivel senal sera el mismo
                # Ya que se asume es la misma falla  
                if (
                    mesh_element["nivel_senal"] != "Not Found"
                    and mesh_element["nivel_senal"] != "N/A"
                    and abs(mesh_element["nivel_senal"]) >= 85
                ):
                    now = datetime.now()
                    current_date_signal_lvl = now.strftime("%Y-%m-%d %H:%M:%S")
                    current_date_signal_lvl = str(current_date_signal_lvl)
                    
                    date_last_data_signal_lvl = datetime.strptime(date_last_data, "%Y-%m-%d %H:%M:%S")
                    current_date_signal_lvl = datetime.strptime(current_date_signal_lvl, "%Y-%m-%d %H:%M:%S")
                    
                    difference_time_signal_lvl = current_date_signal_lvl - date_last_data_signal_lvl
                    difference_time_signal_lvl = int(round(difference_time_signal_lvl.total_seconds() / 60))
                    
                    fail_senal = mesh_element["fail_senal"]
                    fail_time_senal = mesh_element["fail_time_senal"] + difference_time_signal_lvl
                    print(f"fail_senal: {fail_senal}")
                    print(f"fail_time_senal: {fail_time_senal}")
            else:
                fail_senal = mesh_element["fail_senal"]
                fail_time_senal = mesh_element["fail_time_senal"]
                print(f"fail_senal: {fail_senal}")
                print(f"fail_time_senal: {fail_time_senal}")
                
            # Tercera Validacion: SNR
            # Dato actual
            if (
                snr_level != "Not Found"
                and snr_level != "N/A"
                and int(snr_level) <= 10
            ):
                # Si el Dato Anterior esta dentro de los rangos el contador down SNR y el fail time aumentan
                if (
                    mesh_element["snr"] == "Not Found"
                    or mesh_element["snr"] == "N/A"
                    or int(mesh_element["snr"]) >= 10
                ):
                    fail_snr = mesh_element["fail_snr"] + 1
                    fail_time_snr = 5
                    print(f"fail_snr: {fail_snr}")
                    print(f"fail_time_snr: {fail_time_snr}")
                
                # Si el Dato Anterior esta fuera de los rangos el contador down nivel senal sera el mismo
                # Ya que se asume es la misma falla 
                
                if (
                    mesh_element["snr"] != "Not Found"
                    and mesh_element["snr"] != "N/A"
                    and (mesh_element["snr"]) <= 10
                ):
                    now = datetime.now()
                    current_date_snr = now.strftime("%Y-%m-%d %H:%M:%S")
                    current_date_snr = str(current_date_snr)
                    
                    date_last_data_snr = datetime.strptime(date_last_data, "%Y-%m-%d %H:%M:%S")
                    current_date_snr = datetime.strptime(current_date_snr, "%Y-%m-%d %H:%M:%S")
                    
                    difference_time_snr = current_date_snr - date_last_data_snr
                    difference_time_snr = int(round(difference_time_snr.total_seconds() / 60))
                    fail_snr = mesh_element["fail_snr"]
                    fail_time_snr = mesh_element["fail_time_snr"] + difference_time_snr
                    print(f"fail_snr: {fail_snr}")
                    print(f"fail_time_snr: {fail_time_snr}")
            else:
                fail_snr = mesh_element["fail_snr"]
                fail_time_snr = mesh_element["fail_time_snr"]
                print(f"fail_snr: {fail_snr}")
                print(f"fail_time_snr: {fail_time_snr}")
                            
    return fail_senal, fail_time_senal, fail_snr, fail_time_snr
      
# signal_strength = "-166 dBm"
# snr_level = 1  
# counter_function("10.117.115.110", signal_strength, snr_level, data)


