
# Convierte el dato en float
def format_historic_data(data):
    if "?" in data:
        data = data.replace("?", "100%")
    data = ''.join(data.split())
    data = data.replace('%', '')
    data = data.replace(',', '.')
    data = round(float(data), 2)
    return data