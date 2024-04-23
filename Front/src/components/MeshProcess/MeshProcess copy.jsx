import { useState, useEffect } from "react";
import { Navbar } from "../Navbar/Navbar";
import { getDataMeshProcess } from "../../utils/Api-candelaria/api";
import { Status_System } from "../Status_System/Status_System";
import "./MeshProcess.css";

export function MeshProcess() {
  const [processMesh, setProcessMesh] = useState([]);

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
        // setShowSpinner(false);
      } catch (error) {
        console.error("Error al obtener la data del process mesh", error);
        return error;
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Navbar title={"Proceso Mesh"} />
      <Status_System tableToShow={"mesh_process"} />
      <div className="container-process-mesh-table">
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
            {processMesh.map((device) => (
              <tr key={device.id}>
                <td>{device.ubication}</td>
                <td>{device.device}</td>
                <td>{device.client}</td>
                <td>{device.last_mac}</td>
                <td
                  className={device.status === "fail" ? "kpi-red" : ""}
                  style={device.status === "fail" ? { cursor: "pointer" } : {}}
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
