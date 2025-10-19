import React from 'react'

export default function LoginForm({ title = 'Iniciar sesión', email, setEmail, password, setPassword, onSubmit, loading, feedback }){
  return (
    <form onSubmit={onSubmit} className="registro-form">
      <div className="form-title">{title}</div>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={4} maxLength={10} />

      <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Verificando...' : 'Entrar'}</button>
      {feedback && <div role="status" aria-live="polite" className="form-feedback" style={{ marginTop: '0.5rem' }}>{feedback}</div>}
    </form>
  )
}