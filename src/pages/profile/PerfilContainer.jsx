import React, { useEffect, useState } from 'react'
import PerfilDatos from './PerfilDatos'
import PerfilForm from './PerfilForm'
import PerfilBeneficios from './PerfilBeneficios'

export default function PerfilContainer(){
  const [perfil, setPerfil] = useState({ nombre: '', direccion: '', categorias: [], beneficios: [] })

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('perfilUsuario')) || { nombre: '', direccion: '', categorias: [], beneficios: ['Descuento 10%', 'Envío gratis', 'Regalo sorpresa'] }
    const sesion = JSON.parse(localStorage.getItem('sesionIniciada')) || {}
    const nombreCompleto = sesion.nombre && sesion.apellidos 
      ? `${sesion.nombre} ${sesion.apellidos}` 
      : sesion.nombre || datos.nombre || 'Nombre Usuario'
    setPerfil({ ...datos, nombre: nombreCompleto })
  }, [])

  function handleGuardar(nuevoPerfil){
    localStorage.setItem('perfilUsuario', JSON.stringify(nuevoPerfil))
    // actualizar sesion
    const sesion = JSON.parse(localStorage.getItem('sesionIniciada')) || {}
    if(sesion){
      sesion.nombre = nuevoPerfil.nombre
      localStorage.setItem('sesionIniciada', JSON.stringify(sesion))
    }
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
