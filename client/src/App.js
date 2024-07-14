import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import CreateProduct from './pages/Admin/CreateProduct/CreateProduct';
import Signup from './pages/Admin/AdminLoging/Signup';
import Signin from './pages/Admin/AdminLoging/Signin';
import Layout from './pages/Client/Components/Pages/Layout';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-product" element={<CreateProduct />} />
                <Route path="/client" element={<Layout />} />
                
            </Routes>
        </Router>
    );
}

export default App;
