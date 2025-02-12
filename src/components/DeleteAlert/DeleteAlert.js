import styles from "./DeleteAlert.module.css";
import axios from "axios";
import notfound from "../../assets/notfound.jpeg";
function DeleteAlert({
  isOpen,
  setIsModalOpen,
  selectedProduct,
  updateLocalProductsList,
}) {
  function handleDelete() {
    axios
      .delete(
        "http://localhost:8080/product/delete/" + selectedProduct.idProduct
      )
      .then((response) => {
        updateLocalProductsList(selectedProduct.idProduct);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1>Deletar Produto</h1>
        <img
          className={styles.img}
          src={selectedProduct.imageURL || notfound}
          alt="Foto do produto"
        />
        <p className={styles.p}>
          Tem certeza que deseja deletar o produto {selectedProduct.name}?
        </p>
        <div className={styles.actions}>
          <button
            className={styles.confirm}
            onClick={() => {
              handleDelete();
            }}
          >
            Sim
          </button>
          <button
            className={styles.cancel}
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAlert;
