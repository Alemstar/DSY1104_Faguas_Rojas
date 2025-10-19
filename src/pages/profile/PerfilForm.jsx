import React, { useState, useEffect } from 'react'

export default function PerfilForm({ initial = {}, onGuardar }){
  const [nombre, setNombre] = useState(initial.nombre || '')
  const [direccion, setDireccion] = useState(initial.direccion || '')
  const [categorias, setCategorias] = useState(initial.categorias || [])
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    setNombre(initial.nombre || '')
    setDireccion(initial.direccion || '')
    setCategorias(initial.categorias || [])
  }, [initial])

  function toggleCategoria(value){
    setCategorias(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

  function handleSubmit(e){
    e.preventDefault()
    if(nombre.trim().length < 2) return setMensaje('El nombre debe tener entre 2 y 50 caracteres.')
    if(direccion.trim().length < 5) return setMensaje('La dirección debe tener entre 5 y 100 caracteres.')
    const nuevo = { nombre: nombre.trim(), direccion: direccion.trim(), categorias, beneficios: initial.beneficios || ['Descuento 10%', 'Envío gratis', 'Regalo sorpresa'] }
    onGuardar && onGuardar(nuevo)
    setMensaje('¡Cambios guardados exitosamente!')
    setTimeout(() => setMensaje(''), 3000)
  }

  const opciones = ['Tortas','Galletas','Brownies','Cheesecake','Vegano','Sin Azúcar']

  return (
    <form className="perfil-form" onSubmit={handleSubmit}>
      <label className="perfil-label">Editar nombre</label>
      <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} maxLength={50} />

      <label className="perfil-label">Editar dirección</label>
      <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} maxLength={100} />

      <label className="perfil-label">Editar categorías favoritas</label>
      <select multiple value={categorias} onChange={e => {
        const values = Array.from(e.target.selectedOptions).map(o => o.value)
        setCategorias(values)
      }}>
        {opciones.map(o => <option key={o} value={o}>{o}</option>)}
      </select>

      <button type="submit" className="btn-guardar">Guardar Cambios</button>
      {mensaje && <div id="mensajeExito" style={{ color: 'green', marginTop: '0.5rem' }}>{mensaje}</div>}
    </form>
  )
}
