import React from 'react'

export default function PerfilBeneficios({ beneficios = [] }){
  return (
    <div className="perfil-beneficios">
      <h3>Beneficios</h3>
      <ul>
        {beneficios.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    </div>
  )
}
