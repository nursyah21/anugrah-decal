import { useEffect } from "react"
import { HashRouter, Navigate, Route, Routes } from "react-router"
import Index from "./pages"
import Dashboard from "./pages/dashboard/dashboard"
import DashboardIndex from "./pages/dashboard/dashboardIndex"
import Product from "./pages/dashboard/product"
import Sales from "./pages/dashboard/sales"
import Login from "./pages/login"
import useAuthStore from "./store/authStore"

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
          <Route index element={<DashboardIndex />} />
          <Route path="product" element={<Product />} />
          <Route path="sales" element={<Sales />} />
        </Route>

      </Routes>
    </HashRouter>
  )
}

export default App
