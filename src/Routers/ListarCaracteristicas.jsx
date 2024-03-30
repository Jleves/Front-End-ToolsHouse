import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { getIconByName } from "../utilities/icons";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

const ListarCaracteristicas = () => {
  const [Caracteristicas, setCaracteristicas] = useState([]);
  const { isLogged, token } = useAuth();
  useEffect(() => {
    fetch("http://localhost:8080/Caracteristicas", {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => res.json())
      .then((responseData) => {
        const Caracteristicas = responseData.map((caracteristica) => ({
          id: caracteristica.id,
          titulo: caracteristica.titulo,
          descripcion: caracteristica.descripcion,
          icono: caracteristica.icono,
        }));

        setCaracteristicas(Caracteristicas);
      });
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro que queres eliminar esta caracteristicas?")
    ) {
      try {
        const response = await fetch(
          `http://localhost:8080/Caracteristicas/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        setProductos((prevProductos) =>
          prevProductos.filter((prod) => prod.id !== id)
        );

        alert("La caracteristicas se eliminó correctamente.");
      } catch (error) {
        console.error("Error:", error.message);
        alert("Hubo un problema al eliminar la caracteristicas.");
      }
    } else {
      alert("Eliminacion cancelada.");
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md w-full rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Id
            </th>
            <th scope="col" className="px-6 py-3">
              titulo
            </th>
            <th scope="col" className="px-6 py-3">
              Icono
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {Caracteristicas.map((caracteristicas) => (
            <tr
              key={caracteristicas.id}
              className={`odd:bg-white even:bg-gray-50 border-b`}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {caracteristicas.id}
              </th>
              <td className="px-6 py-4">{caracteristicas.titulo}</td>
              <td className="px-6 py-4 text-colorPrimario">
                <FontAwesomeIcon
                  icon={getIconByName(caracteristicas.icono)}
                  size="lg"
                />
              </td>
              <td className="px-6 py-4 flex gap-x-2">
                <Link
                  to={`/admin/Caracteristicas/agregar/${caracteristicas.id}`}
                >
                  <button className="px-4 py-2 bg-colorPrimario text-white rounded hover:bg-colorPrimarioHover">
                    <FontAwesomeIcon icon={getIconByName("pencil")} size="lg" />
                  </button>
                </Link>

                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-400 transition-all"
                  onClick={() => handleDelete(caracteristicas.id)}
                >
                  <FontAwesomeIcon icon={getIconByName("trash")} size="lg" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarCaracteristicas;
