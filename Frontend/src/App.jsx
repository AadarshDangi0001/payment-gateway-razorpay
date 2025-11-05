import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from './components/ProductCard'
import './App.css'


function App() {
  const [products, setProducts] = useState(null)
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    axios
      .get('http://localhost:3000/products/get-item')
      .then(response => {
        setProducts(response.data.products)
        console.log(response.data.products)
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error)
      })
  }, [])

  // apply theme to document and persist
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    } catch (e) {
      // ignore (e.g., server-side rendering)
    }
  }, [isDark])

  
  const handleBuy = product => {
    // Placeholder action for buy — replace with real flow later
    console.log('Buy clicked for', product)
    alert(`Proceeding to buy: ${product.name} — ${product.price.currency} ${product.price.amount}`)
  }


  return (
    <main className="app-root">
      <header className="app-header">
        <h1>Products</h1>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={() => setIsDark(d => !d)}
            aria-pressed={isDark}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <section className="products-grid" aria-live="polite">
        {products === null ? (
          <div className="empty-state">Loading products…</div>
        ) : (() => {
          // normalize products into an array when possible
          let items = null
          if (Array.isArray(products)) {
            items = products
          } else if (products && Array.isArray(products.products)) {
            items = products.products
          } else if (products && typeof products === 'object' && (products._id || products.name)) {
            // backend returned a single product object — wrap it into an array
            items = [products]
          } else {
            items = null
          }

          if (items === null) {
            // defensive: backend returned an unexpected shape
            console.error('Unexpected products format:', products)
            return <div className="error-state">Unable to display products (invalid response format).</div>
          }

          if (items.length === 0) return <div className="empty-state">No products found.</div>

          return items.map(p => (
            <ProductCard key={p._id || p.name} product={p} onBuy={handleBuy} />
          ))
        })()}
      </section>
    </main>
  )
}

export default App
