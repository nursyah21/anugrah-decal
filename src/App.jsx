import { BrowserRouter, Route, Routes } from "react-router"
import Index from "./pages"
import Dashboard from "./pages/dashboard/dashboard"
import Product from "./pages/dashboard/product"
import Sales from "./pages/dashboard/sales"
import DashboardIndex from "./pages/dashboard/dashboardIndex"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />

        <Route path="/dashboard" element={<Dashboard />} >
          <Route index element={<DashboardIndex />} />
          <Route path="product" element={<Product />} />
          <Route path="sales" element={<Sales />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
