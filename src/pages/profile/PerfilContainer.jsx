import React, { useEffect, useState } from 'react'
import PerfilDatos from './PerfilDatos'
import PerfilForm from './PerfilForm'
import PerfilBeneficios from './PerfilBeneficios'

export default function PerfilContainer(){
  const [perfil, setPerfil] = useState({ nombre: '', direccion: '', categorias: [], beneficios: [] })

  useEffect(() => {
    // Obtener datos del usuario desde la clave correcta
    const userData = JSON.parse(localStorage.getItem('user_data')) || {};
    const perfilData = JSON.parse(localStorage.getItem('perfilUsuario')) || { 
      direccion: '', 
      categorias: [], 
      beneficios: ['Descuento 10%', 'Envío gratis', 'Regalo sorpresa'] 
    };
    
    // Construir nombre completo desde user_data
    const nombreCompleto = userData.nombre && userData.apellidos 
      ? `${userData.nombre} ${userData.apellidos}`.trim()
      : userData.nombre || userData.email || 'Nombre Usuario';
    
    setPerfil({ ...perfilData, nombre: nombreCompleto })
  }, [])

  function handleGuardar(nuevoPerfil){
    localStorage.setItem('perfilUsuario', JSON.stringify(nuevoPerfil))
    // Actualizar también user_data si es necesario
    const userData = JSON.parse(localStorage.getItem('user_data')) || {};
    const nombres = nuevoPerfil.nombre.split(' ');
    if (nombres.length >= 2) {
      userData.apellidos = nombres.pop();
      userData.nombre = nombres.join(' ');
    } else {
      userData.nombre = nuevoPerfil.nombre;
    }
    localStorage.setItem('user_data', JSON.stringify(userData));
    setPerfil({ ...nuevoPerfil })
  }

  return (
    <div className="perfil-container">
      <div className="perfil-nombre">{perfil.nombre}</div>
      <div className="perfil-datos">
        <div className="perfil-col">
          <span className="perfil-label">Dirección</span>
          <span className="perfil-valor">{perfil.direccion || '-'}</span>
          <span className="perfil-label">Categorías favoritas</span>
          <span className="perfil-valor">{perfil.categorias && perfil.categorias.length ? perfil.categorias.join(', ') : '-'}</span>
        </div>
        <div className="perfil-col">
          <PerfilForm initial={perfil} onGuardar={handleGuardar} />
        </div>
      </div>
      <PerfilBeneficios beneficios={perfil.beneficios || ['Descuento 10%', 'Envío gratis', 'Regalo sorpresa']} />
    </div>
  )
}
