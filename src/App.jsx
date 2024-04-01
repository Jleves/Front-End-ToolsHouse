
import "animate.css/animate.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Routers/Home";
import Detail from "./Routers/Detail";
import Admin from "./Routers/Admin";
import ListarProductos from "./Routers/ListarProductos";
import AgregarProductos from "./Routers/AgregarProductos";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ListarUsuarios from "./Routers/ListarUsuarios";
import Resgistro from "./Routers/Registro";
import ListarCategorias from "./Routers/ListarCategorias";
import AgregarCategoria from "./Routers/AgregarCategoria";
import Login from "./Routers/Login";
import ListarCaracteristicas from "./Routers/ListarCaracteristicas";
import AgregarCaracteristica from "./Routers/AgregarCaracteristica";
import { PrivateRoute } from "./Routers/PrivateRoute";
import Favs from "./Components/Favs";
import ListarFavorito from "./Routers/ListarFavorito"

function App() {
 
  return (
    <div className="pt-16 flex flex-col min-h-screen bg-colorClaro">
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/registro" element={<Resgistro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<Admin />}>
            <Route index element={<Navigate replace to="productos/listar" />} />
            <Route path="productos/listar" element={<ListarProductos />} />
            <Route path="productos/agregar" element={<AgregarProductos />} />
            <Route path="productos/agregar/:id" element={<AgregarProductos />} />
            <Route path="usuarios/listar" element={<ListarUsuarios />} />
            <Route path="categorias/listar" element={<ListarCategorias />} />
            <Route path="categorias/agregar" element={<AgregarCategoria />} />
            <Route path="categorias/agregar/:id" element={<AgregarCategoria />} />
            <Route path="caracteristicas/listar" element={<ListarCaracteristicas />}/>
            <Route path="caracteristicas/agregar" element={<AgregarCaracteristica />}/>
            <Route path="caracteristicas/agregar/:id" element={<AgregarCaracteristica />}/>
          </Route>
        </Route>

        <Route path="*" element={<h1>Page not found - Error 404</h1>} />
        <Route path="Fav" element={<Favs/>}/>
        <Route path="ListarFavoritos" element={<ListarFavorito/>}/>
      
        </Routes>

        
      <Footer />
    </div>
  );
}

export default App;
