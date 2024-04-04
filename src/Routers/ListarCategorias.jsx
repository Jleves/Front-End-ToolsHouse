import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { getIconByName } from "../utilities/icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../Context/AuthContext";

const ListarCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const { token } = useAuth();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/Categorias/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((responseData) => {
        const categorias = responseData.map((categoria) => ({
          id: categoria.id,
          titulo: categoria.titulo,
          icono: categoria.icono,
        }));

        setCategorias(categorias);
      });
  }, []);

  useEffect(() => {
    const fetchListarProducto = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/Herramientas/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener las Herramientas");
        }
        const responseData = await response.json();
        const productosMapped = responseData.map((producto) => ({
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          categoria: producto.categoria?.id,
          caracteristicas: producto.caracteristicas
            ? producto.caracteristicas.map(
                (caracteristica) => caracteristica.titulo
              )
            : [],
          imagenes: producto.imagenes
            ? producto.imagenes.map((imagen) => imagen.url)
            : [],
        }));

        setProductos(productosMapped);
      } catch (error) {
        console.log("Error haciendo el fetch:", error);
      }
    };
    fetchListarProducto();
  }, []);

  const handleDelete = async (id) => {
    const tieneHerramientasAsociadas = productos.some(
      (producto) => producto.categoria === id
    );

    if (tieneHerramientasAsociadas) {
      toast.error(
        "No se puede eliminar la categoría porque tiene herramientas asociadas."
      );
      return;
    }

    if (window.confirm("¿Estás seguro que quieres eliminar esta categoria?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/Categorias/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        setCategorias((prevCategorias) =>
          prevCategorias.filter((prod) => prod.id !== id)
        );

        alert("La categoria se eliminó correctamente.");
      } catch (error) {
        console.error("Error:", error.message);
        alert("Hubo un problema al eliminar la categoria.");
      }
    } else {
      alert("Eliminacion cancelada.");
    }
  };

  return (
    <div className="relative overflow-x-hidden shadow-md w-full rounded-lg">
      <table className=" table w-full my-4 ml-8 text-left text-black">
        <thead className=" text-black">
          <tr>
            <th scope="col" className="py-3">
              Id
            </th>
            <th scope="col" className="py-3">
              Titulo
            </th>
            <th scope="col" className="py-3">
              Icono
            </th>
            <th scope="col" className="py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id} className={`border-b`}>
              <th
                scope="row"
                className="py-2 font-medium text-gray-900 whitespace-nowrap"
              >
                {categoria.id}
              </th>
              <td className=" py-2">{categoria.titulo}</td>
              <td className=" py-2 text-colorPrimario">
                <FontAwesomeIcon
                  icon={getIconByName(categoria.icono)}
                  size="lg"
                />
              </td>
              <td className=" py-2 flex gap-x-2">
                <Link to={`/admin/categorias/agregar/${categoria.id}`}>
                  <button className="px-4 py-2 bg-colorPrimario text-white rounded hover:bg-colorPrimarioHover">
                    <FontAwesomeIcon icon={getIconByName("pencil")} size="lg" />
                  </button>
                </Link>

                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-400 transition-all"
                  onClick={() => handleDelete(categoria.id)}
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

export default ListarCategorias;
