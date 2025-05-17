import { useEffect } from "react"
import { HashRouter, Navigate, Route, Routes } from "react-router"
import Login from "./pages/login"
import useAuthStore from "./store/authStore"
import Dashboard from "./pages/dashboard/dashboard"
import Index from "./pages"
import Customer from "./pages/dashboard/customer"
import Product from "./pages/dashboard/product"
import ProductDetails from "./pages/dashboard/productDetails/productDetails"
import Transaksi from "./pages/dashboard/transaksi"
import Merk from "./pages/dashboard/productDetails/merk"
import Laminating from "./pages/dashboard/productDetails/laminating"
import Model from "./pages/dashboard/productDetails/model"
import Bahan from "./pages/dashboard/productDetails/bahan"
import Kategori from "./pages/dashboard/productDetails/kategori"

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
          <Route index element={<Navigate to={'product'} />} />
          <Route path="product" element={<Product />} />
          
          <Route path="product-details" element={<ProductDetails />}>
            <Route index element={<Navigate to={'merk'} />} />
            <Route path="merk" element={<Merk />} />
            <Route path="model" element={<Model />} />
            <Route path="bahan" element={<Bahan />} />
            <Route path="kategori" element={<Kategori />} />
            <Route path="laminating" element={<Laminating />} />
          </Route>
          
          <Route path="customer" element={<Customer />} />
          <Route path="transaksi" element={<Transaksi />} />
        </Route>

      </Routes>
    </HashRouter>
  )
}

export default App
