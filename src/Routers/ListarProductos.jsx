import { useEffect, useState } from 'react';

const ListarProductos = () => {

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products?limit=10')
        .then((res) => res.json())
        .then((productos) => {
            
            const productosApiFake = productos.map((producto) => ({
                ...producto,
                images: [producto.image, producto.image, producto.image, producto.image, producto.image],
                category: {
                  id: producto.category,
                  name: producto.category,
                  image: ['https://fakestoreapi.com/img/71-3HjGNDUL.AC_SY879._SX._UX._SY._UY.jpg'],
                }
            }));
            console.log('productosApiFake =>', productosApiFake);
            setProductos(productosApiFake)
        });
    }, []);

    const handleEdit = (id) => {
        console.log(`Editar producto con id ${id}`)
    };

    const handleDelete = (id) => {
        
        console.log(`Eliminar producto con id ${id}`);
      };

    return (
       
        <table className="table table-hover table-striped table-bordered  my-0" >
            <thead className="thead-dark" >
                <tr >
                    <th scope="col">Id</th >
                    <th scope="col">Nombre</th>
                    <th scope="col">Categoría</th>
                </tr>
            </thead>
            <tbody className="table-group-divider">
                {productos.map(producto => (
                <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>{producto.title}</td>
                    <td>{producto.category.name}</td>
                    <td className='d-flex flex-row justify-content-around'>
                        <button className="btn btn-outline-primary" onClick={() => handleEdit(producto.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                            </svg> 
                        </button>
                        <button className="btn btn-outline-danger " onClick={() => handleDelete(producto.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                            </svg>
                        </button>
                        
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
  
    );
};

export default ListarProductos;