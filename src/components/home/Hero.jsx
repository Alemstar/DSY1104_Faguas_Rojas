
import { Link } from "react-router-dom";
import heroImg from '../../assets/hero-pasteleria.jpg';

export default function Hero({ message }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={heroImg} alt="Pastelería" className="hero-img" />
        <div className="acciones-usuario">
          <a href="/login" className="link-usuario">Iniciar sesión</a>
          <span>|</span>
          <a href="/registro" className="link-usuario">Registrar usuario</a>
        </div>
        <div className="hero-overlay">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1>Aniversario 50 años</h1>
              <p className="lead">{message}</p>
              <Link className="btn-primary" to="/productos">Ver catálogo</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}