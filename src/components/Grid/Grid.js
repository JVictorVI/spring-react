import { use, useEffect, useState } from "react";
import styles from "./Grid.module.css";

import { useNavigate } from "react-router-dom";
import DeleteAlert from "../DeleteAlert/DeleteAlert.js";

import notfound from "../../assets/notfound.jpeg";
import axios from "axios";
import { toast } from "react-toastify";

function Grid({ products, setProducts, getProducts }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);

  function isDeleting(product) {
    setIsModalOpen(true);
    setSelectedProduct(product);
  }

  function updateLocalProductsList(deletedProductId) {
    setProducts(
      products.filter((product) => product.idProduct !== deletedProductId)
    );
  }

  async function getProductsPagination(page, size) {
    try {
      const response = await axios.get(
        `http://localhost:8080/products/pagination?page=${page}&size=${size}`
      );
      setProducts(response.data.content);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar produtos");
    }
  }

  useEffect(() => {
    // Por padrão começa com 0 e 4
    getProductsPagination(page, size);
  }, []);

  return (
    <>
      <div className={styles.container}>
        <h1>Produtos</h1>

        <div className={styles.pagination}>
          <input
            name="page"
            onChange={(e) => {
              setPage(e.target.value);
            }}
            placeholder="Índice"
          ></input>
          <input
            name="size"
            onChange={(e) => {
              setSize(e.target.value);
            }}
            placeholder="Tamanho"
          ></input>
          <button
            onClick={() => {
              getProductsPagination(page, size);
            }}
          >
            Procurar
          </button>
        </div>

        {products.length === 0 ? (
          <h3>
            Nenhum produto encontrado, busque novamente ou tente adicionar um
            novo
          </h3>
        ) : (
          <>
            <div className={styles.grid}>
              {products.map((product) => (
                <div key={product.idProduct} className={styles.card}>
                  <img
                    src={product.imageURL || notfound}
                    alt={"Foto de " + product.name}
                  ></img>
                  <h3>{product.name}</h3>
                  <p> R$: {product.value}</p>
                  <p> {product.description}</p>
                  <p> Marca: {product.brand.name}</p>
                  <p> Categoria: {product.category.name}</p>
                  <p> {product.subCategory.name}</p>
                  <div className={styles.buttonsContainer}>
                    <button
                      className={styles.updateButton}
                      onClick={() => {
                        navigate(`/form/${product.idProduct}`, {
                          state: { isUpdating: true, updatedProduct: product },
                        });
                      }}
                    >
                      Atualizar
                    </button>

                    <button
                      className={styles.deleteButton}
                      onClick={() => {
                        isDeleting(product);
                      }}
                    >
                      Apagar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de Confirmação */}
      <DeleteAlert
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedProduct={selectedProduct}
        updateLocalProductsList={updateLocalProductsList}
      />
    </>
  );
}

export default Grid;
