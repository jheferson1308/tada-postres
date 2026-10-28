export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '51987654321'

export const getWhatsAppLink = (message) => {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export const STORE_CONFIG = {
  name: 'Tadá Repostería',
  location: 'Ica, Perú',
  whatsapp: WHATSAPP_NUMBER,
  deliveryZones: [
    { name: 'Ica', price: 0 },
    { name: 'La Tinguiña', price: 5 },
    { name: 'Parcona', price: 5 },
    { name: 'Los Aquijes', price: 7 },
    { name: 'Subtanjalla', price: 7 },
    { name: 'San Juan Bautista', price: 8 },
    { name: 'Pueblo Nuevo', price: 8 },
    { name: 'Salas', price: 10 },
  ],
  businessHours: 'Lunes - Sábados: 10:00 AM - 7:00 PM',
  minAdvanceHours: 24,
  paymentMethods: ['Efectivo', 'Yape', 'Plin'],
  yapeNumber: '987654321',
  plinNumber: '987654321',
  aboutStats: {
    years: 0,
    clients: 0,
    varieties: 0
  }
}
