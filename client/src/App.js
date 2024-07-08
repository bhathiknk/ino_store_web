import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import CreateProduct from './pages/Admin/CreateProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-product" element={<CreateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
