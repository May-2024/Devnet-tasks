import { getIndicators, getUps, getVpn } from "../../utils/Api-candelaria/api"
import { Navbar } from "../../components/Navbar/Navbar"
import { DevicesDash } from "../../components/Devices/DevicesDash/DevicesDash";
import { DashMesh } from "../Mesh/DashMesh/DashMesh"
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { DashFirewalls } from "../Firewalls/DashFirewalls/DashFirewalls";
import { WanDashboard } from "../Wan/WanDashboard/WanDashboard"
import "./home.css";

export function Home() {
  const [indicators, setIndicators] = useState();

  const [enLineaCount, setEnLineaCount] = useState(0);
  const [usandoBateriaCount, setUsandoBateriaCount] = useState(0);
  const [otroCount, setOtroCount] = useState(0);
  const [changeBatery, setChangeBatery] = useState(0);
  const [numberUps, setNumberUps] = useState(0);

  const [vpn1Users, setVpn1Users] = useState([]);
  const [vpn2Users, setVpn2Users] = useState([]);
  const [vpn3Users, setVpn3Users] = useState([]);


  useEffect(() => {
    let enLinea = 0;
    let usandoBateria = 0;
    let otro = 0;
    let countUps = 0;
    let changeBateryCounter = 0;

    const dataIndicators = async () => {
      try {
        const allIndicators = await getIndicators();
        const allUps = await getUps();
        const vpnData = await getVpn();
        
        setIndicators(allIndicators);

        allUps && allUps.forEach((ups) => {
        if (ups.status_ups === 2) {
          enLinea++;
        } if (ups.status_ups === 3) {
          usandoBateria++;
        } else {
          otro++;
        } if (ups.batery === 2) {
          changeBateryCounter++;
        };

        countUps++;
        setNumberUps(countUps);
        setEnLineaCount(enLinea);
        setUsandoBateriaCount(usandoBateria);
        setOtroCount(otro);
        setChangeBatery(changeBateryCounter);
      });

      setVpn1Users(vpnData.vpn_1);
      setVpn2Users(vpnData.vpn_2);
      setVpn3Users(vpnData.vpn_3);
        
      } catch (error) {
        console.error("Error al obtener datos de la API", error);
        return error;
      }
    };
    dataIndicators();
  }, []);

  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const nombreMesActual = nombresMeses[mesActual];
  const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
  const nombreMesAnterior = nombresMeses[mesAnterior];

  const overAll = indicators && indicators.overallKpi.indicador;
  const disponibilidad = indicators && indicators.disponibilidad.indicador;
  const infra_solucion = indicators && indicators.infra_solucion.indicador;
  
  return (
    <>
    <Navbar title={'Home'}/>
    <div className="home-container">
      <section className="system-container">

        <div className="name-system-container">
            <h1>DCS Candelaria</h1>
        </div>

        <div className="home-kpi-container">
          <table className="home-kpi-table">
            <tbody>
              <tr>
                <td>Overall</td>
                <td><span className={overAll < 99.95 ? 'kpi-red' : 'kpi-green'}> {overAll}% </span></td>
              </tr>
              <tr>
                <td>Disponibilidad</td>
                <td><span  className={disponibilidad < 99.95 ? 'kpi-red' : 'kpi-green'}> {disponibilidad}% </span></td>
              </tr>
              <tr>
                <td>Infraestructura Solución</td>
                <td><span className={infra_solucion < 99.95 ? 'kpi-red' : 'kpi-green'}> {infra_solucion}% </span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="link-system-container">
          <Link to="/monitoreo/candelaria/clients" className="link-system button-clients button-link" style={{ color: 'white' }}>Clientes</Link>
          <Link to="/monitoreo/candelaria/switches" className="link-system button-switches button-link" style={{ color: 'white' }}>Switches</Link>
        </div>
      </section>

      <section className="system-container">
        <div className="name-system-container">
            <h1>UPS</h1>
        </div>

        <div className="home-kpi-container">
          <table className="home-kpi-table ups-table">
              <tbody>
                <tr>
                  <td><p className="light-indicator green-light"></p>En línea</td>
                  <td>{numberUps}</td>
                </tr>
                <tr>
                  <td><p className="light-indicator yellow-light"></p>Usando batería</td>
                  <td>{usandoBateriaCount}</td>
                </tr>
                <tr>
                  <td><p className="light-indicator red-light"></p>Otro</td>
                  <td>1</td> 
                </tr>
                <tr>
                  <td><p className="warning-light" style={{bottom: "10px"}}>🪫</p>Cambio batería</td>
                  <td>{changeBatery}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="link-system-container">
            <Link to="/monitoreo/ups" className="link-system button-link" style={{ color: 'white' }}>Ver detalles</Link>
          </div>
      </section>

      <section className="system-container">
        <div className="name-system-container">
          <h1>VPN</h1>
        </div>

        <div className="home-kpi-container">
          <table className="home-kpi-table">
            <tbody>
              <tr>
                <td>Administrativo</td>
                <td>{vpn1Users.number} users</td>
              </tr>
              <tr>
                <td>Concentradora</td>
                <td>{vpn2Users.number} users</td>
              </tr>
              <tr>
                <td>Ojos</td>
                <td>{vpn3Users.number} users</td>
              </tr>
            </tbody>
          </table>
        </div>

          <div className="link-system-container">
            <Link to="/monitoreo/vpn" className="link-system button-link" style={{ color: 'white' }}>Ver detalles</Link>
          </div>
          
      </section>
      
      <section className="system-container">
        <div className="name-system-container">
          <h1>MESH</h1>
        </div>

        <div className="home-kpi-container">
          <DashMesh />
        </div>
        <div className="link-system-container">
            <Link to="/monitoreo/candelaria/mesh" className="link-system button-link" style={{ color: 'white' }}>Ver detalles</Link>
        </div>
      </section>

      <section className="system-container">
        <div className="name-system-container">
          <h1>Dispositivos Candelaria</h1>
        </div>

        <div className="home-kpi-container">
          <DevicesDash />
        </div>
        <div className="link-system-container">
            <Link to="/monitoreo/devices" className="link-system button-link" style={{ color: 'white' }}>Ver detalles</Link>
        </div>
      </section>

      <section className="system-container">
        <div className="name-system-container">
          <h1>Canales Internet</h1>
        </div>

        <div className="home-kpi-container">
          <DashFirewalls />
        </div>

        <div className="link-system-container">
            <Link to="/monitoreo/firewalls" className="link-system button-link" style={{ color: 'white' }}>Ver detalles</Link>
        </div>
      </section>

      <section className="system-container">
        <div className="name-system-container">
          <h1>WAN</h1>
        </div>

        <div className="home-kpi-container">
          <WanDashboard nombreMesAnterior={nombreMesAnterior}/>
        </div>

        <div className="link-system-container">
            <Link to="/monitoreo/wan" className="link-system button-link" style={{ color: 'white' }}>Ver detalles</Link>
        </div>
      </section>

    </div>
    </>
  );
}