import "./adminbuttons.css";

export const ActionButtons = ({ onRenderComponent, activeComponent }) => {
  return (
    <div className="buttons-container">
      <button
        onClick={() => onRenderComponent("CreateUps")}
        className={`admin-button green-button ${
          activeComponent === "CreateUps" ? "active" : ""
        }`}
      >
        Registrar
      </button>
      <button
        onClick={() => onRenderComponent("EditUps")}
        className={`admin-button blue-button ${
          activeComponent === "EditUps" ? "active" : ""
        }`}
      >
        Editar
      </button>
      <button
        onClick={() => onRenderComponent("DeleteUps")}
        className={`admin-button red-button ${
          activeComponent === "DeleteUps" ? "active" : ""
        }`}
      >
        Eliminar
      </button>
    </div>
  );
};
