import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "../utilities/icons";

const Avatar = () => {
  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const [ mostrarBoton, setMostrarBoton ] = useState(true);
  


  useEffect(() => {
    // Aquí tomamos el token que está almacenado en localStorage
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const response = await fetch(`http://localhost:8080/user/profile`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error fetching user data: ${response.status}`);
          }

          const responseData = await response.json();
          setData(responseData);
          console.log(responseData);
          setMostrarBoton(responseData.role !== 'USER');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      
    };
     
    fetchData();
  }, [token]);
   
  
  

  // Verificar si data y data.name existen antes de dividir el nombre
  const firstName = data?.name ? data.name.split(" ")[0] : "";
  const lastName = data?.username ? data.username.split(" ")[0] : "";

  // Obtener la primera letra del nombre y del apellido
  const firstLetterFirstName = firstName ? firstName.charAt(0) : "";
  const firstLetterLastName = lastName ? lastName.charAt(0) : "";

  const handleLogout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem("token");
    // Redirigir a la página de inicio o a donde desees
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <div className="flex items-center flex-row gap-2 md:gap-4">
      {mostrarBoton && (
    <Link to={`/admin`}>
    <button 
      className="px-4 py-2 bg-colorPrimario text-xs md:text-base  text-white rounded hover:bg-colorPrimarioHover flex items-center gap-2">
      <FontAwesomeIcon icon={getIconByName("user")} size="sm" />
      Panel Admin
    </button>
  </Link>
)}
        

        <div className="flex items-center justify-center w-10 h-10  bg-[#01A9D6] rounded-full">
          <span className="font-light text-base text-white ">
            {firstLetterFirstName + firstLetterLastName}
          </span>
        </div>
        <div className="flex flex-col items-start gap-0">
          <h1 className="text-base font-medium text-black">
            {firstName} {lastName}
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 flex items-center gap-1 md:gap-2"
          >
            <FontAwesomeIcon icon={getIconByName("signOut")} size="sm" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default Avatar;
