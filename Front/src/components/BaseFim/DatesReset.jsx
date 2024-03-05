import { MdArrowForwardIos } from "react-icons/md";
import "./BaseFim.css";

export function DatesReset({ listDownSelected, baseName, setShowDatesReset }) {
  return (
    <div className="dates-reset">
      <MdArrowForwardIos
        onClick={() => setShowDatesReset(false)}
        style={{
          position: "absolute",
          top: "10px",
          left: "5px",
          cursor: "pointer",
        }}
      />
      <h2 style={{ textAlign: "center" }}>Fechas de Reinicio</h2>
      <div style={{ marginTop: "30px" }}>
        <h3>{baseName}</h3>
        {listDownSelected.map((e) => (
          <div className="dates-container" key={e}>
            <p>{e}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
