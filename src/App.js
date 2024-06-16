import './App.css';
import Nav from './Components/Nav';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer';
import Signup from './Components/Signup';
import PrivateComponent from './Components/privatecomponent';
import Login from './Components/login';
import Addproduct from './Components/Addproduct';
import ProductList from './Components/productlist'; // Ensure correct import here
import UpdateProduct from './Components/UpdateProduct';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          {/* Define which routes should use the PrivateComponent */}
          <Route element={<PrivateComponent />}>
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
            <Route path="/products" element={<ProductList />} /> {/* Use ProductList component */}
            <Route path="/add-products" element={<Addproduct />} />
            <Route path="/update-products/:productId" element={<UpdateProduct />} />            <Route path="/profile" element={<h1>Profile</h1>} />
          </Route>
          {/* Public route */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
