import { Navbar } from "../Navbar/Navbar";
import { Status_System } from "../Status_System/Status_System";
import { Button } from '../Button/Button';
import { Dashboard } from '../Dashboard/Dashboard';
import { TableSwitches } from '../TableSwitches/TableSwitches';
import { Hamburmenu } from "../Hamburmenu/Hamburmenu";

export function Switches() {
  const buttonTag = 'Clientes';
  const urlRedirect = 'clients';
  const switchesTable = 'sw';
  
  return (
    <>
      <Navbar title={'Candelaria'} />
      <Status_System tableToShow={switchesTable}/>
      {/* <Button buttonTag={buttonTag} urlRedirect={urlRedirect} /> */}
      <Dashboard />
      <TableSwitches />
      <Hamburmenu
        buttonTag={buttonTag}
        urlRedirect={urlRedirect}
      />
    </>
  );
}
