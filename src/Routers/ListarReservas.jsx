import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIconByName } from '../utilities/icons';


const ListarReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const { token } = useAuth();

   useEffect(() => {
     fetch("http://localhost:8080/User/profile", {
       method: 'GET',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
       }
     })
     .then((response) => response.json())
     .then((data) => {
       setUsuario(data);
       console.log(data);
       setReservas(data.reserva); 
       console.log(data.reserva);
     })
     .catch((error) => console.log('Error: ', error));
   }, [token]);


   const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro que quieres eliminar esta Reserva?")
    ) {
      try {
        const response = await fetch(
          `http://localhost:8080/Reservas/delete/${id}`,
          {
            method: "DELETE",
            headers:{
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        alert("La Reserva se eliminó correctamente.");
      } catch (error) {
        console.error("Error:", error.message);
        alert("Hubo un problema al eliminar la Reserva.");
      }
    } else {
      alert("Eliminacion cancelada.");
    }
  };

  const formatDate = (fecha) => {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
        
    <table className="table w-full my-4 ml-8">
    <thead className="text-left">
      <tr>
        <th scope="col">Id</th>
        <th scope="col">Herramienta</th>
        <th scope="col">Fecha Alquiler</th>
        <th scope="col">Fecha Devolución</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {reservas.map((reserva) => (
        <tr key={reserva.id}>
          <td className="py-2">{reserva.id}</td>
          <td className="py-2">{ reserva.herramientaId?.nombre}</td>
          <td className="py-2">{formatDate(reserva.fechaAlquiler)}</td>
          <td className="py-2">{formatDate(reserva.fechaDevolucion)}</td>
          <td className="px-6 py-4 flex gap-x-2">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-400 transition-all"
                  onClick={() => handleDelete(reserva.id)}
                >
                  <FontAwesomeIcon icon={getIconByName("trash")} size="lg" />
                </button>
              </td>
        </tr>
      ))}
    </tbody>
  </table>
      
  );
};

export default ListarReservas;