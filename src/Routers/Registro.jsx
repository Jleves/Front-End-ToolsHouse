import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "../utilities/icons";
import { toast } from "sonner";

const Resgistro = () => {
  const { login } = useAuth();
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    ciudad: "",
    password: "",
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = {};
    if (formulario.nombre.trim().length === 0) {
      erroresValidacion.nombre = "El nombre es requerido";
    }
    if (formulario.apellido.trim().length === 0) {
      erroresValidacion.apellido = "El apellido es requerido";
    }
    if (!formulario.email.trim()) {
      erroresValidacion.email = "El email electrónico es requerido";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formulario.email)
    ) {
      erroresValidacion.email = "El email electrónico ingresado no es válido";
    }
    if (formulario.password.trim().length < 8) {
      erroresValidacion.password =
        "La password debe tener al menos 8 caracteres";
    } else if (
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(formulario.password)
    ) {
      erroresValidacion.password =
        "La password debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial";
    }

    if (Object.keys(erroresValidacion).length === 0) {
      fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulario),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Hubo un problema al regitrar al usuario");
          }
          return response.json();
        })
        .then((data) => {
          login(data.token);
          console.log("Registro exitoso:", data);
        })
        .catch((error) => {
          toast.error("Hubo un error al registar al usuario.", {});
          setErrorGeneral("Hubo un error al registar al usuario", error);
        });
      console.log("Datos del formulario:", formulario);
    } else {
      setErrores(erroresValidacion);
      setErrorGeneral("Verifica los campos marcados en rojo.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row mt-4">
      <div className="md:w-1/2">
        <img
          src="https://media.istockphoto.com/id/119479420/es/foto/en-construcci%C3%B3n.jpg?s=612x612&w=0&k=20&c=ER3-UaQV7AJ2evNr7_KQw5RElC8mPVgSjqch4Fi1Aro="
          alt="Imagen de Registro"
          className="hidden md:block w-full h-full object-cover rounded-r-3xl"
        />
      </div>

      <div className="md:w-1/2 px-16 my-auto">
        <div className="flex items-center justify-center mb-8">
          <FontAwesomeIcon
            className="text-6xl text-colorPrimario"
            icon={getIconByName("circleUser")}
          />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          <b>Crear Cuenta</b>
        </h2>
        {errorGeneral && <p className="text-red-500 mb-4">{errorGeneral}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nombre"
              className="block text-gray-700 font-semibold mb-2"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-colorSecundario ${
                errores.nombre ? "border-red-500" : ""
              }`}
              required
            />
            {errores.nombre && (
              <p className="text-red-500 mt-1">{errores.nombre}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="apellido"
              className="block text-gray-700 font-semibold mb-2"
            >
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formulario.apellido}
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-colorSecundario ${
                errores.apellido ? "border-red-500" : ""
              }`}
              required
            />
            {errores.apellido && (
              <p className="text-red-500 mt-1">{errores.apellido}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formulario.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-colorSecundario ${
                errores.email ? "border-red-500" : ""
              }`}
              required
            />
            {errores.email && (
              <p className="text-red-500 mt-1">{errores.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="ciudad"
              className="block text-gray-700 font-semibold mb-2"
            >
              Ciudad
            </label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              value={formulario.ciudad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-colorSecundario"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formulario.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-colorSecundario ${
                errores.password ? "border-red-500" : ""
              }`}
              required
            />
            {errores.password && (
              <p className="text-red-500 mt-1">{errores.password}</p>
            )}
          </div>

          <div className="grid justify-items-center ">
            <button
              type="submit"
              className="w-full text-white font-semibold px-4 py-2 rounded-md bg-colorPrimario hover:bg-colorPrimarioHover transition duration-300"
            >
              Registrarse
            </button>
            <Link
              to="/login"
              className="px-2 py-1 md:px-4 text-base rounded-full text-colorPrimario underline"
            >
              <h3>Tenes ya una cuenta? Inicia Sesion</h3>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Resgistro;
