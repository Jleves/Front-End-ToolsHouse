import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "../utilities/icons";
import Politicas from "../Components/Politicas";
import Reseñas from "../Components/Reseñas";
import StarRating from "../Components/StarRating";
import { useAuth } from "../Context/AuthContext";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



const Detail = () => {
  const [producto, setProducto] = useState(null);
  const { id } = useParams();
  const { isLogged, token } = useAuth();
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date()); // Por defecto empieza en el día de hoy
  const [endDate, setEndDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [opinion, setOpinion] = useState('');
  const [reseñas, setReseñas] = useState([])
  

  

 
  

  const handleReserveClick = () => {
    setShowRating(true);
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
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDate.getDate()).padStart(2, '0'); 
    
    const formattedDate = `${year}-${month}-${day}`;
    console.log('fecha actual:', currentDate);
    const newReview = {
      fecha: formattedDate,
      usuario: 'Usuario', 
      raiting: rating,
      comentario: opinion,
      herramienta_id: id
    };
    console.log('Nueva reseña:', newReview);
    try {
      const response = await fetch('http://localhost:8080/Reseñas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(newReview),
      });
      console.log('Respuesta del servidor al agregar la reseña:', response);
      if (!response.ok) {
        throw new Error('Error al agregar la reseña');
      }
  
      const updatedResponse = await fetch('http://localhost:8080/Reseñas');
      console.log('Respuesta del servidor al obtener las reseñas actualizadas:', updatedResponse);
  
      if (!updatedResponse.ok) {
        throw new Error('Error al obtener las reseñas actualizadas');
      }
      const updatedData = await updatedResponse.json();
      console.log('Reseñas actualizadas:', updatedData);
      setReseñas(updatedData);
  
      
      setRating(0);
      setOpinion('');
      setShowRating(false);
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
      
    }
    
  };

  
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
  };

  

  const openPolicy = () => {
    setIsPolicyOpen(true)
  }
  const closePolicy = () => {
    setIsPolicyOpen(false)
  }


  const caracteristicas = [
    { id: 1, titulo: "Electrico", icono: "bucket",},
    {id: 2, titulo: "Manual",icono: "hammer",},
    { id: 3, titulo: "Carga rapida",icono: "carBattery",},
    {id: 4,titulo: "Repuestos",icono: "paintBrush",},
    { id: 5, titulo: "Facil agarre",icono: "trowel",},
    {id: 6, titulo: "facil Armado",icono: "powerOff",},
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
          categoria: responseData.categoria.id,
          imagenes: imagenes,
          caracteristicas: caracteristicas,
          fechaInicioReserva: '2024-04-10',
          fechaFinalReserva: '2024-04-16',
          
          
        };
        setProducto(productoData);
        if (productoData.fechaInicioReserva && productoData.fechaFinalReserva) {
          const blocked = generateBlockedDates(productoData.fechaInicioReserva, productoData.fechaFinalReserva);
          // console.log(blocked);
          setBlockedDates(blocked);
      }
      } catch (error) {
        console.error("Error haciendo el fetch:", error);
      }
    };
    const fetchReseñas = async () => {
      try {
        const response = await fetch('http://localhost:8080/Reseñas');
        if (!response.ok) {
          throw new Error('Error al obtener las reseñas');
        }
        const data = await response.json();
        setReseñas(data);
      } catch (error) {
        console.error('Error al obtener las reseñas:', error);
      }
    };
    fetchReseñas();
    fetchProducto();
  }, [id]);

  if (!producto) return <div className="text-center">Cargando...</div>;

  return (
    <div className=''>
      <div className=" px-4 pt-5 justify-between">
        <div className="flex justify-between">
          <Link to="/" className="text-colorPrimario px-4 py-2 rounded">
            <FontAwesomeIcon icon={getIconByName("back")} size="lg" /> Volver
          </Link>
        </div>
      </div>

      <div className="col-12 px-2">
        {/* Imagenes */}
        <div className="flex justify-center gap-6 flex-col md:flex-row mb-2 p-4">
  
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

      
      <button className="flex justify-center items-center gap-2 absolute bottom-6 right-6 border text-black border-black bg-white px-4 py-2 rounded-2xl hover:bg-colorPrimarioHover hover:text-white hover:border-colorPrimarioHover transition-all">
        <FontAwesomeIcon icon={getIconByName("images")} size="lg" />
        <span className="font-semibold">Ver más</span>
      </button>

    </div>
  </div>
</div>

        <div className="flex flex-col md:flex-row justify-arround py-6 px-10 gap-8">
          <div className="md:w-6/12 d-flex flex-col justify-center mr-6">
            <div className="flex items-center mb-2">
              <h5 className="font-semibold text-3xl">{producto.nombre}</h5>
            </div>
            <span className="rounded-full px-4 bg-colorSecundario text-white text-sm">
                {producto.categoria.titulo}
              </span>
            <p className="text-lg mt-2">{producto.descripcion}</p>
            <p className="font-bold text-2xl text-slate-900 mt-4">
              ${producto.precio}
            </p>
          </div>
          <div className="col-12 col-md-6 col-lg-3 p-2 md:p-4 border rounded-lg shadow-lg mt-2">
            <ul className="grid grid-cols-3 gap-4">
              {producto.caracteristicas.map((caracteristica) => (
              <li key={caracteristica.id} className="flex items-center p-2">
                <FontAwesomeIcon icon={getIconByName(caracteristica.icono)} className="mr-3 text-colorPrimario" />
                <span>{caracteristica.titulo}</span>
              </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col  justify-center md:flex-row justify-arroud py-4 px-10 gap-10 ">
          <div >
              <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()} 
              placeholderText="Fecha de inicio"
              excludeDates={blockedDates} 
              className="my-2 border mx-2 border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-blue-500"
            />
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={blockedDates.length > 0 && startDate < blockedDates[0] ? blockedDates[0] : null} 
              placeholderText="Fecha de fin"
              excludeDates={blockedDates}
              className="my-2 mx-2 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-blue-500"
            />


          </div>
          <div className="flex flex-col md:flex-row gap-4 px-4">
            
            <button 
            className="block md:inline-block justify-center  h-10 rounded-lg border-2 hover:scale-105  text-black border-colorPrimario bg-white px-4  hover:bg-colorPrimarioHover hover:text-white hover:border-colorPrimarioHover transition-all"
            onClick={openPolicy}>Políticas</button>
            {isPolicyOpen && <Politicas onClose={closePolicy} />}
            <button 
            onClick={handleReserveClick}
            className=" block md:inline-block justify-center  h-10 rounded-lg border-2 hover:scale-105  text-black border-colorPrimario bg-white px-4  hover:bg-colorPrimarioHover hover:text-white hover:border-colorPrimarioHover transition-all">
              Reserva
            </button>
            {showRating && (
                <div className="flex flex-col gap-4 px-4">
                  <div className="bg-white p-4 rounded-lg shadow-md ">
                      <h2 className="text-lg font-bold mb-4">Danos tu opinión</h2>
                      <div className="flex items-center">
                        <StarRating value={rating} onChange={handleRatingChange}/> 
                      </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <label htmlFor="opinion" className="block text-sm font-medium ">
                          Opinión:
                        </label>
                        <input type="text" id="opinion" value={opinion} onChange={handleOpinionChange} className=" my-2 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>
                    <button 
                      onClick={handleSendReview}
                      className="bg-colorPrimario text-white px-4 py-2 rounded-lg mt-4 md:mt-0 hover:bg-colorPrimarioHover focus:outline-none focus:bg-colorPrimarioHover transition-all">Enviar</button>
                  </div>
                </div>
            )}
          </div>
        </div>
        </div>
      
      <div className="col-12 col-md-6 col-lg-3 p-2 md:p-4 border rounded-lg shadow-lg mt-2">
          
          <Reseñas  reseñasProp={reseñas} raiting={rating}/>
      </div>
    </div>
  
  );
};

export default Detail;
