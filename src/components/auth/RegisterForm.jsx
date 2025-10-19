import React from 'react'

export default function RegisterForm({ title = 'Registro de usuario', form, updateField, onSubmit, feedback }){
  return (
    <form onSubmit={onSubmit} className="registro-form">
      <div className="form-title">{title}</div>
      <label>Nombre</label>
      <input name="nombre" value={form.nombre} onChange={updateField} required />

      <label>Apellidos</label>
      <input name="apellidos" value={form.apellidos} onChange={updateField} required />

      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={updateField} required />

      <label>Fecha de nacimiento</label>
      <input name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={updateField} required />

      <label>Password</label>
      <input name="password" type="password" value={form.password} onChange={updateField} required minLength={4} maxLength={10} />

      <label>Código Promo (opcional)</label>
      <input name="codigoPromo" value={form.codigoPromo} onChange={updateField} />

      <button type="submit" className="btn-primary">Registrar</button>
      {feedback && <div role="status" aria-live="polite" className="form-feedback" style={{ marginTop: '0.5rem' }}>{feedback}</div>}
    </form>
  )
}