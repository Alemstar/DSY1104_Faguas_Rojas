import React from 'react'
import HistoryHero from './HistoryHero'
import HistoryImages from './HistoryImages'
import Timeline from './Timeline'
import './History.css'

export default function History() {
  return (
    <section className="history-section" aria-labelledby="historia-title">
      <h2 id="historia-title" className="section-title">Nuestra historia</h2>
      <div className="container">
        <div className="history-content">
          <div className="history-grid">
            <HistoryHero />
            <HistoryImages />
          </div>
          <Timeline />
        </div>
      </div>
    </section>
  )
}