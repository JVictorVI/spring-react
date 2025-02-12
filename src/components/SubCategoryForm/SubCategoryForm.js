import styles from "../CategoryForm/CategoryForm.module.css";
import sub_styles from "./SubCategoryForm.module.css";

import Navbar from "../Navbar/Navbar.js";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

function SubCategoryForm() {
  const [subcategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [selectedUpdatedItem, setSelectedUpdatedItem] = useState(null);

  const ref = useRef();

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/subcategories");
      setSubCategories(response.data);
    } catch (error) {
      toast.error("Erro ao buscar subcategorias");
    }
  };

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
      category_id: category,
    };

    try {
      axios
        .post("http://localhost:8080/subcategory/new", data)
        .then((response) => {
          toast.success("Subcategoria adicionada com sucesso");
          fetchSubCategories();
        });
    } catch (error) {
      toast.error("Erro ao adicionar subcategoria: ", error);
    }

    ref.current.name.value = "";
    ref.current.description.value = "";
  }

  async function handleDelete(id) {
    try {
      axios
        .delete(`http://localhost:8080/subcategory/delete/${id}`)
        .then((response) => {
          toast.success("Subcategoria excluída com sucesso");
          fetchSubCategories();
        });
    } catch (error) {
      toast.error("Erro ao excluir subcategoria: ", error);
    }
  }

  useEffect(() => {
    if (selectedUpdatedItem) {
      ref.current.name.value = selectedUpdatedItem.name;
      ref.current.description.value = selectedUpdatedItem.description;
    }
  }, [selectedUpdatedItem]);

  async function handleUpdate(e) {
    e.preventDefault();

    if (!name || !description) {
      return toast.warning("Preencha todos os campos!");
    }

    setName(ref.current.name.value);
    setDescription(ref.current.description.value);

    const data = {
      name: name,
      description: description,
      category_id: category,
    };

    try {
      axios
        .put(
          `http://localhost:8080/subcategory/update/${selectedUpdatedItem.idSubCategory}`,
          data
        )
        .then((response) => {
          toast.success("Subcategoria atualizada com sucesso");
          fetchSubCategories();
        });
    } catch (error) {
      toast.error("Erro ao atualizar subcategoria: ", error);
    }
    ref.current.name.value = "";
    ref.current.description.value = "";
    setSelectedUpdatedItem(null);
  }

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.Form}>
        <h1>Subcategorias</h1>

        <form
          onSubmit={selectedUpdatedItem ? handleUpdate : handleSubmit}
          ref={ref}
        >
          <div className={sub_styles.category}>
            <label>Selecione a categoria da nova subcategoria</label>

            <select
              className={styles.select}
              name="category"
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option value={category.idCategory}>{category.name}</option>
              ))}
            </select>
          </div>

          {category ? (
            <>
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
            </>
          ) : null}
        </form>

        <table>
          <thead>
            <tr>
              <th>Categoria Principal</th>
              <th>Subcategoria</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>

          {subcategories.map((subcategory) => (
            <tbody>
              <tr>
                <td>{subcategory.category.name}</td>
                <td>{subcategory.name}</td>
                <td>{subcategory.description}</td>
                <td>
                  <div className={styles.buttons}>
                    <button
                      className={styles.delete}
                      onClick={() => {
                        handleDelete(subcategory.idSubCategory);
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

export default SubCategoryForm;
