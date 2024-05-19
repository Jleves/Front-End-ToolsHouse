import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "../utilities/icons";

const Avatar = () => {
  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const [mostrarBoton, setMostrarBoton] = useState(true);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const response = await fetch(`https://ec2-54-145-44-94.compute-1.amazonaws.com/User/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error fetching user data: ${response.status}`);
          }

          const responseData = await response.json();
          setData(responseData);

          setMostrarBoton(responseData.role !== "USER");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const dropdownButton = document.getElementById("dropdownHoverButton");
      if (dropdownButton && !dropdownButton.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    // Agregar el escuchador de eventos al documento
    document.addEventListener("click", handleOutsideClick);
    // Limpiar el escuchador de eventos cuando el componente se desmonta
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

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
        {mostrarBoton && (
          <Link to={`/admin`}>
            <button className="px-2 md:px-4 py-2 bg-colorPrimario text-xs md:text-base  text-white rounded hover:bg-colorPrimarioHover flex items-center gap-2">
              <FontAwesomeIcon icon={getIconByName("user")} size="sm" />
              Panel Admin
            </button>
          </Link>
        )}

        <div className=" flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-colorPrimario rounded-full">
          <span className="font-light text-sm md:text-base text-colorClaro ">
            {firstLetterFirstName + firstLetterLastName}
          </span>
        </div>
        <div className="flex items-center gap-0">
          <button
            onClick={toggleDropdown}
            id="dropdownHoverButton"
            data-dropdown-toggle="dropdownHover"
            data-dropdown-trigger="click"
            className="relative focus:outline-none flex flex-row items-center"
            type="button"
          >
            <h1 className="text-xs md:text-base font-medium text-black">
              {firstName} {lastName}
            </h1>

            <svg
              className="w-2.5 h-2.5 ms-2"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="m1 1 4 4 4-4"
              />
            </svg>
            <div
              id="dropdownHover"
              className={`z-10 ${
                isDropdownOpen ? "absolute" : "hidden"
              } top-8 right-0 bg-white rounded-lg shadow-md w-50`}
            >
              <ul className="" aria-labelledby="dropdownHover">
                <li>
                  <Link
                    to="/ListarReservas"
                    className="px-4 py-2 text-base font-light text-black hover:bg-gray-100 rounded-lg flex items-center justify-left gap-2"
                  >
                    <svg
                      className="icon icon-tabler icon-tabler-user"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                    </svg>
                    Reservas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ListarFavoritos"
                    className="px-4 py-2 text-base font-light text-black hover:bg-gray-100 rounded-lg flex items-center justify-left gap-2"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-heart"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                    Favoritos
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={handleLogout}
                    className="px-4 py-2 text-base font-light text-black hover:bg-gray-100 rounded-lg flex items-center justify-left gap-2"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-logout"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                      <path d="M7 12h14l-3 -3m0 6l3 -3" />
                    </svg>
                    Log out
                  </Link>
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Avatar;
