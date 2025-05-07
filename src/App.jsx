import { BrowserRouter, Route, Routes } from "react-router"
import Index from "./pages"
import Dashboard from "./pages/dashboard/dashboard"
import Product from "./pages/dashboard/product"
import Sales from "./pages/dashboard/sales"

function App() {
  // const navigate = useNavigate()


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/product" element={<Product />} />
        <Route path="/dashboard/sales" element={<Sales />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
