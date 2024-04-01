import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "../utilities/icons";
import Politicas from "../Components/Politicas";
import Reseñas from "../Components/Reseñas";
import StarRating from "../Components/StarRating";
import { useAuth } from "../Context/AuthContext";
import "react-datepicker/dist/react-datepicker.css";
import Favs from "../Components/Favs";
import { toast } from "sonner";

import Reserva from "../Components/Reserva";

const Detail = () => {
  const [producto, setProducto] = useState(null);
  const { id } = useParams();
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [opinion, setOpinion] = useState("");
  const [reseñas, setReseñas] = useState([]);
  const { isLogged } = useAuth();

  const caracteristicas = [
    { id: 1, titulo: "Electrico", icono: "bucket" },
    { id: 2, titulo: "Manual", icono: "hammer" },
    { id: 3, titulo: "Carga rapida", icono: "carBattery" },
    { id: 4, titulo: "Repuestos", icono: "paintBrush" },
    { id: 5, titulo: "Facil agarre", icono: "trowel" },
    { id: 6, titulo: "facil Armado", icono: "powerOff" },
  ];

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/Herramientas/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              //'Authorization': `Bearer ${token}`
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener la Herramienta");
        }
        const responseData = await response.json();
        const imagenes = responseData.imagenes
          ? responseData.imagenes.map((imagen) => imagen.url)
          : [];
        const productoData = {
          id: responseData.id,
          nombre: responseData.nombre,
          descripcion: responseData.descripcion,
          precio: responseData.precio,
          categoria: responseData.categoria,
          imagenes: imagenes,
          caracteristicas: caracteristicas,
          fechaInicioReserva: "2024-04-10",
          fechaFinalReserva: "2024-04-16",
        };

        setProducto(productoData);
      } catch (error) {
        console.error("Error haciendo el fetch:", error);
      }
    };

    fetchProducto();
  }, [id]);

  const handleRatingClick = () => {
    if (isLogged) {
      setShowRating(true);
    } else {
      toast("Tenes que loguearte para agregar una reseña.", {
        classNames: {
          actionButton: "!bg-colorPrimario",
        },
        action: {
          label: "Log In",
          onClick: () => location.assign("/login"),
        },
      });
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleOpinionChange = (event) => {
    setOpinion(event.target.value);
  };

  const handleSendReview = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    const newReview = {
      fecha: formattedDate,
      raiting: rating,
      comentario: opinion,
      herramienta_idReseña: producto.id,
      id: producto.id,
    };

    console.log("Nueva reseña:", newReview);
    try {
      const response = await fetch("http://localhost:8080/Reseñas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      console.log("Respuesta del servidor al agregar la reseña:", response);
      if (!response.ok) {
        throw new Error("Error al agregar la reseña");
      }

      const updatedResponse = await fetch("http://localhost:8080/Reseñas");
      console.log(
        "Respuesta del servidor al obtener las reseñas actualizadas:",
        updatedResponse
      );

      if (!updatedResponse.ok) {
        throw new Error("Error al obtener las reseñas actualizadas");
      }
      const updatedData = await updatedResponse.json();
      console.log("Reseñas actualizadas:", updatedData);
      setReseñas([...reseñas, newReview]);

      setRating(0);
      setOpinion("");
      setShowRating(false);
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
    }
  };

  // Politicas
  const openPolicy = () => {
    setIsPolicyOpen(true);
  };
  const closePolicy = () => {
    setIsPolicyOpen(false);
  };

  if (!producto) return <div className="text-center">Cargando...</div>;

  return (
    <div className="px-5 md:px-8 lg:!px-[18em] ">
      <div className=" px-4 pt-5 justify-between">
        <div className="flex justify-between">
          <Link to="/" className="text-colorPrimario px-4 py-2 rounded">
            <FontAwesomeIcon icon={getIconByName("back")} size="lg" /> Volver
          </Link>
        </div>
      </div>

      <div className="col-12 px-2">
        {/* Imagenes */}
        <div className="flex justify-center gap-2 flex-col md:flex-row mb-2 p-4">
          <div className="!rounded-l-3xl p-8 shadow w-full h-[515px] bg-white">
            <img
              src={producto.imagenes[0]}
              className="h-full w-full object-contain"
              alt={producto.nombre}
            />
          </div>
          <div className="flex m-0 md:ms-2 w-full">
            <div className="w-full flex md:flex-col md:w-full relative">
              <div className="md:flex mb-4">
                <div className="md:w-1/2 pr-2">
                  <div className="w-full p-2 shadow bg-white h-[250px]">
                    <img
                      src={producto.imagenes[1]}
                      className="h-full w-full object-contain"
                      alt={producto.nombre}
                    />
                  </div>
                </div>
                <div className="md:w-1/2 pl-2">
                  <div className="w-full !rounded-tr-3xl p-2 shadow bg-white h-[250px]">
                    <img
                      src={producto.imagenes[2]}
                      className="h-full w-full object-contain"
                      alt={producto.nombre}
                    />
                  </div>
                </div>
              </div>
              <div className="md:flex">
                <div className="md:w-1/2 pr-2">
                  <div className="w-full p-2 shadow bg-white h-[250px]">
                    <img
                      src={producto.imagenes[3]}
                      className="h-full w-full object-contain"
                      alt={producto.nombre}
                    />
                  </div>
                </div>
                <div className="md:w-1/2 pl-2">
                  <div className="w-full !rounded-br-3xl p-2 shadow bg-white h-[250px]">
                    <img
                      src={producto.imagenes[4]}
                      className="h-full w-full object-contain"
                      alt={producto.nombre}
                    />
                  </div>
                </div>
              </div>

              <div className="flex">
                <button className="flex justify-center items-center gap-2 absolute bottom-6 right-6 border text-black border-black bg-white px-4 py-2 rounded-2xl hover:bg-colorPrimarioHover hover:text-white hover:border-colorPrimarioHover transition-all">
                  <FontAwesomeIcon icon={getIconByName("images")} size="lg" />
                  <span className="font-semibold">Ver más</span>
                </button>
                <Favs />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between py-6 px-4 gap-8">
          <div className="md:w-6/12 flex flex-col justify-between mr-6">
            <div>
              <div className="flex items-center mb-2 gap-4">
                <h5 className="font-bold text-2xl">{producto.nombre}</h5>
                <span className="rounded-full px-2 py-1 bg-black text-white text-xs">
                  {producto.categoria.titulo}
                </span>
              </div>
              <p className="text-lg mt-2">{producto.descripcion}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                className="block md:inline-block justify-center h-10 rounded-lg border  text-black border-colorPrimario bg-white px-4  hover:bg-colorPrimarioHover hover:text-white hover:border-colorPrimarioHover transition-all"
                onClick={openPolicy}
              >
                Políticas
              </button>
              {isPolicyOpen && <Politicas onClose={closePolicy} />}
            </div>
          </div>

          <div className="px-6 py-4 border border-gray-[#DDDDDD] rounded-xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white">
            <p className="font-semibold text-2xl text-slate-900 my-4">
              ${producto.precio} USD
              <span className="font-normal text-xl"> / dia</span>
            </p>
            <Reserva precio={producto.precio} producto={producto} />
          </div>

          {/* <div className="col-12 col-md-6 col-lg-3 p-2 md:p-4 border rounded-lg shadow-lg mt-2">
            <ul className="grid grid-cols-3 gap-4">
              {producto.caracteristicas.map((caracteristica) => (
                <li
                  key={caracteristica.id}
                  className="flex items-center p-2 text-xs md:text-base"
                >
                  <FontAwesomeIcon
                    icon={getIconByName(caracteristica.icono)}
                    className="mr-3 text-colorPrimario"
                  />
                  <span>{caracteristica.titulo}</span>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>

      <div className="border rounded-lg shadow-lg mx-6 py-4 mt-8 flex flex-col gap-4 px-4">
        <Reseñas reseñasProp={reseñas} raiting={rating} idProducto={id} />
        <button
          onClick={handleRatingClick}
          className=" block md:inline-block justify-center h-10 rounded-lg border-2 text-black border-colorPrimario bg-white px-4  hover:bg-colorPrimarioHover hover:text-white hover:border-colorPrimarioHover transition-all"
        >
          Agregar Reseña
        </button>

        {showRating && isLogged && (
          <div className="flex flex-col gap-4 px-4">
            <div className="bg-white p-4 rounded-lg shadow-md ">
              <h2 className="text-lg font-bold mb-4">Danos tu opinión</h2>
              <div className="flex items-center">
                <StarRating value={rating} onChange={handleRatingChange} />
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <label
                    htmlFor="opinion"
                    className="block text-sm font-medium "
                  >
                    Opinión:
                  </label>
                  <textarea
                    type="text"
                    id="opinion"
                    autoComplete="off"
                    value={opinion}
                    onChange={handleOpinionChange}
                    className=" my-2 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleSendReview}
                className="bg-colorPrimario text-white px-4 py-2 rounded-lg mt-4 md:mt-0 hover:bg-colorPrimarioHover focus:outline-none focus:bg-colorPrimarioHover transition-all"
              >
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
