import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "../utilities/icons";

const Avatar = () => {
  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error fetching user data: ${response.status}`);
          }

          const responseData = await response.json();
          setData(responseData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [token]);

  // Verificar si data y data.name existen antes de dividir el nombre
  const firstName = data?.nombre ? data.nombre.split(" ")[0] : "";
  const lastName = data?.apellido ? data.apellido.split(" ")[0] : "";

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
        <Link to={`/admin`}>
          <button className="px-4 py-2 bg-colorPrimario text-xs md:text-base text-white rounded hover:bg-colorPrimarioHover flex items-center gap-2">
            <FontAwesomeIcon icon={getIconByName("user")} size="sm" />
            Admin
          </button>
        </Link>

        <div className="flex gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-colorPrimario rounded-full">
            <span className="font-light text-base text-colorClaro ">
              {firstLetterFirstName + firstLetterLastName}
            </span>
          </div>
          <div className="flex flex-col items-start gap-0">
            <h1 className="text-base font-medium text-black">
              {firstName} {lastName}
            </h1>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 flex items-center gap-1"
            >
              <FontAwesomeIcon icon={getIconByName("signOut")} size="sm" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Avatar;
