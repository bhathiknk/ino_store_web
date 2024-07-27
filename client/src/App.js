import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductPage from './pages/Admin/Dashboard';
import CreateProduct from './pages/Admin/CreateProduct/CreateProduct';
import Signup from './pages/Admin/AdminLoging/Signup';
import Signin from './pages/Admin/AdminLoging/Signin';
import ProductDetails from "./pages/Admin/CreateProduct/ProductDetails";
import UpdateProduct from "./pages/Admin/CreateProduct/UpdateProduct";
import ViewOrder from './pages/Admin/Orders/ViewOrder';
import SalesSummary from './pages/Admin/SalesSummary'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/Admin/ProductPage" element={<ProductPage />} />
                <Route path="/Admin/create-product" element={<CreateProduct />} />
                <Route path="/Admin/product/:id" element={<ProductDetails />} />
                <Route path="/Admin/update-product/:id" element={<UpdateProduct />} />
                <Route path="/Admin/orders" element={<ViewOrder />} />
                <Route path="/Admin/SalesSummary" element={<SalesSummary />} />
            </Routes>
        </Router>
    );
}

export default App;
