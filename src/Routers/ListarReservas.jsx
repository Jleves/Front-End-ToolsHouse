import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';



const ListarReservas = () => {

    const [ reservas, setReservas ] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        fetch("http://localhost:8080/Reservas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((responseData) => {
            const reservas = responseData.map((reserva) => ({
              id: reserva.id,
              herramientaId: reserva.herramientaId,
              reserva: reserva.reserva,
              fechaAlquiler: reserva.fechaAlquiler,
              fechaDevolucion: reserva.fechaDevolucion
            }));
    
            setReservas(reservas);
            console.log(reservas);
          });
      }, []);

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
          <th scope="col">Nombre</th>
          <th scope="col">Fecha Alquiler</th>
          <th scope="col">Fecha Devolución</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {reservas.map((reserva) => (
          <tr key={reserva.id}>
            <td className="py-2">{reserva.id}</td>
            <td className="py-2">{reserva.herramientaId}</td>
            <td className="py-2">{formatDate(reserva.fechaAlquiler)}</td>
            <td className="py-2">{formatDate(reserva.fechaDevolucion)}</td>
            
          </tr>
        ))}
      </tbody>
    </table>
        
    );
};

export default ListarReservas;