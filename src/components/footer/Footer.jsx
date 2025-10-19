import React from 'react'
import FooterNav from './FooterNav'
import FooterShare from './FooterShare'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h4>MiTienda</h4>
          <p>Calidad, cercanía y buenos precios.</p>
        </div>

        <FooterNav />

        <div className="footer-contact">
          <h4>Contacto</h4>
          <p>
            <a href="mailto:contacto@mitienda.cl">contacto@mitienda.cl</a>
            <br />
            <a href="tel:+56912345678">+56 9 1234 5678</a>
          </p>
        </div>

        <FooterShare />
      </div>
    </footer>
  )
}