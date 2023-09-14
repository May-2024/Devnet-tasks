import re, logging,traceback, os
from netmiko import ConnectHandler
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')

file_handler = logging.FileHandler('issues.log')
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s: %(message)s'))
logging.getLogger().addHandler(file_handler)


def get_data_controladora(device_ip):
    
    load_dotenv()
    USERNAME = os.getenv('NETMIKO_USERNAME')
    PASSWORD = os.getenv('NETMIKO_PASSWORD')
    IP_CONTROLADORA = os.getenv('IP_CONTROLADORA')
    
    UserName = USERNAME
    Password = PASSWORD
    host = IP_CONTROLADORA #! Ip controladora

    network_device_list = {
        "host": host,
        "username": UserName,
        "password": Password,
        "device_type": "cisco_wlc_ssh",
        "timeout": 560,
    }

    net_connect = ConnectHandler(**network_device_list)
    
    try:
        data_pala = net_connect.send_command(f"sh wireless client summary detail ipv4 | inc {device_ip}") #! Ip Pala
        # logging.info(f"OUTPUT: sh wireless client summary detail ipv4 | inc {device_ip}: {data_pala}")
        
        output = net_connect.send_command("sh wireless client mac-address " + data_pala.split()[0] + " detail")
        # logging.info(f"OUTPUT: sh wireless client mac-address {data_pala.split()[0]} detail: {output}")

        signal_strength_pattern = r"Radio Signal Strength Indicator\s*:\s*(-?\d+)\s+dBm"
        signal_noise_pattern = r"Signal to Noise Ratio\s*:\s*(-?\d+)\s+dB"
        connected_for_pattern = r"Connected For\s*:\s*(\d+)\s+seconds"
        ap_name_pattern = r"AP Name\s*:\s*(.*)"

        
        signal_strength = re.search(signal_strength_pattern, output)
        signal_noise_match = re.search(signal_noise_pattern, output)
        connected_for_match = re.search(connected_for_pattern, output)
        ap_name = re.search(ap_name_pattern, output)
        
        signal_strength = signal_strength.group(1) + " dBm"
        signal_noise = signal_noise_match.group(1) + " dB"
        ap_name = ap_name.group(1)
        connected_for = connected_for_match.group(1)
        connected_for = int(connected_for)//60
        connected_for = str(connected_for) + " Min"

        snr_output = net_connect.send_command(f"show ap name {ap_name} mesh neighbor | in PARENT")
        try:
            snr_level = snr_output.split()[3]
        except Exception:
            snr_level = 'N/A'

        netmiko_data = {
            'signal_strength': signal_strength,
            'signal_noise': signal_noise,
            'connected_for': connected_for,
            'ap_name': ap_name,
            'snr_level': snr_level
        }

        net_connect.disconnect()
        return netmiko_data

    except Exception as e:
        logging.error(f"Error Controladora Device {device_ip}")
        logging.error(traceback.format_exc())
        net_connect.disconnect()
        netmiko_data = {
            'signal_strength': 'Not Found',
            'signal_noise': 'Not Found',
            'connected_for': 'Not Found',
            'ap_name': 'Not Found',
            'snr_level': 'Not Found'
        }

        return netmiko_data

# get_data_controladora('10.117.115.122')