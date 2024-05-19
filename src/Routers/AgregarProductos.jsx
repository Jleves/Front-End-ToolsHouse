import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../Context/AuthContext";
import { useParams } from "react-router-dom";

const AgregarProductos = () => {
  const [productData, setProductData] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    stock: 0,
    precio: 0,
    categoria: {
      id: "",
      titulo: "Seleccione categoría",
    },
    disponibilidad: "",
    caracteristicas: [],
    imageUrls: Array(1).fill({ url: "" }),
  });
  const { token } = useAuth();
  const { id } = useParams();
  const [categorias, setCategorias] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`https://ec2-54-145-44-94.compute-1.amazonaws.com/Herramientas/list/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProductData({
            id: data.id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            stock: data.stock,
            precio: data.precio,
            categoria: data.categoria,
            caracteristicas: data.caracteristicas,
            imageUrls: data.imagenes || [],
          });
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error.message);
          toast.error(
            `Ha ocurrido un problema al obtener la Herramienta. ${error.message}`
          );
        });
    }
  }, [id]);

  const isFieldEmpty = (fieldName) => !productData[fieldName];
  const isAllFieldsNonEmpty = () =>
    !(
      isFieldEmpty("nombre") ||
      isFieldEmpty("descripcion") ||
      isFieldEmpty("stock") ||
      isFieldEmpty("precio") ||
      isFieldEmpty("categoria")
    );

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleCheckboxChange = (id, checked) => {
    console.log("handleCheckboxChange");

    setProductData((prevData) => {
      const existeCaracteristica = prevData.caracteristicas.some(
        (caracteristica) => caracteristica.id == id
      );
      console.log(prevData.caracteristicas);
      console.log(id, checked);
      console.log(existeCaracteristica);
      if (checked && !existeCaracteristica) {
        const newCaracteristica = caracteristicas.find(
          (caracteristica) => caracteristica.id == id
        );
        const result = {
          ...prevData,
          caracteristicas: [...prevData.caracteristicas, newCaracteristica],
        };
        console.log(result);
        return result;
      }

      if (!checked && existeCaracteristica) {
        const result = {
          ...prevData,
          caracteristicas: [
            ...prevData.caracteristicas.filter(
              (caracteristica) => caracteristica.id != id
            ),
          ],
        };
        console.log(result);
        return result;
      }

      return prevData;
    });
  };

  const handleCheckboxInputChange = (e) => {
    console.log("handleCheckboxInputChange");
    console.log(e);
    const { value, checked } = e.target;
    console.log(value, checked);

    handleCheckboxChange(value, checked);
  };
  const handleImageUrlChange = (index, event) => {
    const inputValue = event.target.value.trim();

    if (inputValue === "") {
      return;
    }
    const updatedUrls = [...productData.imageUrls];
    updatedUrls[index] = { url: inputValue };
    setProductData((prevState) => ({
      ...prevState,
      imageUrls: updatedUrls,
    }));
  };

  const handleAddImageUrl = () => {
    setProductData((prevData) => ({
      ...prevData,
      imageUrls: [...prevData.imageUrls, ""],
    }));
  };

  const handleRemoveImageUrl = (index) => {
    const updatedUrls = [...productData.imageUrls];
    updatedUrls.splice(index, 1);
    setProductData((prevData) => ({ ...prevData, imageUrls: updatedUrls }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isAllFieldsNonEmpty()) {
      toast.error(
        "Hay campos vacios, rellena todos para poder agregar el producto."
      );
      return;
    }

    if (productData.imageUrls.length < 5) {
      toast.error("Mínimo 5 imagenes.");
      return;
    }

    if (id) {
      console.log(id);

      const prueba = {
        id: productData.id,
        categoria: productData.categoria,
        stock: productData.stock,
        precio: productData.precio,
        disponibilidad: true,
        nombre: productData.nombre,
        descripcion: productData.descripcion,
        caracteristicas: productData.caracteristicas,
        imagenes: productData.imageUrls.filter((url) => url !== ""),
      };
      console.log("Envio estoooooo ", prueba);

      try {
        const response = await fetch(
          "https://ec2-54-145-44-94.compute-1.amazonaws.com/Herramientas/update",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: productData.id,
              categoria: productData.categoria,
              stock: productData.stock,
              precio: productData.precio,
              disponibilidad: true,
              nombre: productData.nombre,
              descripcion: productData.descripcion,
              caracteristicas: productData.caracteristicas,
              imagenes: productData.imageUrls.filter((url) => url !== ""),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.text();
        console.log("Success:", responseData);
        toast.success("Se ha actualizado exitosamente el producto!");
      } catch (error) {
        console.error("Error:", error.message);
        toast.error(
          "Ha ocurrido un problema al actualizar el producto.",
          error.message
        );
      }
    } else {
      try {
        const response = await fetch(
          "https://ec2-54-145-44-94.compute-1.amazonaws.com/Herramientas/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              categoria: productData.categoria,
              stock: productData.stock,
              precio: productData.precio,
              disponibilidad: true,
              nombre: productData.nombre,
              descripcion: productData.descripcion,
              caracteristicas: productData.caracteristicas,
              imagenes: productData.imageUrls.filter((url) => url !== ""),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Success:", responseData);
        toast.success("Se ha agregado exitosamente el producto!");
      } catch (error) {
        console.error("Error:", error.message);
        toast.error(
          "Ha ocurrido un problema al crear el nuevo producto.",
          error.message
        );
      }
    }
  };

  useEffect(() => {
    fetch("https://ec2-54-145-44-94.compute-1.amazonaws.com/Categorias/list", {
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
  console.log(categorias);

  useEffect(() => {
    fetch("https://ec2-54-145-44-94.compute-1.amazonaws.com/Caracteristicas/list", {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((responseData) => {
        const caracteristicas = responseData.map((caracteristica) => ({
          id: caracteristica.id,
          titulo: caracteristica.titulo,
          icono: caracteristica.icono,
        }));

        setCaracteristicas(caracteristicas);
      });
  }, []);

  return (
    <div className="mx-auto p-8 w-full">
      {/* <h3>Agregar Producto</h3> */}
      <form onSubmit={handleFormSubmit} className="w-full">
        <div className="flex flex-row justify-around gap-8">
          <div className="bg-colorPrimario rounded-xl p-8 w-1/2">
            <h5 className="text-white text-lg font-semibold mb-2">
              Informacion del Producto
            </h5>
            <div className="bg-colorSecundario text-white rounded-xl p-4">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                className="p-2 rounded-lg my-2 w-full text-black"
                id="nombre"
                placeholder="Nombre del producto"
                value={productData.nombre}
                onChange={handleInputChange}
              />
              <label htmlFor="descripcion">Descripcion</label>
              <input
                type="text"
                className="p-2 rounded-lg my-2 w-full text-black"
                id="descripcion"
                placeholder="Descripcion del producto"
                value={productData.descripcion}
                onChange={handleInputChange}
              />
            </div>
            <br />

            <h5 className="text-white text-lg font-semibold mb-2">
              Informacion Adicional
            </h5>
            <div className="bg-colorSecundario text-white rounded-xl p-4">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                className="p-2 rounded-lg my-2 w-full text-black"
                id="stock"
                placeholder="Cantidad de stock.."
                value={productData.stock}
                onChange={handleInputChange}
              />
              <label htmlFor="precio">Precio</label>
              <input
                type="number"
                className="p-2 rounded-lg my-2 w-full text-black"
                id="precio"
                placeholder="50$"
                value={productData.precio}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="bg-colorPrimario rounded-xl p-8 w-1/2">
            <h5 className="text-white text-lg font-semibold mb-2">Categoria</h5>
            <div className="bg-colorSecundario text-white rounded-xl p-4">
              <label htmlFor="categoria">Categoria del producto</label>
              <select
                className="p-2 rounded-lg my-2 w-full text-black"
                id="categoria"
                value={productData.categoria.id}
                onChange={handleInputChange}
              >
                <option hidden>Seleccionar...</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.titulo}
                  </option>
                ))}
              </select>
            </div>

            <br />

            <h5 className="text-white text-lg font-semibold mb-2">
              Características
            </h5>
            <div className="bg-colorSecundario text-white rounded-xl p-4">
              <label>Opciones:</label>
              {caracteristicas.map((caracteristica) => (
                <div key={caracteristica.id}>
                  <input
                    type="checkbox"
                    id={`opcion${caracteristica.id}`}
                    name="caracteristicas"
                    value={caracteristica.id}
                    checked={productData.caracteristicas
                      .map((item) => item.id)
                      .includes(caracteristica.id)}
                    onChange={handleCheckboxInputChange}
                  />
                  <label htmlFor={`opcion${caracteristica.id}`}>
                    {caracteristica.titulo}
                  </label>
                </div>
              ))}
            </div>

            <h5 className="text-white text-lg font-semibold mb-2">Imagenes</h5>
            <div className="bg-colorSecundario text-white rounded-xl p-4">
              {productData.imageUrls.map((imgObj, index) => (
                <div key={index} className="flex flex-row items-center gap-4">
                  <input
                    type="text"
                    className="p-2 rounded-lg my-2 w-full text-black"
                    placeholder={`URL de la imagen ${index + 1}`}
                    value={imgObj.url || ""}
                    onChange={(event) => handleImageUrlChange(index, event)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImageUrl(index)}
                    className="border-2 border-gray-400 px-2 py-1 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash3-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="border-1 bg-colorPrimario border-gray-400 p-2 text-sm rounded-md w-full mt-2"
              >
                + Agregar Nueva URL de Imagen
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            type="button"
            className="bg-red-500 text-white px-8 py-2 rounded-md"
          >
            Descartar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-colorPrimario text-white rounded hover:colorPrimarioHover"
          >
            {id ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarProductos;
