import { getWan } from "../../utils/Api-candelaria/api";
import { useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Status_System } from "../Status_System/Status_System";
import { WanDashboard } from "./WanDashboard/WanDashboard"
import "./wan.css";

export function Wan() {
  const [wan, setWan] = useState([]);

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
  const hoy = fechaActual.getDate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wanList = await getWan();
        setWan(wanList);
      } catch (error) {
        console.error("Error al obtener el listado de WAN:", error);
        return error;
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Navbar title={"WAN"} />
      <Status_System tableToShow={"wan"} />
      <WanDashboard nombreMesAnterior={nombreMesAnterior} nombreMesActual={nombreMesActual}/>
      <table className="wan-table">
        <thead>
          <tr>
            <th>IP</th>
            <th>SENSOR</th>
            <th>UPTIME(%) MES ANTERIOR<br/> ({nombreMesAnterior}) </th>
            <th>UPTIME(s) MES ANTERIOR<br/> ({nombreMesAnterior})</th>
            <th>DOWNTIME(%) MES ANTERIOR<br/> ({nombreMesAnterior})</th>
            <th>DOWNTIME(s) MES ANTERIOR<br/> ({nombreMesAnterior})</th>
            <th>UPTIME(%) MES ACTUAL<br/> ({nombreMesActual})</th>
            <th>UPTIME(%) HOY <br/> ({hoy} de {nombreMesActual})</th>
          </tr>
        </thead>
        <tbody>
          {wan &&
            wan.map((wan) => (
              <tr key={wan.id}>
                <td>{wan.ip}</td>
                <td>{wan.sensor}</td>
                <td
                  className={
                    wan.last_uptime_percent >= 99.85 ? "kpi-green" : "kpi-red"
                  }
                >
                  {wan.last_uptime_percent} %
                </td>
                <td>{wan.last_uptime_days}</td>
                <td>{wan.last_down_percent} %</td>
                <td>{wan.last_down_days}</td>
                <td
                  className={
                    wan.current_uptime_percent >= 99.85 ? "kpi-green" : "kpi-red"
                  }
                >
                  {wan.current_uptime_percent} %
                </td>
                <td className={
                    wan.today_uptime_percent >= 99.85 ? "kpi-green" : "kpi-red"
                  }>{wan.today_uptime_percent} %</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
