import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Avatar from "./Avatar";

const Header = () => {


  const [token, setToken] = useState(null);

  useEffect(() => {
    // Aquí tomamos el token que está almacenado en localStorage
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);


  return (
    <header className="fixed left-0 right-0 top-0 z-40 py-4 px-5 md:px-8 bg-colorClaro flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="text-gray-800">
          <img
            className="h-10 w-auto"
            src="../../public/logoSVG.svg"
            alt="logo"
          />
        </Link>
      </div>

      <div className="flex gap-2 md:gap-4">


        {token ? (
          <Avatar />
        ) : (
          <>
            <Link
              to="/registro"
              className="px-2 py-1 md:px-4 text-base rounded-full bg-colorPrimario text-white"
            >
              Crear cuenta
            </Link>
            <Link
              to="/login"
              className="px-2 py-1 md:px-4 text-base rounded-full bg-colorPrimario text-white"
            >
              Iniciar Sesion
            </Link>
          </>
        )}


      </div>

    </header>
  );
};

export default Header;
