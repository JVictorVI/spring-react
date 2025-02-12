import styles from "./CategoryForm.module.css";
import Navbar from "../Navbar/Navbar.js";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

function CategoryForm() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [selectedUpdatedItem, setSelectedUpdatedItem] = useState(null);

  const ref = useRef();

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/categories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Erro ao buscar categorias");
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
      await axios
        .post("http://localhost:8080/category/new", data)
        .then((response) => {
          toast.success("Categoria adicionada com sucesso");
          fetchCategories();
        });
    } catch (error) {
      toast.error("Erro ao adicionar categoria: ", error);
    }

    ref.current.name.value = "";
    ref.current.description.value = "";
  }

  async function handleDelete(id) {
    try {
      await axios
        .delete(`http://localhost:8080/category/delete/${id}`)
        .then((response) => {
          toast.success("Categoria excluída com sucesso");
          fetchCategories();
        });
    } catch (error) {
      toast.error("Erro ao excluir categoria: ", error);
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
      await axios
        .put(
          `http://localhost:8080/category/update/${selectedUpdatedItem.idCategory}`,
          data
        )
        .then((response) => {
          toast.success("Categoria atualizada com sucesso");
          fetchCategories();
        });
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar categoria: ", error);
    }
    ref.current.name.value = "";
    ref.current.description.value = "";
    setSelectedUpdatedItem(null);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.Form}>
        <h1>Categorias</h1>

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
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>

          {categories.map((category) => (
            <tbody>
              <tr>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <div className={styles.buttons}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUpdatedItem(category);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.delete}
                      onClick={() => {
                        handleDelete(category.idCategory);
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

export default CategoryForm;
