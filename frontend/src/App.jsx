import { Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import Dashboard from './pages/Dashboard'
import ProductList from './pages/ProductList'
import StockMovements from './pages/StockMovements'

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/movements" element={<StockMovements />} />
      </Routes>
    </>
  )
}

export default App
