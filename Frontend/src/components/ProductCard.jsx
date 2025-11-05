import React from 'react'
import PaymentButton from './PaymentButton'

export default function ProductCard({ product, onBuy }) {
  const { name, description, image, price } = product || {}

  // Safely compute a numeric amount and format as currency.
  // Many backends return amounts in the smallest currency unit (e.g. paise/cents).
  // We'll try to coerce to Number; if that fails we fall back to a simple string.
  const amountNumber = price && (typeof price.amount === 'number' || !isNaN(Number(price.amount)))
    ? Number(price.amount)
    : null

  const displayPrice = amountNumber !== null
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: price && price.currency ? price.currency : 'INR'
      }).format(amountNumber / 100)
    : price
    ? `${price.currency || ''} ${price.amount}`
    : ''

  return (
    <article className="product-card" role="article" aria-label={name}>
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={image}
          alt={name || 'Product image'}
          loading="lazy"
        />
      </div>

      <div className="product-body">
        <h3 className="product-title">{name}</h3>
        <p className="product-description">{description}</p>
      </div>

      <div className="product-footer">
  <div className="product-price">{displayPrice}</div>
       
          <PaymentButton/>
      
      </div>
    </article>
  )
}
