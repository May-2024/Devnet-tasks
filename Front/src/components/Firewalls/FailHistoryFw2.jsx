import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import "./firewalls.css";

export function FailHistoryFw2({ dataHistoryFail, setShowHistoryTable }) {
  const [searchTerm, setSearchTerm] = useState("");
  const firewallsArray = dataHistoryFail.data;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderTableBody = (firewallsArray) => {
    if (firewallsArray.length === 0) {
      return (
        <tr>
          <td className="no-match" colSpan="14" style={{ fontSize: "13px" }}>
            No hay elementos
          </td>
        </tr>
      );
    }

    const filteredFirewalls = firewallsArray.filter((fw) =>
      Object.values(fw).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return filteredFirewalls.map((fw) => (
      <tr key={fw.id}>
        <td>{fw.fw}</td>
        <td>{fw.ip}</td>
        <td>{fw.num_users}</td>
        <td>{fw.canal}</td>
        <td>{fw.link}</td>
        <td className={fw.state === "dead" ? "kpi-red" : "kpi-green"}>
          {fw.state}
        </td>
        <td
          className={
            fw.packet_loss === "Not Found"
              ? ""
              : parseFloat(fw.packet_loss) > 5
              ? "kpi-red"
              : parseFloat(fw.packet_loss) >= 2 &&
                parseFloat(fw.packet_loss) <= 5
              ? "kpi-yellow"
              : ""
          }
        >
          {fw.packet_loss === "Not Found" ? "Not Found" : fw.packet_loss + "%"}
        </td>
        <td
          className={
            fw.latency === "Not Found"
              ? ""
              : parseFloat(fw.latency) > 100
              ? "kpi-red"
              : parseFloat(fw.latency) >= 50 && parseFloat(fw.latency) <= 100
              ? "kpi-yellow"
              : ""
          }
        >
          {fw.latency === "Not Found" ? "Not Found" : fw.latency + " ms"}
        </td>
        <td
          className={
            fw.jitter === "Not Found"
              ? ""
              : parseFloat(fw.jitter) > 30
              ? "kpi-red"
              : parseFloat(fw.jitter) >= 10 && parseFloat(fw.jitter) <= 30
              ? "kpi-yellow"
              : ""
          }
        >
          {fw.jitter === "Not Found" ? "Not Found" : fw.jitter + " ms"}
        </td>
        <td
          className={
            fw.status_gateway.includes("Up")
              ? "kpi-green"
              : fw.status_gateway.includes("Paused")
              ? "kpi-blue"
              : fw.status_gateway.includes("Down")
              ? "kpi-red"
              : fw.status_gateway.includes("Not Found") &&
                fw.gateway.includes("100.64.0.1")
              ? "kpi-green"
              : fw.status_gateway.includes("Not Found")
              ? "kpi-red"
              : ""
          }
        >
          {fw.gateway}
        </td>

        <td>{fw.failed_before}</td>
        <td>{fw.datetime}</td>
      </tr>
    ));
  };

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
          <tbody>{renderTableBody(firewallsArray)}</tbody>
        </table>
      </div>
    </div>
  );
}
