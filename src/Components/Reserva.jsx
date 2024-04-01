import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import DatePicker from "react-datepicker";
import { toast } from "sonner";
import PropTypes from "prop-types";

const Reserva = ({ precio, producto }) => {
  const [blockedDates, setBlockedDates] = useState([]);
  const { isLogged } = useAuth();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);

  const [totalCost, setTotalCost] = useState(0);
  const [diferenciaDias, setDiferenciaDias] = useState(0);

  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);

  const firstName = data?.nombre ? data.nombre.split(" ")[0] : "";
  const lastName = data?.apellido ? data.apellido.split(" ")[0] : "";
  const firstLetterFirstName = firstName ? firstName.charAt(0) : "";
  const firstLetterLastName = lastName ? lastName.charAt(0) : "";

  const closeConfirmation = () => {
    setConfirmationOpen(false);
    document.body.classList.remove("modal-open");
  };

  const openConfirmation = () => {
    setConfirmationOpen(true);
    document.body.classList.add("modal-open");
  };

  const productoData = {
    fechaInicioReserva: "",
    fechaFinalReserva: "",
  };

  useEffect(() => {
    if (productoData.fechaInicioReserva && productoData.fechaFinalReserva) {
      const blocked = generateBlockedDates(
        productoData.fechaInicioReserva,
        productoData.fechaFinalReserva
      );
      setBlockedDates(blocked);
    }
  }, []);

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

  const generateBlockedDates = (inicioReserva, finReserva) => {
    const datesInRange = [];
    const currentDate = new Date(inicioReserva);
    const endDate = new Date(finReserva);
    endDate.setDate(endDate.getDate() + 1);
    while (currentDate < endDate) {
      datesInRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return datesInRange;
  };

  const handleReserveClick = () => {
    if (isLogged && endDate) {
      openConfirmation();
    } else if (isLogged && !endDate) {
      toast.error("Selecciona una fecha de fin de reserva.", {});
    } else {
      toast.error("Tenes que loguearte para hacer una reserva.", {
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

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && endDate.getTime() < date.getTime()) {
      setEndDate(null);
    }

    if (blockedDates.length > 0 && date < blockedDates[0]) {
      let lastValidDate = new Date(blockedDates[0]);
      lastValidDate.setDate(lastValidDate.getDate() - 1);
      if (lastValidDate < date) {
        setEndDate(lastValidDate);
      } else {
        setEndDate(null);
      }
    }
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const differenceInMs = endOfDay.getTime() - startDate.getTime();
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
    const calculatedCost = precio * differenceInDays;
    setTotalCost(calculatedCost);
    setDiferenciaDias(differenceInDays);
  };

  const handleReservation = async () => {
    try {
      if (!isLogged) {
        toast.error("Tenes que loguearte para hacer una reserva.", {
          classNames: {
            actionButton: "!bg-colorPrimario",
          },
          action: {
            label: "Log In",
            onClick: () => location.assign("/login"),
          },
        });
        return;
      }

      const herramientaId = {
        id: parseInt(window.location.pathname.split("/").pop()),
      };
      const fechaAlquiler = startDate.toISOString();
      const fechaDevolucion = endDate.toISOString();
      const usuarioId = {
        id: data.id,
        usuarioRole: data.role,
      };

      const response = await fetch("http://localhost:8080/Reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fechaAlquiler: fechaAlquiler,
          fechaDevolucion: fechaDevolucion,
          herramientaId: herramientaId,
          usuarioId: usuarioId,
        }),
      });

      console.log(herramientaId);

      if (!response.ok) {
        toast.error(
          `Error al realizar la reserva. Por favor, intenta de nuevo más tarde ${response.status}.`
        );
      }
      toast.success("Reserva realizada con éxito.");
      closeConfirmation();
    } catch (error) {
      toast.error(
        "Error al realizar la reserva. Por favor, intenta de nuevo más tarde."
      );
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="dateselector flex flex-col md:flex-row items-center w-full">
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            placeholderText="Fecha de inicio"
            excludeDates={blockedDates}
            className="border  w-full border-gray-300 border-r-0 rounded-tl-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={
              blockedDates.length > 0 && startDate < blockedDates[0]
                ? blockedDates[0]
                : null
            }
            placeholderText="Fecha de fin"
            excludeDates={blockedDates}
            className="border w-full border-gray-300 rounded-tr-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleReserveClick}
          className=" block md:inline-block justify-center py-2 rounded-b-lg border border-t-0 text-black bg-white px-4 hover:bg-colorPrimarioHover hover:text-white transition-all w-full"
        >
          Reservar
        </button>

        {isConfirmationOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-white p-8 rounded-lg w-4/5 max-w-xl overflow-y-h max-h-90 mt-14">
              <h2 className="text-2xl font-bold mb-4 decoration-solid">
                Confirmacion de Reserva
              </h2>
              <ul className="mb-4 flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-colorPrimario rounded-full">
                    <span className="font-light text-base text-colorClaro ">
                      {firstLetterFirstName + firstLetterLastName}
                    </span>
                  </div>
                  <p className="text-xl">
                    {data.nombre} {data.apellido}
                  </p>
                </li>
                <li className="bg-slate-200 px-4 py-4 rounded-2xl my-2 flex items-start gap-4">
                  <div>
                    <img
                      src={producto.imagenes[0]}
                      alt={producto.nombre}
                      className="w-[10em] rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <span className="font-semibold">{producto.nombre}</span>
                    <p className="fs-6 card-text text-secondary">
                      {producto.descripcion.substring(0, 100)}
                      {producto.descripcion.length > 30 ? "..." : ""}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="flex items-center justify-between gap-2 w-full my-2">
                    <span>Fecha de alquiler: </span>
                    <div>
                      <span>{startDate.toLocaleDateString()} -</span>
                      <span>{endDate ? endDate.toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                </li>
                <li>
                  <p className="text-md flex justify-between">
                    <span>Alquiler de {diferenciaDias} dias</span>
                    <span>${precio} USD / dia</span>
                  </p>
                  <p className="text-md flex justify-between">
                    <span>Comision</span>
                    <span>$0 USD</span>
                  </p>
                  <div className="w-full border-b border-gray-300 h-2"></div>
                  <p className="font-bold flex justify-between mt-4 text-xl">
                    <span>Total:</span>
                    <span> ${totalCost.toFixed(2)}</span>
                  </p>
                </li>

                <li className="mt-6">
                  <p className="text-gray-700 text-sm">
                    * Un email de confirmacion se va a enviar a {data.username}
                  </p>
                </li>
              </ul>

              <div className="flex justify-end gap-4">
                <button
                  onClick={closeConfirmation}
                  className="w-1/2 mt-4 text-black border px-4 py-2 rounded hover:underline transition ease"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReservation}
                  className="bg-colorPrimario w-full mt-4 text-white px-4 py-2 rounded hover:bg-colorPrimarioHover transition ease"
                >
                  Reservar
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="w-full my-4">
          <p className="text-md">
            <span className="underline">
              ${precio} USD por {diferenciaDias} dias
            </span>
            <span> ${totalCost.toFixed(2)}</span>
          </p>
          <p className="text-md">
            <span className="underline">Comision </span>
            <span>$0 USD</span>
          </p>
        </div>
      </div>
    </>
  );
};

Reserva.propTypes = {
  precio: PropTypes.number.isRequired,
  producto: PropTypes.isRequired,
};

export default Reserva;
