import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductPage from './pages/Admin/Dashboard';
import CreateProduct from './pages/Admin/CreateProduct/CreateProduct';
import Signup from './pages/Admin/AdminLoging/Signup';
import Signin from './pages/Admin/AdminLoging/Signin';

import Layout from './pages/Client/Components/Pages/Layout';
import Cart from './pages/Client/Components/Pages/Cart/Cart';
import ClientProductDetails from './pages/Client/Components/Pages/ProductDetails/ProductDetails';

import { CartProvider } from './pages/Client/Components/Pages/Cart/CartContext';

import ProductDetails from "./pages/Admin/CreateProduct/ProductDetails";
import UpdateProduct from "./pages/Admin/CreateProduct/UpdateProduct";
import ViewOrder from './pages/Admin/Orders/ViewOrder';
import SalesSummary from './pages/Admin/SalesSummary';
import ClientLogin from './pages/Client/Components/Signup/ClientLogin';
import ClientSignup from './pages/Client/Components/Signup/ClientSignup';
import TermsAndConditions from './pages/Client/Components/TermsConditions/TermsAndConditions';
import Category from './pages/Client/Components/Pages/Category/Category';
import AddressLayout from './pages/Client/Components/Pages/Address/AddressLayout';
import MyProfile from './pages/Client/Components/Pages/User/MyProfile';
import EditProfile from './pages/Client/Components/Pages/User/EditProfile';
import Orders from './pages/Client/Components/Pages/User/Orders';
import CheckoutForm from './pages/Client/Components/Pages/Checkout/CheckoutForm';

import HandlerSignup from './pages/Handler/handlerLogging/handlerSignup';
import HandlerSignin from './pages/Handler/handlerLogging/handlerSignin';
import HandlerDashboard from './pages/Handler/handlerDashboard';

function App() {
    return (
        <CartProvider>
            <Router>
                <Routes>
                    {/* Client Routes */}
                    <Route path="/" element={<Layout />} />
                    <Route path="/client-cart" element={<Cart />} />
                    <Route path="/client-product/:id" element={<ClientProductDetails />} />
                    <Route path="/client-login" element={<ClientLogin />} />
                    <Route path="/client-signup" element={<ClientSignup />} />
                    <Route path="/client-terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/client-category/:categoryName" element={<Category />} />
                    <Route path="/client-category/:Id" element={<Category />} />
                    <Route path="/client-address" element={<AddressLayout />} />
                    <Route path="/client-user-profile" element={<MyProfile />} />
                    <Route path="/client-user-profile-edit" element={<EditProfile />} />
                    <Route path="/client-user-orders" element={<Orders />} />
                    <Route path="/checkout" element={<CheckoutForm />} />

                    {/* Admin Routes */}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/Admin/ProductPage" element={<ProductPage />} />
                    <Route path="/Admin/create-product" element={<CreateProduct />} />
                    <Route path="/Admin/product/:id" element={<ProductDetails />} />
                    <Route path="/Admin/update-product/:id" element={<UpdateProduct />} />
                    <Route path="/Admin/orders" element={<ViewOrder />} />
                    <Route path="/Admin/SalesSummary" element={<SalesSummary />} />

                    {/* Handler Routes */}
                    {/* Handler Routes */}
                    <Route path="/handler/signup" element={<HandlerSignup />} />
                    <Route path="/handler/signin" element={<HandlerSignin />} />
                    <Route path="/handler/dashboard" element={<HandlerDashboard />} />
                </Routes>
            </Router>
        </CartProvider>
    );
}

export default App;