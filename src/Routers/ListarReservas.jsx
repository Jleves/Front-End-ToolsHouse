import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "../utilities/icons";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ListarReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetch("https://ec2-54-145-44-94.compute-1.amazonaws.com/User/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsuario(data);
        console.log(usuario);

        setReservas(data.reserva);
      })
      .catch((error) => console.log("Error: ", error));
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro que quieres eliminar esta Reserva?")) {
      try {
        const response = await fetch(
          `https://ec2-54-145-44-94.compute-1.amazonaws.com/Reservas/delete/${id}`,
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
        setReservas((prevReservas) =>
          prevReservas.filter((reser) => reser.id !== id)
        );

        setReservas(reservas.filter((reserva) => reserva.id !== id));
        toast.success(`La Reserva se eliminó correctamente.`);
      } catch (error) {
        console.error("Error:", error.message);
        toast.error(`Hubo un problema al eliminar la Reserva.`);
      }
    } else {
      toast.error(`Eliminacion cancelada.`);
    }
  };

  const formatDate = (fecha) => {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  return (
    <section className="text-gray-600 body-font bg-[#fffdf3] h-fit">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -m-2">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Reservas
            </h1>
            {reservas.length === 0 ? (
              <div className="flex flex-col items-center w-full gap-2  mt-14">
                <img src="/noReserves.svg" alt="" />
                <p className="lg:w-2/3 text-center font-semibold text-xl mx-auto leading-relaxed">
                  No tenes ninguna reserva.
                </p>
                <Link to={`/`}>
                  <button className="mt-16 px-2 md:px-4 py-2 bg-colorPrimario text-xs md:text-base  text-white rounded hover:bg-colorPrimarioHover flex items-center gap-2">
                    Ir al Home
                  </button>
                </Link>
              </div>
            ) : (
              <table className="table w-full my-4 ml-8">
                <thead className="text-left">
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Herramienta</th>
                    <th scope="col">Fecha Alquiler</th>
                    <th scope="col">Fecha Devolución</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-left divide-gray-200">
                  {reservas
                    .sort((a, b) => a.id - b.id)
                    .map((reserva) => (
                      <tr key={reserva.id}>
                        <td className="py-2 px-2">{reserva.id}</td>
                        <td className="py-2 px-2">
                          {reserva.herramientaId.nombre}
                        </td>
                        <td className="py-2 px-2">
                          {formatDate(reserva.fechaAlquiler)}
                        </td>
                        <td className="py-2 px-2">
                          {formatDate(reserva.fechaDevolucion)}
                        </td>
                        <td className="pr-6 py-2 flex gap-x-2">
                          <button
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-400 transition-all"
                            onClick={() => handleDelete(reserva.id)}
                          >
                            <FontAwesomeIcon
                              icon={getIconByName("trash")}
                              size="sm"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListarReservas;
