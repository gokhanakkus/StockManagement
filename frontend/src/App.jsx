import { Routes, Route, Navigate } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import ProductList from './pages/ProductList'
import StockMovements from './pages/StockMovements'

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/movements" element={<StockMovements />} />
      </Routes>
    </>
  )
}

export default App
