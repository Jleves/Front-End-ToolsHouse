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
import Rating from "../Components/Rating";
import PropTypes from "prop-types";
import Reserva from "../Components/Reserva";

const Detail = () => {
  const [producto, setProducto] = useState(null);
  const { id } = useParams();
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [opinion, setOpinion] = useState("");
  const [reseñas, setReseñas] = useState([]);
  const [toolRating, setToolRating] = useState(0);
  const { isLogged } = useAuth();
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/Herramientas/list/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
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
          caracteristicas: responseData.caracteristicas,
          fechaInicioReserva: "2024-04-10",
          fechaFinalReserva: "2024-04-16",
        };

        setProducto(productoData);
      } catch (error) {
        console.error("Error haciendo el fetch:", error);
      }
    };

    fetchResenas();

    fetchProducto();
  }, [id]);

  const fetchResenas = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/Reseñas/herramienta/${id}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener las reseñas");
      }
      const data = await response.json();

      setReseñas(data);
      getToolRating(data);
      return data;
    } catch (error) {
      console.error("Error al obtener las reseñas:", error);
    }
  };

  const getToolRating = (resenas) => {
    const count = resenas.length;
    let sumaRating = 0;
    if (count === 0) {
      return;
    }
    resenas.map((resena) => {
      sumaRating += resena?.raiting || 0;
    });
    if (sumaRating === 0) {
      return;
    }
    const rating = sumaRating / count;
    setToolRating(rating);
  };

  const handleRatingClick = (event) => {
    if (isLogged) {
      setShowRating((prevState) => !prevState);
    } else {
      toast("Tienes que loguearte para agregar una reseña.", {
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
      autor: data.nombre,
      raiting: rating,
      comentario: opinion,
      herramienta_idReseña: producto.id,
    };

    try {
      const response = await fetch("http://localhost:8080/Reseñas/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });
      toast.success("Reseña creada correctamente.");

      if (!response.ok) {
        throw new Error("Error al agregar la reseña");
      }

      await fetchResenas();

      setRating(0);
      setOpinion("");
      setShowRating(false);
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
    }
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
          const response = await fetch(`http://localhost:8080/User/profile`, {
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

  // Politicas
  const openPolicy = () => {
    setIsPolicyOpen(true);
  };
  const closePolicy = () => {
    setIsPolicyOpen(false);
  };

  if (!producto) return <div className="text-center">Cargando...</div>;

  return (
    <div className="px-3 md:px-6 lg:!px-[18em]">
      <div className=" px-4 pt-5 justify-between">
        <div className="flex justify-between">
          <Link
            to="/"
            className="underlinetext-black px-0 md:px-4 py-2 rounded"
          >
            <FontAwesomeIcon icon={getIconByName("back")} size="sm" /> Volver
          </Link>
          <Favs />
        </div>
      </div>

      <div className="col-12 px-2">
        {/* Imagenes */}
        <div className="flex justify-center gap-2 flex-col md:flex-row mb-2 p-2">
          <div className="rounded-t-xl md:rounded-l-3xl p-8 shadow w-full h-[515px] bg-white">
            <img
              src={producto.imagenes[0]}
              className="h-full w-full object-contain"
              alt={producto.nombre}
            />
          </div>
          <div className="flex m-0 md:ms-2 w-full">
            <div className="w-full flex md:flex-col md:w-full relative">
              <div className="md:flex mb-4">
                <div className="md:w-1/2 pr-2 md:pb-0 pb-2">
                  <div className="w-full p-2 shadow bg-white h-[250px]">
                    <img
                      src={producto.imagenes[1]}
                      className="h-full w-full object-contain"
                      alt={producto.nombre}
                    />
                  </div>
                </div>
                <div className="md:w-1/2 pr-2 md:pr-0 pl-0 md:pl-2 ">
                  <div className="w-full rounded-bl-3xl md:rounded-bl-sm md:rounded-tr-3xl p-2 shadow bg-white h-[250px]">
                    <img
                      src={producto.imagenes[2]}
                      className="h-full w-full object-contain"
                      alt={producto.nombre}
                    />
                  </div>
                </div>
              </div>
              <div className="md:flex">
                <div className="md:w-1/2 pr-0 md:pr-2 md:pb-0 pb-2">
                  <div className="w-full p-2 shadow bg-white h-[250px]">
                    <img
                      src={producto.imagenes[3]}
                      className="h-full w-full object-contain"
                      alt={producto.nombre}
                    />
                  </div>
                </div>
                <div className="md:w-1/2 md:pr-0 pr-0  md:pl-2 ">
                  <div className="w-full !rounded-br-3xl p-2 shadow bg-white h-[250px]">
                    <img
                      src={producto.imagenes[4]}
                      className="h-full w-full object-contain"
                      alt={producto.nombre}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between py-6 px-2 gap-8">
          <div className="md:w-6/12 flex flex-col justify-between mr-6 gap-4">
            <div>
              <div className="flex items-center mb-2 gap-4">
                <h5 className="font-bold text-2xl">{producto.nombre}</h5>
                <span className="rounded-full px-2 py-1 bg-black text-white text-xs">
                  {producto.categoria.titulo}
                </span>
                <Rating rating={toolRating} />
              </div>
              <p className="text-lg mt-2">{producto.descripcion}</p>
            </div>
            <div className="col-12 col-md-6 col-lg-3 py-2 md:py-4 mt-2 border-t border-gray-300">
              <h2 className="mb-4 mt-2 font-semibold text-lg">
                Características del producto
              </h2>
              <ul className="grid grid-cols-2">
                {producto.caracteristicas.map((caracteristica) => (
                  <li
                    key={caracteristica.id}
                    className="flex items-center p-2 text-xs md:text-sm"
                  >
                    <FontAwesomeIcon
                      icon={getIconByName(caracteristica.icono)}
                      className="mr-3 text-colorPrimario bg-gray-300 p-1 w-4 rounded-md"
                    />
                    <span>{caracteristica.titulo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="px-6 py-4 border border-gray-[#DDDDDD] rounded-xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white h-fit">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-2xl text-slate-900 my-4">
                ${producto.precio} USD
                <span className="font-normal text-xl"> / dia</span>
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  className="block md:inline-block justify-center h-10 rounded-lg border hover:border-gray-500  border-gray-400  text-gray-700 px-4 hover:bg-gray-500 hover:text-gray-100 transition-all"
                  onClick={openPolicy}
                >
                  Políticas
                </button>
                {isPolicyOpen && <Politicas onClose={closePolicy} />}
              </div>
            </div>

            <Reserva precio={producto.precio} producto={producto} />
          </div>
        </div>
      </div>

      <div className=" py-4 mt-8 flex flex-col gap-4 px-4">
        <div className="flex w-full items-center justify-between border-t border-gray-300 pt-4">
          <h2 className="mb-2 font-semibold text-lg">Reseñas</h2>
          <button
            onClick={handleRatingClick}
            className="relative flex items-center mx-0 md:mx-4 md:inline-block justify-center  h-10 rounded-lg  text-white border-colorPrimario bg-black px-4 hover:bg-colorPrimario hover:text-white transition-all"
          >
            <span className="flex items-center">
              Danos tu Opinion
              <svg
                className="w-2.5 h-2.5 ms-2"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </span>
            <div className="absolute -right-14 top-12 flex flex-col md:flex-row gap-4 px-4"  onClick={(event) => event.stopPropagation()} >
              {showRating && isLogged && (
                <div className="flex flex-col gap-2 px-4">
                  <div className="bg-white p-4 rounded-lg shadow-md ">
                    <div className="flex justify-center items-center">
                      <StarRating
                        value={rating}
                        onChange={handleRatingChange}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <textarea
                          type="text"
                          id="opinion"
                          autoComplete="off"
                          value={opinion}
                          onChange={handleOpinionChange}
                          className=" my-2 border text-black text-sm border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-blue-500"
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
          </button>
        </div>
        <Reseñas reseñasProp={reseñas} raiting={rating} />
      </div>
    </div>
  );
};

Reserva.propTypes = {
  producto: PropTypes.object.isRequired,
};

export default Detail;
