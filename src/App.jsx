import { useEffect } from "react"
import { HashRouter, Navigate, Route, Routes } from "react-router"
import Login from "./pages/login"
import useAuthStore from "./store/authStore"
import Dashboard from "./pages/dashboard/dashboard"
import Index from "./pages"
import Customer from "./pages/dashboard/customer"
import Product from "./pages/dashboard/product"
import ProductDetails from "./pages/dashboard/productDetails"
import Transaksi from "./pages/dashboard/transaksi"

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
            <Route path="customer" element={<Customer />} />
            <Route path="transaksi" element={<Transaksi />} />
          </Route>

        </Routes>
    </HashRouter>
  )
}

export default App
