import React, { useState, useEffect } from 'react'
import { getWhatsAppLink, STORE_CONFIG } from './config/whatsapp'
import { useScrollAnimation } from './hooks/useScrollAnimation'
import { useCart } from './context/CartContext'

const ALL_PRODUCTS = [
  { id: 1, name: 'Mousse de Fresa', price: 'S/ 16', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80', description: 'Mousse ligera de fresa en vasito', tags: [] },
  { id: 2, name: 'Galletas de Avena', price: 'S/ 18', img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80', description: 'Crujientes galletas de avena integrales', tags: ['Sin gluten'] },
  { id: 3, name: 'Queque de Zanahoria', price: 'S/ 85', img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80', description: 'Queque húmedo de zanahoria', tags: ['Sin gluten'] },
  { id: 4, name: 'Brownie Sin Gluten', price: 'S/ 14', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80', description: 'Brownie intenso de cacao', tags: ['Sin gluten'] },
  { id: 5, name: 'Cheesecake Vegano', price: 'S/ 22', img: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80', description: 'Cheesecake cremoso 100% vegano', tags: ['Vegano'] },
  { id: 6, name: 'Trufas de Coco y Cacao', price: 'S/ 15', img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80', description: 'Bocaditos energéticos', tags: ['Vegano'] },
]

const TESTIMONIALS = [
  { id: 1, name: 'María López', role: 'Cliente', text: 'Los postres son deliciosos y saludables. Me encanta todo!', stars: 5, avatar: 'ML' },
  { id: 2, name: 'Carlos Mendoza', role: 'Cliente', text: 'Excelente calidad y atención. Muy recomendado.', stars: 5, avatar: 'CM' },
  { id: 3, name: 'Ana Torres', role: 'Cliente', text: 'Las opciones sin gluten son perfectas para mí.', stars: 5, avatar: 'AT' },
]

const FAQS = [
  { id: 1, question: '¿Hacen entregas en Ica?', answer: 'Sí, hacemos delivery en Ica y alrededores. Revisa nuestra sección de zonas de delivery.' },
  { id: 2, question: '¿Con cuánto tiempo de anticipación debo pedir?', answer: `Recomendamos pedir con al menos ${STORE_CONFIG.minAdvanceHours} horas de anticipación.` },
  { id: 3, question: '¿Tienen opciones sin gluten y veganas?', answer: 'Sí, tenemos productos etiquetados como Sin gluten y Vegano.' },
  { id: 4, question: '¿Cómo se confirma el pedido?', answer: 'Todos los pedidos se confirman por WhatsApp.' },
]

export default function App() {
  useScrollAnimation()
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount, isCartOpen, setIsCartOpen } = useCart()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryType: 'pickup',
    district: '',
    address: '',
    date: '',
    time: '',
    comments: ''
  })

  const [formErrors, setFormErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80', alt: 'Mousse de fresa en vasito' },
    { src: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80', alt: 'Galletas de avena saludables' },
    { src: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80', alt: 'Queque de zanahoria' },
    { src: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80', alt: 'Brownie sin gluten' },
    { src: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80', alt: 'Cheesecake vegano' },
    { src: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80', alt: 'Trufas de coco y cacao' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'nosotros', 'beneficios', 'catalogo', 'zonas', 'galeria', 'como-pedir', 'testimonios', 'faq', 'pedido']
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio'
    if (!formData.phone.trim()) {
      errors.phone = 'El teléfono es obligatorio'
    } else if (!/^9[0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Ingresa un número válido de 9 dígitos que empiece con 9'
    }
    if (cartItems.length === 0) {
      errors.products = 'Agrega al menos un producto al carrito'
    }
    if (formData.deliveryType === 'delivery') {
      if (!formData.district) errors.district = 'Selecciona un distrito'
      if (!formData.address.trim()) errors.address = 'La dirección es obligatoria para delivery'
    }
    if (!formData.date) {
      errors.date = 'Selecciona una fecha de entrega'
    } else {
      const selectedDate = new Date(formData.date + 'T00:00:00')
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        errors.date = 'La fecha no puede ser anterior a hoy'
      }
    }
    if (!formData.time) {
      errors.time = 'Selecciona un horario'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const getDeliveryCost = () => {
    if (formData.deliveryType !== 'delivery' || !formData.district) return 0
    const zone = STORE_CONFIG.deliveryZones.find(z => z.name === formData.district)
    return zone ? zone.price : 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    if (submitted) return

    let subtotal = getCartTotal()
    const deliveryCost = getDeliveryCost()
    const total = subtotal + deliveryCost

    const productsText = cartItems.map(item => {
      const price = parseFloat(item.price.replace('S/ ', ''))
      return `• ${item.name} x${item.quantity} (${item.price}) = S/ ${(price * item.quantity).toFixed(2)}`
    }).join('\n')

    const message = `🧁 *PEDIDO - TADÁ REPOSTERÍA*
 
👤 *Cliente:* ${formData.name}
📱 *Teléfono:* ${formData.phone}
 
📦 *Productos:*
${productsText}

💰 *Subtotal:* S/ ${subtotal.toFixed(2)}
${formData.deliveryType === 'delivery' ? `🚚 *Costo de envío (${formData.district}):* S/ ${deliveryCost.toFixed(2)}\n` : ''}💰 *TOTAL:* S/ ${total.toFixed(2)}

🚚 *Tipo de entrega:* ${formData.deliveryType === 'pickup' ? '🛍️ Recojo en tienda' : '🛵 Delivery'}
${formData.deliveryType === 'delivery' ? `📍 *Distrito:* ${formData.district}\n📍 *Dirección:* ${formData.address}\n` : ''}📅 *Fecha:* ${formData.date}
⏰ *Hora:* ${formData.time}

💬 *Comentarios:*
${formData.comments || 'Sin comentarios'}

📌 *Nota:* Pedido confirmado por WhatsApp con ${STORE_CONFIG.minAdvanceHours} horas de anticipación.

¡Gracias!`

    setSubmitted(true)
    setTimeout(() => {
      window.open(getWhatsAppLink(message), '_blank')
      clearCart()
      setSubmitted(false)
      setFormData({
        name: '', phone: '', deliveryType: 'pickup', district: '', address: '', date: '', time: '', comments: ''
      })
      setFormErrors({})
    }, 600)
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % galleryImages.length)
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (lightboxOpen && e.key === 'ArrowRight') nextImage()
      if (lightboxOpen && e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen])

  const filteredProducts = ALL_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'sin-gluten' && product.tags.includes('Sin gluten')) ||
      (activeFilter === 'vegano' && product.tags.includes('Vegano'))
    return matchesSearch && matchesFilter
  })

  return (
    <>
      {/* NAVBAR */}
      <header className="navbar">
        <a href="#inicio" className="brand-title" onClick={(e) => { e.preventDefault(); scrollToSection('inicio') }}>{STORE_CONFIG.name}</a>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        <div className="nav-center">
          <nav className="nav-links">
            <a href="#inicio" className={`nav-link ${activeSection === 'inicio' ? 'nav-link-active' : ''}`} onClick={(e) => { e.preventDefault(); scrollToSection('inicio') }}>INICIO</a>
            <a href="#nosotros" className={`nav-link ${activeSection === 'nosotros' ? 'nav-link-active' : ''}`} onClick={(e) => { e.preventDefault(); scrollToSection('nosotros') }}>ACERCA DE</a>
            <a href="#catalogo" className={`nav-link ${activeSection === 'catalogo' ? 'nav-link-active' : ''}`} onClick={(e) => { e.preventDefault(); scrollToSection('catalogo') }}>PRODUCTO</a>
            <a href="#pedido" className={`nav-link ${activeSection === 'pedido' ? 'nav-link-active' : ''}`} onClick={(e) => { e.preventDefault(); scrollToSection('pedido') }}>HACER PEDIDO</a>
          </nav>
        </div>
        <button className="cart-btn" onClick={() => setIsCartOpen(true)} aria-label="Carrito">
          🛒
          {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection('inicio') }}>INICIO</a>
          <a href="#nosotros" onClick={(e) => { e.preventDefault(); scrollToSection('nosotros') }}>ACERCA DE</a>
          <a href="#catalogo" onClick={(e) => { e.preventDefault(); scrollToSection('catalogo') }}>PRODUCTO</a>
          <a href="#pedido" onClick={(e) => { e.preventDefault(); scrollToSection('pedido') }}>HACER PEDIDO</a>
          <button onClick={() => { setIsCartOpen(true); setMobileMenuOpen(false) }}>🛒 CARRITO ({getCartCount()})</button>
        </div>
      )}

      {/* CARRITO LATERAL */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3>Mi Carrito</h3>
              <button onClick={() => setIsCartOpen(false)}>×</button>
            </div>
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <p>Tu carrito está vacío</p>
                <button onClick={() => { setIsCartOpen(false); scrollToSection('catalogo') }}>Ver productos</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => {
                    const price = parseFloat(item.price.replace('S/ ', ''))
                    return (
                      <div key={item.id} className="cart-item">
                        <img src={item.img} alt={item.name} onError={(e) => { e.target.src = '/mousse.jpg' }} />
                        <div className="cart-item-info">
                          <h4>{item.name}</h4>
                          <p>{item.price}</p>
                          <div className="cart-item-controls">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                        <button className="cart-item-remove" onClick={() => removeFromCart(item.id)} title="Eliminar">🗑️</button>
                      </div>
                    )
                  })}
                </div>
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Subtotal:</span>
                    <span>S/ {getCartTotal().toFixed(2)}</span>
                  </div>
                  <button className="cart-checkout" onClick={() => { setIsCartOpen(false); scrollToSection('pedido') }}>
                    Finalizar Pedido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <main className="hero-card fade-up" id="inicio">
        <div className="hero-left-img-wrapper">
          <img
            src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&q=80"
            alt="Postres saludables en vasitos"
            className="hero-left-img"
            loading="eager"
            onError={(e) => { e.target.src = '/mousse.jpg' }}
          />
          <div className="hero-gradient-overlay"></div>
        </div>
        <div className="hero-right-content">
          <h1 className="hero-title">POSTRES<br />SALUDABLES</h1>
          <p className="hero-subtitle">DULCE PLACER Y BIENESTAR EN CADA BOCADO</p>
          <div className="hero-badges">
            <span className="hero-badge">CALIDAD</span>
            <span className="hero-badge">INGREDIENTES PREMIUM</span>
            <span className="hero-badge">VERSÁTIL</span>
          </div>
          <div className="hero-buttons">
            <button onClick={() => scrollToSection('catalogo')} className="btn-hero-primary">BUSCAR MÁS ›</button>
            <button onClick={() => scrollToSection('pedido')} className="btn-hero-secondary">HACER PEDIDO</button>
          </div>
        </div>
      </main>

      {/* BENEFICIOS */}
      <section className="benefits-section fade-up" id="beneficios">
        <div className="benefits-grid">
          <div className="benefit-card"><div className="benefit-icon">🌿</div><h3>Ingredientes Naturales</h3></div>
          <div className="benefit-card"><div className="benefit-icon">💚</div><h3>Bajo en Azúcar</h3></div>
          <div className="benefit-card"><div className="benefit-icon">✨</div><h3>Hecho al Día</h3></div>
          <div className="benefit-card"><div className="benefit-icon">🚚</div><h3>Delivery en Ica</h3></div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section className="catalog-section fade-up" id="catalogo">
        <div className="section-header">
          <span className="section-badge">Catálogo</span>
          <h2 className="section-title">NUESTROS POSTRES</h2>
        </div>
        <div className="catalog-filters">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-catalog"
          />
          <div className="filter-buttons">
            <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => setActiveFilter('all')}>Todos</button>
            <button className={activeFilter === 'sin-gluten' ? 'active' : ''} onClick={() => setActiveFilter('sin-gluten')}>Sin gluten</button>
            <button className={activeFilter === 'vegano' ? 'active' : ''} onClick={() => setActiveFilter('vegano')}>Vegano</button>
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <p className="no-results">Sin resultados</p>
        ) : (
          <div className="catalog-grid">
            {filteredProducts.map(product => (
              <article key={product.id} className="catalog-card">
                <div className="catalog-card-img-wrapper">
                  <img src={product.img} alt={product.name} loading="lazy" onError={(e) => { e.target.src = '/mousse.jpg' }} />
                  {product.tags.map((tag, idx) => <span key={idx} className="catalog-tag">{tag}</span>)}
                </div>
                <div className="catalog-card-content">
                  <h3 className="catalog-card-name">{product.name}</h3>
                  <p className="catalog-card-desc">{product.description}</p>
                  <div className="catalog-card-footer">
                    <span className="catalog-card-price">{product.price}</span>
                    <button className="btn-add-cart" onClick={() => addToCart(product)}>AGREGAR AL PEDIDO</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ZONAS DE DELIVERY */}
      <section className="zones-section fade-up" id="zonas">
        <div className="section-header">
          <span className="section-badge">Delivery</span>
          <h2 className="section-title">ZONAS DE DELIVERY - ICA</h2>
        </div>
        <div className="zones-grid">
          {STORE_CONFIG.deliveryZones.map((zone, idx) => (
            <div key={idx} className="zone-card">
              <span className="zone-name">{zone.name}</span>
              <span className="zone-price">{zone.price === 0 ? 'Gratis' : `S/ ${zone.price}`}</span>
            </div>
          ))}
        </div>
      </section>

      {/* GALERÍA */}
      <section className="gallery-section fade-up" id="galeria">
        <div className="section-header">
          <span className="section-badge">Galería</span>
          <h2 className="section-title">NUESTROS POSTRES</h2>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="gallery-item" onClick={() => openLightbox(idx)}>
              <img src={img.src} alt={img.alt} loading="lazy" onError={(e) => { e.target.src = '/mousse.jpg' }} />
            </div>
          ))}
        </div>
      </section>

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>×</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage() }}>‹</button>
          <img src={galleryImages[lightboxIndex].src} alt={galleryImages[lightboxIndex].alt} className="lightbox-img" onClick={(e) => e.stopPropagation()} />
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage() }}>›</button>
        </div>
      )}

      {/* CÓMO PEDIR */}
      <section className="how-to-section fade-up" id="como-pedir">
        <div className="section-header">
          <span className="section-badge">Proceso</span>
          <h2 className="section-title">CÓMO PEDIR</h2>
        </div>
        <div className="how-to-grid">
          <div className="how-to-card"><div className="how-to-number">1</div><h3>Elige</h3><p>Selecciona tus postres favoritos</p></div>
          <div className="how-to-card"><div className="how-to-number">2</div><h3>Completa</h3><p>Ingresa tus datos y entrega</p></div>
          <div className="how-to-card"><div className="how-to-number">3</div><h3>Confirma</h3><p>Envía por WhatsApp</p></div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section className="about-section fade-up" id="nosotros">
        <div className="about-container">
          <div className="about-content">
            <span className="section-badge">Sobre Nosotros</span>
            <h2 className="section-title">TADÁ REPOSTERÍA</h2>
            <p className="about-text">Repostería saludable en {STORE_CONFIG.location}. Elaboramos postres con ingredientes naturales, sin azúcar refinado, con opciones sin gluten y veganas.</p>
            <p className="about-text">Pedidos se confirman por WhatsApp con {STORE_CONFIG.minAdvanceHours} horas de anticipación.</p>
            <div className="allergens-notice">
              <strong>Aviso de alérgenos:</strong> Consulta por ingredientes específicos al momento de tu pedido.
            </div>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80" alt="Tadá Repostería Ica" loading="lazy" onError={(e) => { e.target.src = '/queque.jpg' }} />
          </div>
        </div>
      </section>

      {/* DÓNDE ESTAMOS */}
      <section className="location-section fade-up" id="ubicacion">
        <div className="section-header">
          <span className="section-badge">Ubicación</span>
          <h2 className="section-title">DÓNDE ESTAMOS</h2>
        </div>
        <div className="location-grid">
          <div className="location-info">
            <p><strong>📍 Dirección:</strong> {STORE_CONFIG.location}</p>
            <p><strong>⏰ Horarios:</strong> {STORE_CONFIG.businessHours}</p>
            <p><strong>📱 WhatsApp:</strong> +{STORE_CONFIG.whatsapp}</p>
            <p><strong>💳 Métodos de pago:</strong> {STORE_CONFIG.paymentMethods.join(', ')}</p>
            <p><strong>Yape:</strong> {STORE_CONFIG.yapeNumber} | <strong>Plin:</strong> {STORE_CONFIG.plinNumber}</p>
            <a href={`https://maps.google.com/?q=Ica,Peru`} target="_blank" rel="noopener noreferrer" className="btn-maps">CÓMO LLEGAR</a>
          </div>
          <div className="location-map">
            <iframe 
              src="https://www.openstreetmap.org/export/embed.html?bbox=-75.7400%2C-14.0700%2C-75.7200%2C-14.0500&amp;layer=mapnik"
              style={{ width: '100%', height: '300px', border: 0, borderRadius: '16px' }}
              title="Mapa de Ica"
            ></iframe>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="testimonials-section fade-up" id="testimonios">
        <div className="section-header">
          <span className="section-badge">Testimonios</span>
          <h2 className="section-title">CLIENTES SATISFECHOS</h2>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div><div className="testimonial-name">{t.name}</div><div className="testimonial-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section fade-up" id="faq">
        <div className="section-header">
          <span className="section-badge">Preguntas Frecuentes</span>
          <h2 className="section-title">PREGUNTAS FRECUENTES</h2>
        </div>
        <div className="faq-container">
          {FAQS.map(faq => (
            <div key={faq.id} className={`faq-item ${openFaq === faq.id ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}>
                <span>{faq.question}</span><span className="faq-arrow">▼</span>
              </button>
              <div className="faq-answer"><p>{faq.answer}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* PEDIDO */}
      <section className="order-section fade-up" id="pedido">
        <div className="section-header">
          <span className="section-badge">Pedido</span>
          <h2 className="section-title">HAZ TU PEDIDO</h2>
          <p>Elige tus postres y te confirmamos por WhatsApp</p>
        </div>
        <div className="order-container">
          {submitted ? (
            <div className="confirmation-screen">
              <div className="confirmation-icon">✅</div>
              <h3>¡Gracias!</h3>
              <p>Te estamos redirigiendo a WhatsApp...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="order-form">
              {cartItems.length === 0 && (
                <div className="form-alert">
                  ⚠️ Tu carrito está vacío. Agrega productos desde el catálogo.
                  <button type="button" onClick={() => scrollToSection('catalogo')}>Ver productos</button>
                </div>
              )}
              {formErrors.products && <p className="error-text">{formErrors.products}</p>}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre y Apellido *</label>
                  <input type="text" className={`form-input ${formErrors.name ? 'error' : ''}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. María Pérez" />
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono / WhatsApp *</label>
                  <input type="tel" className={`form-input ${formErrors.phone ? 'error' : ''}`} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="987654321" maxLength="9" />
                  {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Modalidad *</label>
                <div className="delivery-toggle">
                  <button type="button" className={formData.deliveryType === 'pickup' ? 'active' : ''} onClick={() => setFormData({...formData, deliveryType: 'pickup'})}>🛍️ Recojo en tienda</button>
                  <button type="button" className={formData.deliveryType === 'delivery' ? 'active' : ''} onClick={() => setFormData({...formData, deliveryType: 'delivery'})}>🛵 Delivery</button>
                </div>
              </div>

              {formData.deliveryType === 'delivery' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Distrito *</label>
                    <select className={`form-select ${formErrors.district ? 'error' : ''}`} value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})}>
                      <option value="">Selecciona distrito</option>
                      {STORE_CONFIG.deliveryZones.map(z => <option key={z.name} value={z.name}>{z.name} - {z.price === 0 ? 'Gratis' : `S/ ${z.price}`}</option>)}
                    </select>
                    {formErrors.district && <span className="error-text">{formErrors.district}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dirección *</label>
                    <input type="text" className={`form-input ${formErrors.address ? 'error' : ''}`} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Av. Ejemplo 123" />
                    {formErrors.address && <span className="error-text">{formErrors.address}</span>}
                  </div>
                </>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fecha *</label>
                  <input type="date" className={`form-input ${formErrors.date ? 'error' : ''}`} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} />
                  {formErrors.date && <span className="error-text">{formErrors.date}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Horario *</label>
                  <select className={`form-select ${formErrors.time ? 'error' : ''}`} value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                    <option value="">Selecciona</option>
                    <option value="10:00 AM - 1:00 PM">10:00 AM - 1:00 PM</option>
                    <option value="1:00 PM - 4:00 PM">1:00 PM - 4:00 PM</option>
                    <option value="4:00 PM - 7:00 PM">4:00 PM - 7:00 PM</option>
                  </select>
                  {formErrors.time && <span className="error-text">{formErrors.time}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Comentarios</label>
                <textarea className="form-textarea" rows="3" value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})}></textarea>
              </div>

              {cartItems.length > 0 && (
                <div className="order-summary-box">
                  <h4>Resumen</h4>
                  {cartItems.map(item => {
                    const price = parseFloat(item.price.replace('S/ ', ''))
                    return <div key={item.id} className="summary-line"><span>{item.name} x{item.quantity}</span><span>S/ {(price*item.quantity).toFixed(2)}</span></div>
                  })}
                  <div className="summary-line"><span>Subtotal</span><span>S/ {getCartTotal().toFixed(2)}</span></div>
                  {formData.deliveryType === 'delivery' && formData.district && <div className="summary-line"><span>Envío ({formData.district})</span><span>S/ {getDeliveryCost().toFixed(2)}</span></div>}
                  <div className="summary-line total"><span>Total</span><span>S/ {(getCartTotal() + getDeliveryCost()).toFixed(2)}</span></div>
                </div>
              )}

              <button type="submit" className="btn-whatsapp-submit" disabled={submitted || cartItems.length === 0}>
                {submitted ? 'Abriendo WhatsApp...' : 'ENVIAR PEDIDO POR WHATSAPP'}
              </button>
              <p className="form-note">🔒 Se confirmará por WhatsApp. Pedidos con {STORE_CONFIG.minAdvanceHours}h de anticipación.</p>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">{STORE_CONFIG.name}</h3>
            <p>Postres saludables en {STORE_CONFIG.location}</p>
            <div className="footer-social">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📸</a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘</a>
              <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok">🎵</a>
              <a href={`https://wa.me/${STORE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">💬</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul>
              <li><a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection('inicio') }}>Inicio</a></li>
              <li><a href="#nosotros" onClick={(e) => { e.preventDefault(); scrollToSection('nosotros') }}>Acerca de</a></li>
              <li><a href="#catalogo" onClick={(e) => { e.preventDefault(); scrollToSection('catalogo') }}>Productos</a></li>
              <li><a href="#pedido" onClick={(e) => { e.preventDefault(); scrollToSection('pedido') }}>Hacer Pedido</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Horarios</h4>
            <ul><li>{STORE_CONFIG.businessHours}</li></ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <ul>
              <li>WhatsApp: +{STORE_CONFIG.whatsapp}</li>
              <li>{STORE_CONFIG.location}</li>
              <li>Delivery: Ica y alrededores</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 {STORE_CONFIG.name}. Todos los derechos reservados.</p>
        </div>
      </footer>

      <a href={`https://wa.me/${STORE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="WhatsApp">💬</a>
      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Volver arriba">↑</button>
    </>
  )
}
