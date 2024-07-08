import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import CreateProduct from './pages/Admin/CreateProduct/CreateProduct';
import PriceInformation from './pages/Admin/CreateProduct/Priceformation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/price-information" element={<PriceInformation/>} />
      </Routes>
    </Router>
  );
}

export default App;
