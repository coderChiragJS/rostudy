import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProductDetails from './screens/ProductDetails';
import ProductList from './screens/ProductList';
import AppLayout from './Layout/Layout';

function App() {
  return (
      <BrowserRouter>
    <AppLayout>
          <div className="App">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
            </Routes>
          </div>
   
    </AppLayout>
      </BrowserRouter>
  );
}

export default App;
