import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import "./firewalls.css";

export function FailHistoryFw({ dataHistoryFail, setShowHistoryTable }) {
  const [searchTerm, setSearchTerm] = useState("");
  const datetimesHistory = dataHistoryFail.data;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // const renderTableBody = (firewallsArray) => {
  //   if (firewallsArray.length === 0) {
  //     return (
  //       <tr>
  //         <td className="no-match" colSpan="14" style={{ fontSize: "13px" }}>
  //           No hay elementos
  //         </td>
  //       </tr>
  //     );
  //   }

  return (
    <div className="history-fail-table-fw-container">
      <div className="input-history-fail-fw-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="input-history-fail-fw"
        />
        <IoMdCloseCircle
          title={"Cerrar tabla Historial de Fallas"}
          size="2rem"
          color="red"
          style={{ cursor: "pointer" }}
          onClick={() => setShowHistoryTable(false)}
        />
      </div>
      .
      <div>
        <table>
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>IP</th>
              <th>NÚMERO USUARIOS</th>
              <th>CANAL</th>
              <th>DATOS ENLACE</th>
              <th>ESTADO</th>
              <th>PERDIDAS</th>
              <th>LATENCIA</th>
              <th>JITTER</th>
              <th>GATEWAY</th>
              <th>FALLO 24Hrs</th>
              <th>FECHA</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}
