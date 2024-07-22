import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import CreateProduct from './pages/Admin/CreateProduct/CreateProduct';
import Signup from './pages/Admin/AdminLoging/Signup';
import Signin from './pages/Admin/AdminLoging/Signin';
import Layout from './pages/Client/Components/Pages/Layout';
import Cart from './pages/Client/Components/Pages/Cart/Cart';
import ProductDetails from './pages/Client/Components/Pages/ProductDetails/ProductDetails';




function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-product" element={<CreateProduct />} />
                <Route path="/client" element={<Layout />} />
                <Route path="/cart" element={<Cart />} />
                
                <Route path="/product/:id" element={<ProductDetails />} />
               
              
                
            </Routes>
        </Router>
    );
}

export default App;
