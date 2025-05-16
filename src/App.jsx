import { useEffect } from "react"
import { HashRouter, Navigate, Route, Routes } from "react-router"
import Index from "./pages"
import Bahan from "./pages/dashboard/bahan"
import Category from "./pages/dashboard/category"
import Customer from "./pages/dashboard/customer"
import Dashboard from "./pages/dashboard/dashboard"
import Laminating from "./pages/dashboard/laminating"
import Merk from "./pages/dashboard/merk"
import Model from "./pages/dashboard/model"
import Product from "./pages/dashboard/product"
import Transaksi from "./pages/dashboard/transaksi"
import Login from "./pages/login"
import useAuthStore from "./store/authStore"
import ProductDetails from "./pages/dashboard/productDetails"

function App() {
  const { user, initializeAuth, loading } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <></>
    }

    if (!user) {
      return <Navigate to={'/login'} />
    }

    return children
  }

  const PublicRoute = ({ children }) => {
    if (loading) {
      return <></>
    }

    if (user) {
      return <Navigate to={'/'} />
    }

    return children
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
        } >
          <Route index element={<Navigate to={'/dashboard/product'} />} />
          <Route path="product" element={<Product />} />
          <Route path="product-details" element={<ProductDetails />} />
          <Route path="merk" element={<Merk />} />
          <Route path="model" element={<Model />} />
          <Route path="category" element={<Category />} />
          <Route path="bahan" element={<Bahan />} />
          <Route path="laminating" element={<Laminating />} />
          <Route path="customer" element={<Customer />} />
          <Route path="transaksi" element={<Transaksi />} />
        </Route>

      </Routes>
    </HashRouter>
  )
}

export default App
