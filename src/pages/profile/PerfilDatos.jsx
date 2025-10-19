import React from 'react'

export default function PerfilDatos({ direccion, categorias }){
  return (
    <div>
      <span className="perfil-label">Dirección</span>
      <span className="perfil-valor">{direccion || '-'}</span>
      <span className="perfil-label">Categorías favoritas</span>
      <span className="perfil-valor">{categorias && categorias.length ? categorias.join(', ') : '-'}</span>
    </div>
  )
}
