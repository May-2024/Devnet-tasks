import React, { useEffect, useState } from 'react';
import { getStatusSystem } from '../../utils/Api-candelaria/api';
import './status_system.css';

export function Status_System({ tableToShow }) {
  const [statusSystem, setStatusSystem] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const system = await getStatusSystem();
        setStatusSystem(system);
      } catch (error) {
        console.error("Error al obtener el Status System", error);
        return error;
      }
    };
    fetchData();
  }, []);

  const table = () => {
    if (tableToShow === 'dcs') {
      return 'Clientes'
    } else if(tableToShow === 'sw'){
      return 'Switches'
    } else if(tableToShow === 'ups'){
      return "UPS"
    } else if(tableToShow === 'vpn'){
      return "VPN"
    } else if(tableToShow === 'mesh'){
      return 'Mesh'
    } else if(tableToShow === 'devices') {
      return 'Dispositivos'
    } else if(tableToShow === 'fw') {
      return 'Firewalls'
    } else if(tableToShow === 'wan') {
      return 'WAN'
    }
  } 

  return (
    <div className='status-system-container'>
      {statusSystem ? (
        <div>
          <p>Info Sistema: {table()}</p>
          <ul>
            {statusSystem[tableToShow].map((item) => (
              <li key={item.id}>
                Última consulta: {item.ultima_consulta}
              </li>
            ))}
            {statusSystem[tableToShow].map((item) => (
              <li key={item.id}>
                Estado: {item.estado} <span className={item.estado === 'OK' ? 'green' : 'red'}>`</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}
