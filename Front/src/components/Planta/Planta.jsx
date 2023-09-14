// import { getIndicators } from "../../utils/Api-candelaria/api"
// import { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
// import "./planta.css";

// export function Planta() {
//   const [indicators, setIndicators] = useState();

//   useEffect(() => {
//     const dataIndicators = async () => {
//       try {
//         const allIndicators = await getIndicators();
//         setIndicators(allIndicators);
//         // console.log(allIndicators)
//       } catch (error) {
//         console.error("Error al obtener los indicadores del sistema", error);
//         return error;
//       }
//     };
//     dataIndicators();
//   }, []);

//   const overAll = indicators && indicators.overallKpi.indicador;
//   const disponibilidad = indicators && indicators.disponibilidad.indicador;
//   const infra_solucion = indicators && indicators.infra_solucion.indicador;
  
//   return (
//     <div className="main-container">
//       <section className="planta">
//         <h2 className="nombre">Concentradora Candelaria</h2>
//         <div className="kpi-container">
//           <ul className="indicators-home">
//             <li>Overall : <span className={overAll < 99.95 ? 'kpi-red' : 'kpi-green'}> {overAll}% </span></li>
//             <li>Disponibilidad : <span  className={disponibilidad < 99.95 ? 'kpi-red' : 'kpi-green'}> {disponibilidad}% </span></li>
//             <li>Infraestructura Solución : <span className={infra_solucion < 99.95 ? 'kpi-red' : 'kpi-green'}> {infra_solucion}% </span></li>
//             {/* <li>Estado del sistema : Sin Errores</li> */}
//           </ul>
//         </div>
//         <div className="link-system-container">
//         <Link to="/concentradora/dcs/clients" className="link-system button-clients button-link" style={{ color: 'white' }}>Clientes</Link>
//         <Link to="/concentradora/dcs/switches" className="link-system button-switches button-link" style={{ color: 'white' }}>Switches</Link>
//         <Link to="/concentradora/dcs/ups" className="link-system button-ups button-link" style={{ color: 'white' }}>Ups</Link>
//           {/* <button className="link-system button-switches button-link"><a href="http://10.224.116.78:4000/concentradora/dcs/switches" style={{ color: 'white' }}> Switches</a></button>
//           <button className="link-system button-ups button-link"><a href="http://10.224.116.78:4000/concentradora/dcs/ups" style={{ color: 'white' }}> Ups</a></button> */}
//         </div>
//       </section>
//     </div>
//   );
// }