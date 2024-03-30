import { Outlet } from "react-router-dom";
import PanelAdmin from "../Components/PanelAdmin";

const Admin = () => {
  return (
    <>
    <div className="hidden md:flex" >
      <PanelAdmin />
      <Outlet />
    </div>
    <div className="flex md:hidden my-6"> 
      <div className="bg-white rounded-lg p-4 shadow-md ">
        <h2 className="mb-2 font-semibold text-center">Lo sentimos, la función de administrador no está disponible en dispositivos móviles.</h2>
      </div>
    </div>
    </>
    
  );
};

export default Admin;
