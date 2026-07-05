import { Routes, Route, useLocation } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import StockMovements from './pages/StockMovements'

function App() {
  const location = useLocation()
  const showNavbar = location.pathname !== '/login'

  return (
    <>
      {showNavbar && <NavigationBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/movements" element={<StockMovements />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
