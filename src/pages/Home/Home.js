import { useEffect, useState } from "react";
import styles from "./Home.module.css";

import axios from "axios";
import Grid from "../../components/Grid/Grid.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.js";

import { toast, ToastContainer } from "react-toastify";

export const fetchProducts = async () => {
  try {
    const response = await axios.get("http://localhost:8080/products");
    return response.data;
  } catch (error) {
    throw error;
  }
};

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Erro ao buscar produtos");
    }
  };

  const getProductsBySearch = async (search) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/products/search/" + search
      );
      setProducts(response.data);
    } catch (error) {
      toast.error("Erro ao buscar produtos");
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <Navbar getProductsBySearch={getProductsBySearch} />
      <Grid
        products={products}
        setProducts={setProducts}
        getProducts={getProducts}
      />
      <button
        className={styles.floatingButton}
        onClick={() => {
          navigate("/form");
        }}
      >
        Adicionar Produto
      </button>
      <ToastContainer autoClose={3000} position="bottom-left" />
    </>
  );
}

export default Home;
