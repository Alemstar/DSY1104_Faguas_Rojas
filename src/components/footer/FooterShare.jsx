import React, { useState } from 'react'

const shareOptions = [
  {
    id: 'twitter',
    label: 'Twitter',
    getUrl: (url) => `https://twitter.com/intent/tweet?url=${url}`
  },
  {
    id: 'facebook',
    label: 'Facebook',
    getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    getUrl: (url) => `https://wa.me/?text=${url}`
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    getUrl: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
  }
];

export default function FooterShare() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleShare = (option) => {
    const url = encodeURIComponent(window.location.href);
    window.open(option.getUrl(url), '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <h4>Compartir</h4>
      <div className="share-footer">
        <button 
          className="share-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
        >
          Compartir
        </button>
        <div 
          className={`share-menu ${isMenuOpen ? 'active' : ''}`}
          hidden={!isMenuOpen}
          aria-label="Opciones para compartir"
        >
          {shareOptions.map((option) => (
            <button
              key={option.id}
              className="share-link"
              onClick={() => handleShare(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}