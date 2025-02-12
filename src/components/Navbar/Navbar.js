import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";
function Navbar({ getProductsBySearch }) {
  const [search, setSearch] = useState("");

  async function handleSearch() {
    getProductsBySearch(search);
    console.log("Pesquisando...");
  }
  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <h1>Spring React</h1>
      </Link>

      <div className={styles.search}>
        <input
          type="text"
          placeholder="Digite algo para procurar..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => handleSearch()}>Pesquisar</button>
      </div>
      <div className={styles.links}>
        <a href="/categories"> Categorias </a>
        <a href="/subcategories"> Subcategorias </a>
        <a href="/brands"> Marcas </a>
      </div>
    </nav>
  );
}

export default Navbar;
