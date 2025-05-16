import { lazy, Suspense, useEffect } from "react"
import { HashRouter, Navigate, Route, Routes } from "react-router"
import Login from "./pages/login"
import useAuthStore from "./store/authStore"

const Dashboard = lazy(() => import("./pages/dashboard/dashboard"))
const Index = lazy(() => import("./pages"))
const Customer = lazy(() => import("./pages/dashboard/customer"))
const Product = lazy(() => import("./pages/dashboard/product"))
const ProductDetails = lazy(() => import("./pages/dashboard/productDetails"))
const Transaksi = lazy(() => import("./pages/dashboard/transaksi"))

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
      <Suspense fallback={<div className="center">please wait...</div>}>
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
      </Suspense>
    </HashRouter>
  )
}

export default App
