import { useEffect, useRef, useState } from "react";
import styles from "./Form.module.css";
import axios from "axios";

import Loader from "../../components/Loader/Loader.js";
import { toast, ToastContainer } from "react-toastify";

// Criar uma verificação depois para caso o parametro esteja na uri
// Mas o product esteja vazio, redirecionar para a home

import { useLocation, useNavigate } from "react-router-dom";
import { uploadImage } from "./FormService.js";

function Form() {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubcategory] = useState("");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [image, setImage] = useState(null);

  const location = useLocation();
  const ref = useRef();
  const navigate = useNavigate();

  const { isUpdating, updatedProduct } = location.state || {
    isUpdating: false,
    updatedProduct: null,
  };

  useEffect(() => {
    if (isUpdating) {
      // Setando os valores do produto atualizado nos campos do formulário
      ref.current.name.value = updatedProduct.name;
      ref.current.description.value = updatedProduct.description;
      ref.current.price.value = updatedProduct.value;

      // Setando os valores do produto nos estados caso o usuário não atualize um campo
      setName(updatedProduct.name);
      setDescription(updatedProduct.description);
      setValue(updatedProduct.value);
      setCategory(updatedProduct.category.idCategory);
      setSubcategory(updatedProduct.subCategory.idSubCategory);
      setBrand(updatedProduct.brand.idBrand);
    }
  }, [isUpdating, updatedProduct]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:8080/brands");
        setBrands(response.data);
      } catch (error) {
        toast.error("Erro ao buscar marcas");
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

    const fetchSubCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/subcategories");
        setSubCategories(response.data);
      } catch (error) {
        toast.error("Erro ao buscar subcategorias");
      }
    };

    setLoading(true);
    fetchBrands();
    fetchCategories();
    fetchSubCategories();
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !value ||
      !description ||
      !brand ||
      !category ||
      !subCategory
    ) {
      toast.warn("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    let imgLink = await uploadImage(image);

    await axios
      .post("http://localhost:8080/product/new", {
        name: name,
        value: value,
        description: description,
        brand_id: brand,
        category_id: category,
        subCategory_id: subCategory,
        imageURL: imgLink,
      })
      .then((response) => {
        console.log(response);
      });

    navigate("/");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !value ||
      !description ||
      !brand ||
      !category ||
      !subCategory
    ) {
      toast.warn("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    axios
      .put(`http://localhost:8080/product/update/${updatedProduct.idProduct}`, {
        name: ref.current.name.value,
        value: ref.current.price.value,
        description: ref.current.description.value,
        category_id: ref.current.category.value,
        subCategory_id: ref.current.subCategory.value,
        brand_id: ref.current.brand.value,
        imageURL: updatedProduct.imageURL,
      })
      .then((response) => {
        console.log(response);
      });
    setLoading(false);
    navigate("/");
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.container}>
          <h1>
            {isUpdating
              ? "Atualização de " + updatedProduct.name
              : "Registro de Produto"}
          </h1>

          <form onSubmit={isUpdating ? handleUpdate : handleSubmit} ref={ref}>
            <div className={styles.subcontainer}>
              <label className={styles.label}>Nome</label>
              <input
                className={styles.input}
                type="text"
                name="name"
                placeholder="Insira o nome do produto"
                onChange={(e) => setName(e.target.value)}
              />

              <label>Descrição</label>
              <textarea
                rows={4}
                cols={25}
                className={styles.input}
                type="text"
                name="description"
                placeholder="Insira a descrição do produto"
                onChange={(e) => setDescription(e.target.value)}
              />

              <label>Categoria</label>

              {categories.length === 0 ? (
                <p>Buscando categorias...</p>
              ) : (
                <>
                  <select
                    className={styles.select}
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Escolha a categoria do produto</option>
                    {categories.map((item) => (
                      <option key={item.idCategory} value={item.idCategory}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <label>Subcategoria</label>

              {subcategories.length === 0 ? (
                <p>Buscando subcategorias...</p>
              ) : (
                <>
                  <select
                    className={styles.select}
                    name="subCategory"
                    value={subCategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                  >
                    <option value="">Escolha a subcategoria do produto</option>
                    {subcategories.map((item) => (
                      <option
                        key={item.idSubCategory}
                        value={item.idSubCategory}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <label>Marca</label>
              {brands.length === 0 ? (
                <p>Buscando marcas...</p>
              ) : (
                <>
                  <select
                    className={styles.select}
                    name="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  >
                    <option value="">Escolha a marca do produto</option>
                    {brands.map((item) => (
                      <option key={item.idBrand} value={item.idBrand}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <label>Preço</label>
              <input
                className={styles.input}
                type="number"
                name="price"
                placeholder="Insira o preço do produto"
                onChange={(e) => setValue(e.target.value)}
              />

              {isUpdating ? null : (
                <>
                  <label>Imagem</label>
                  <input
                    className={styles.input}
                    type="file"
                    name="image"
                    placeholder="Insira a imagem do produto"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  {image ? "Imagem selecionada" : ""}
                </>
              )}
              <button type="submit" className={styles.confirmButton}>
                {isUpdating ? "Atualizar" : "Enviar"}
              </button>
              <button
                className={styles.backButton}
                onClick={() => {
                  navigate("/");
                }}
              >
                Voltar
              </button>
            </div>
          </form>
        </div>
      )}

      <ToastContainer autoClose={3000} position="bottom-left" />
    </>
  );
}

export default Form;
