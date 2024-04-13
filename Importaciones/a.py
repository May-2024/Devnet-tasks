import csv
import os  # Importar el módulo os para trabajar con rutas de archivo

# Función para reemplazar las comas por puntos en una cadena
def replace_commas_with_dots(ip_address):
    return ip_address.replace(',', '.')

# Definir la ruta al archivo CSV de entrada y salida
input_file = '/home/donkami/Sona/devnet-candelaria/Importaciones/Libro1.csv'  # Reemplaza 'ruta/a/Libro1.csv' con la ruta completa al archivo CSV
output_file = '/home/donkami/Sona/devnet-candelaria/Importaciones/ips_corregidas.csv'

# Lista para almacenar las IPs corregidas
corrected_ips = []

# Abrir el archivo CSV de entrada y leer las IPs
with open(input_file, newline='') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        # Suponemos que cada fila contiene una sola columna con la IP
        if len(row) > 0:
            ip_address = row[0]
            # Reemplazar comas por puntos
            corrected_ip = replace_commas_with_dots(ip_address)
            corrected_ips.append([corrected_ip])

# Escribir las IPs corregidas en un nuevo archivo CSV
with open(output_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(corrected_ips)

print("Se han corregido y guardado las IPs en", output_file)
