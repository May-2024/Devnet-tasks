import React, { useState, useEffect } from "react";
import { Navbar } from "../Navbar/Navbar";
import { getDataMeshProcess } from "../../utils/Api-candelaria/api";
import { Status_System } from "../Status_System/Status_System";
import "./MeshProcess.css";

export function MeshProcess() {
  const [processMesh, setProcessMesh] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meshData = await getDataMeshProcess();
        meshData.sort((a, b) => {
          if (a.status === "fail" && b.status !== "fail") {
            return -1; // a debe ir antes que b
          } else if (a.status !== "fail" && b.status === "fail") {
            return 1; // b debe ir antes que a
          } else {
            return 0; // no se cambia el orden
          }
        });
        setProcessMesh(meshData);
      } catch (error) {
        console.error("Error al obtener la data del process mesh", error);
        return error;
      }
    };
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProcessMesh = processMesh.filter((device) =>
    Object.values(device).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div>
      <Navbar title={"Proceso Mesh"} />
      <Status_System tableToShow={"mesh_process"} />

      <div className="container-process-mesh-table">
        <input
          className="input-mesh-process"
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <table className="process-mesh-table">
          <thead>
            <tr>
              <th>Ubicación</th>
              <th>Dispositivo</th>
              <th>Cliente</th>
              <th>Mac Anterior</th>
              <th>Mac Actual</th>
              <th>Fecha Última Cambio MAC</th>
            </tr>
          </thead>
          <tbody>
            {filteredProcessMesh.map((device) => (
              <tr key={device.id}>
                <td>{device.ubication}</td>
                <td>{device.device}</td>
                <td>{device.client}</td>
                <td>{device.last_mac}</td>
                <td
                  className={device.status === "fail" ? "kpi-red" : ""}
                  style={device.status === "fail" ? { cursor: "help" } : {}}
                  title={
                    device.status === "fail"
                      ? "El valor de esta MAC se repite en otra Ubicación"
                      : ""
                  }
                >
                  {device.current_mac}
                </td>
                <td>{device.last_change_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
