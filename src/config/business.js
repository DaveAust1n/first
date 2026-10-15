// Customize these values for each business that purchases this template.
export const business = {
  name: 'MOTORVAULT',
  tagline: 'Parts you can count on.',
  whatsapp: '2348012345678', // International format, numbers only
  phone: '+234 801 234 5678',
  email: 'hello@example.com',
  address: 'Lagos, Nigeria',
  currency: 'NGN',
  announcement: 'Reliable parts. Fair prices. Fast response.',
  colors: {
    navy: '#101820',
    orange: '#f97316',
  },
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: business.currency,
    maximumFractionDigits: 0,
  }).format(amount)
}