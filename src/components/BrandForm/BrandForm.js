import styles from "../CategoryForm/CategoryForm.module.css";
import Navbar from "../Navbar/Navbar.js";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

function BrandForm() {
  const [brands, setBrands] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [selectedUpdatedItem, setSelectedUpdatedItem] = useState(null);

  const ref = useRef();

  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8080/brands");
      setBrands(response.data);
    } catch (error) {
      toast.error("Erro ao buscar marcas");
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !description) {
      return toast.warning("Preencha todos os campos!");
    }

    const data = {
      name: name,
      description: description,
    };

    try {
      axios.post("http://localhost:8080/brand/new", data).then((response) => {
        toast.success("Marca adicionada com sucesso");
        fetchBrands();
      });
    } catch (error) {
      toast.error("Erro ao adicionar marca: ", error);
    }

    ref.current.name.value = "";
    ref.current.description.value = "";
  }

  async function handleDelete(id) {
    try {
      axios
        .delete(`http://localhost:8080/brand/delete/${id}`)
        .then((response) => {
          toast.success("Marca excluída com sucesso");
          fetchBrands();
        });
    } catch (error) {
      toast.error("Erro ao excluir marca: ", error);
    }
  }

  useEffect(() => {
    if (selectedUpdatedItem) {
      ref.current.name.value = selectedUpdatedItem.name;
      ref.current.description.value = selectedUpdatedItem.description;
      setName(selectedUpdatedItem.name);
      setDescription(selectedUpdatedItem.description);
    }
  }, [selectedUpdatedItem]);

  async function handleUpdate(e) {
    e.preventDefault();

    if (!name || !description) {
      return toast.warning("Preencha todos os campos!");
    }

    const data = {
      name: name,
      description: description,
    };

    try {
      axios
        .put(
          `http://localhost:8080/brand/update/${selectedUpdatedItem.idBrand}`,
          data
        )
        .then((response) => {
          toast.success("Marca atualizada com sucesso");
          fetchBrands();
        });
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar marca: ", error);
    }
    ref.current.name.value = "";
    ref.current.description.value = "";
    setSelectedUpdatedItem(null);
  }

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.Form}>
        <h1>Marcas</h1>

        <form
          onSubmit={selectedUpdatedItem ? handleUpdate : handleSubmit}
          ref={ref}
        >
          <div className={styles.fields}>
            <input
              type="text"
              name="name"
              placeholder="Insira o nome"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="text"
              name="description"
              placeholder="Insira a descrição"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <button type="submit">
              {selectedUpdatedItem ? "Atualizar" : "Adicionar"}
            </button>
          </div>
        </form>

        <table>
          <thead>
            <tr>
              <th>Marca</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>

          {brands.map((brand) => (
            <tbody>
              <tr>
                <td>{brand.name}</td>
                <td>{brand.description}</td>
                <td>
                  <div className={styles.buttons}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUpdatedItem(brand);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.delete}
                      onClick={() => {
                        handleDelete(brand.idBrand);
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      <ToastContainer autoClose={3000} position="bottom-left" />
    </>
  );
}

export default BrandForm;
