import { getIndicators, getUps, getVpn } from "../../utils/Api-candelaria/api"
import { Navbar } from "../../components/Navbar/Navbar"
import { DevicesDash } from "../../components/Devices/DevicesDash/DevicesDash";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
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

  const [meshIndicators, setMeshIndicators] = useState(null)
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
        setMeshIndicators(allIndicators.mesh);

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
            <Link to="/monitoreo/ups" className="link-system button-ups button-link" style={{ color: 'white' }}>Ver detalles</Link>
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
            <Link to="/monitoreo/vpn" className="link-system button-vpn button-link" style={{ color: 'white' }}>Ver detalles</Link>
          </div>
          
      </section>
      
      <section className="system-container">
        <div className="name-system-container">
          <h1>MESH</h1>
        </div>

        <div className="home-kpi-container">
        <div className="dash-mesh-home">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>OPERANDO</th>
              <th className="kpi-mesh-green">OK</th>
              <th className="kpi-mesh-yellow">WARNING</th>
              <th className="kpi-mesh-red">FALLAS</th>
            </tr>
          </thead>
          <tbody>
            {meshIndicators ? (
              <>
                <tr>
                  <td>PALAS</td>
                  <td>{meshIndicators.palasStatus2}/{meshIndicators.palasTotales}</td>
                  <td>{meshIndicators.palasOk}</td>
                  <td>{meshIndicators.palasWarnings}</td>
                  <td>{meshIndicators.palasFailed}</td>
                </tr>
                <tr>
                  <td>CAEX</td>
                  <td>{meshIndicators.caexStatus2}/{meshIndicators.caexTotales}</td>
                  <td>{meshIndicators.caexOk}</td>
                  <td>{meshIndicators.caexWarnings}</td>
                  <td>{meshIndicators.caexFailed}</td>
                </tr>
                <tr>
                  <td>TOTAL</td>
                  <td>{meshIndicators.palasStatus2 + meshIndicators.caexStatus2}/{meshIndicators.caexTotales + meshIndicators.palasTotales}</td>
                  <td>{meshIndicators.palasOk + meshIndicators.caexOk}</td>
                  <td>{meshIndicators.palasWarnings + meshIndicators.caexWarnings}</td>
                  <td>{meshIndicators.palasFailed + meshIndicators.caexFailed}</td>
                </tr>
              </>
            ) : (
              <tr>
                <td>Cargando...</td>
                <td>Cargando...</td>
                <td>Cargando...</td>
                <td>Cargando...</td>
                <td>Cargando...</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        </div>
        <div className="link-system-container">
            <Link to="/monitoreo/candelaria/mesh" className="link-system button-mesh button-link" style={{ color: 'white' }}>Ver detalles</Link>
        </div>
      </section>

      <section className="system-container">
        <div className="name-system-container">
          <h1>Devices Candelaria</h1>
        </div>

        <div className="home-kpi-container">
          <DevicesDash />
        </div>
        <div className="link-system-container">
            <Link to="/monitoreo/devices" className="link-system button-devices button-link" style={{ color: 'white' }}>Ver detalles</Link>
        </div>
      </section>

    </div>
    </>
  );
}