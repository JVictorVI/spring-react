import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.js";
import Form from "./pages/Form/Form.js";
import CategoryForm from "./components/CategoryForm/CategoryForm.js";
import BrandForm from "./components/BrandForm/BrandForm.js";
import SubCategoryForm from "./components/SubCategoryForm/SubCategoryForm.js";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form/:id" element={<Form />} />
        <Route path="/form" element={<Form />} />
        <Route path="/categories" element={<CategoryForm />} />
        <Route path="/subcategories" element={<SubCategoryForm />} />
        <Route path="/brands" element={<BrandForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
