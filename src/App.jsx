import { useMemo, useState } from 'react'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, BatteryCharging,
  Check, ChevronDown, Clock3, Disc3, Filter, Gauge, Headphones,
  Menu, PackageCheck, Search, ShieldCheck, SlidersHorizontal,
  Sparkles, Truck, Wrench, X, Zap,
} from 'lucide-react'
import { business, formatPrice } from './config/business'
import { categories, products } from './data/products'

const categoryIcons = {
  'All parts': Wrench,
  Batteries: BatteryCharging,
  'Engine parts': Gauge,
  Accessories: Sparkles,
  Lubricants: Disc3,
  Tools: Wrench,
}

function WhatsAppLink({ product, className = '', children }) {
  const message = product
    ? `Hello ${business.name}, I'm interested in ${product.name} listed at ${formatPrice(product.price)}. Is it available? Please confirm compatibility and final price.`
    : `Hello ${business.name}, I'd like to enquire about your auto parts.`
  const href = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>
}

function ProductCard({ product, onView }) {
  return (
    <article className="product-card group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5">
      <button onClick={() => onView(product)} className="relative block w-full overflow-hidden bg-slate-100 text-left" aria-label={`View ${product.name}`}>
        <div className="aspect-[4/3] overflow-hidden">
          <img src={product.image} alt={product.name} loading="lazy" className="product-image h-full w-full object-cover" onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80' }} />
        </div>
        {product.badge && <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm">{product.badge}</span>}
        <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${product.stock === 'In stock' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{product.stock}</span>
      </button>
      <div className="p-4 sm:p-5">
        <p className="eyebrow text-slate-400">{product.category}</p>
        <button onClick={() => onView(product)} className="mt-2 block text-left font-display text-lg font-semibold leading-snug text-slate-900 hover:text-orange-600">{product.name}</button>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{product.fitment}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="font-display text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
          <button onClick={() => onView(product)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-800 transition hover:bg-orange-500 hover:text-white" aria-label={`Enquire about ${product.name}`}><ArrowUpRight size={18} /></button>
        </div>
      </div>
    </article>
  )
}

function ProductModal({ product, onClose }) {
  if (!product) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section role="dialog" aria-modal="true" aria-labelledby="product-modal-title" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="eyebrow text-slate-400">Product details</span>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200" aria-label="Close product details"><X size={19} /></button>
        </div>
        <div className="grid md:grid-cols-2">
          <div className="min-h-64 bg-slate-100"><img src={product.image} alt={product.name} className="h-full max-h-[420px] w-full object-cover" /></div>
          <div className="p-6 sm:p-8">
            <p className="eyebrow text-orange-600">{product.category}</p>
            <h2 id="product-modal-title" className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950">{product.name}</h2>
            <p className="mt-4 text-2xl font-bold text-slate-950">{formatPrice(product.price)}</p>
            <p className="mt-5 text-sm leading-6 text-slate-600">{product.description}</p>
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm"><span className="font-semibold text-slate-900">Fitment: </span><span className="text-slate-600">{product.fitment}</span><div className="mt-2 flex items-center gap-2 text-slate-600"><span className={`h-2 w-2 rounded-full ${product.stock === 'In stock' ? 'bg-emerald-500' : 'bg-amber-500'}`} />{product.stock} (sample listing)</div></div>
            <WhatsAppLink product={product} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-semibold text-white transition hover:bg-orange-600">Enquire on WhatsApp <ArrowUpRight size={18} /></WhatsAppLink>
            <p className="mt-3 text-xs leading-5 text-slate-400">Sample catalogue: confirm the final price, availability, and vehicle compatibility with the seller.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All parts')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    const result = products.filter((product) => {
      const matchesCategory = activeCategory === 'All parts' || product.category === activeCategory
      const matchesSearch = !term || [product.name, product.category, product.description, product.fitment].some((value) => value.toLowerCase().includes(term))
      return matchesCategory && matchesSearch
    })
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price)
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [activeCategory, search, sort])

  const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, 6)

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f7f8] text-slate-900">
      <div className="bg-[#101820] px-4 py-2.5 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        <span className="text-orange-400">●</span> {business.announcement} <span className="hidden sm:inline">— Serving drivers and workshops across Nigeria.</span>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="container-wide flex h-[76px] items-center justify-between gap-5">
          <a href="#home" className="flex shrink-0 items-center gap-3" aria-label={`${business.name} home`}>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500 text-white"><Wrench size={23} strokeWidth={2.4} /></span>
            <span><span className="font-display block text-lg font-bold leading-tight tracking-tight">{business.name}</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[.2em] text-slate-400">AUTOMOTIVE SUPPLY</span></span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            <a className="text-sm font-medium text-slate-600 transition hover:text-orange-600" href="#catalogue">Shop parts</a>
            <a className="text-sm font-medium text-slate-600 transition hover:text-orange-600" href="#why-us">Why us</a>
            <a className="text-sm font-medium text-slate-600 transition hover:text-orange-600" href="#contact">Contact</a>
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <a href="#catalogue" className="rounded-full px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Browse catalogue</a>
            <WhatsAppLink className="flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">Get a quote <ArrowUpRight size={16} /></WhatsAppLink>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 lg:hidden" aria-label="Toggle menu">{mobileMenuOpen ? <X /> : <Menu />}</button>
        </div>
        {mobileMenuOpen && <nav className="container-wide flex flex-col gap-1 pb-4 lg:hidden"><a className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-slate-100" href="#catalogue" onClick={() => setMobileMenuOpen(false)}>Shop parts</a><a className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-slate-100" href="#why-us" onClick={() => setMobileMenuOpen(false)}>Why us</a><a className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-slate-100" href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a><WhatsAppLink className="mt-2 rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white">Get a quote on WhatsApp</WhatsAppLink></nav>}
      </header>

      <main>
        <section id="home" className="relative isolate bg-[#101820] text-white">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_30%,rgba(249,115,22,.2),transparent_32%),linear-gradient(110deg,#101820_10%,#17232d_100%)]" />
          <div className="container-wide grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.02fr_.98fr] lg:gap-14 lg:py-24">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3.5 py-2 text-xs font-medium text-slate-200"><span className="h-2 w-2 rounded-full bg-orange-400" /> Dependable parts. Straightforward service.</div>
              <h1 className="font-display mt-7 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-.045em] sm:text-5xl lg:text-[64px]">The right parts.<br /><span className="text-orange-400">The road ahead.</span></h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">Find everyday automotive essentials, workshop tools, and replacement parts — all in one place.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#catalogue" className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-4 text-sm font-bold text-white transition hover:bg-orange-400">Explore the catalogue <ArrowRight size={17} /></a>
                <WhatsAppLink className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10">Ask about a part <ArrowUpRight size={17} /></WhatsAppLink>
              </div>
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6">
                <div><p className="font-display text-2xl font-bold">Quality</p><p className="mt-1 text-xs text-slate-400">First mindset</p></div>
                <div><p className="font-display text-2xl font-bold">Helpful</p><p className="mt-1 text-xs text-slate-400">Parts guidance</p></div>
                <div><p className="font-display text-2xl font-bold">Direct</p><p className="mt-1 text-xs text-slate-400">WhatsApp enquiry</p></div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-5 rounded-[32px] bg-orange-500/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-slate-800">
                <img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1400&q=90" alt="Automotive mechanic inspecting vehicle components" className="h-[300px] w-full object-cover sm:h-[410px] lg:h-[480px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/90 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                  <div><p className="eyebrow text-orange-300">For drivers & workshops</p><p className="font-display mt-2 text-xl font-semibold sm:text-2xl">Keep every journey moving.</p></div>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-slate-900"><ArrowDownRight size={22} /></span>
                </div>
              </div>
              <div className="absolute -left-3 top-8 hidden items-center gap-3 rounded-2xl bg-white p-4 text-slate-900 shadow-2xl sm:flex lg:-left-8"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-orange-600"><ShieldCheck size={22} /></span><span><strong className="block text-sm">Parts with purpose</strong><span className="mt-1 block text-xs text-slate-500">Confirm fit before you buy</span></span></div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="container-wide grid grid-cols-2 gap-5 py-6 sm:grid-cols-4 sm:py-7">
            {[{ icon: ShieldCheck, title: 'Fitment guidance', desc: 'Check before ordering' }, { icon: PackageCheck, title: 'Clear enquiries', desc: 'Know what you need' }, { icon: Truck, title: 'Delivery options', desc: 'Confirm at checkout' }, { icon: Headphones, title: 'Human support', desc: 'Talk to the team' }].map(({ icon: Icon, title, desc }) => <div key={title} className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700"><Icon size={19} /></span><span><strong className="block text-xs font-bold text-slate-900 sm:text-sm">{title}</strong><span className="mt-1 block text-[11px] text-slate-500 sm:text-xs">{desc}</span></span></div>)}
          </div>
        </section>

        <section id="catalogue" className="container-wide scroll-mt-24 py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><p className="eyebrow text-orange-600">The parts counter</p><h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Browse the catalogue.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">Explore a selection of automotive essentials. Need help choosing? Send an enquiry and confirm fitment with the team.</p></div>
            <div className="flex items-center gap-2 text-sm text-slate-500"><span className="grid h-9 w-9 place-items-center rounded-full bg-white"><Wrench size={17} /></span>{products.length} sample products</div>
          </div>

          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => { const Icon = categoryIcons[category] || Wrench; return <button key={category} onClick={() => { setActiveCategory(category); setShowAll(false) }} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition ${activeCategory === category ? 'border-[#101820] bg-[#101820] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}><Icon size={14} />{category}</button> })}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 sm:min-w-[230px]"><Search size={16} className="shrink-0 text-slate-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setShowAll(false) }} placeholder="Search parts..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" aria-label="Search products" /><button onClick={() => setSearch('')} className={search ? 'text-slate-500' : 'hidden'} aria-label="Clear search"><X size={14} /></button></label>
              <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"><SlidersHorizontal size={15} /><span className="sr-only">Sort products</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="max-w-full bg-transparent text-sm outline-none"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A–Z</option></select><ChevronDown size={14} /></label>
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between"><p className="text-xs text-slate-500">{filteredProducts.length} result{filteredProducts.length === 1 ? '' : 's'} {search ? `for “${search}”` : ''}</p><button onClick={() => { setSearch(''); setActiveCategory('All parts'); setSort('featured'); setShowAll(false) }} className="text-xs font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-orange-600">Reset filters</button></div>

          {visibleProducts.length ? <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-3">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onView={setSelectedProduct} />)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><Search className="mx-auto text-slate-400" size={28} /><h3 className="font-display mt-4 text-xl font-bold">No matching parts found</h3><p className="mt-2 text-sm text-slate-500">Try another search or select a different category.</p><button onClick={() => { setSearch(''); setActiveCategory('All parts') }} className="mt-5 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Clear filters</button></div>}
          {filteredProducts.length > 6 && !showAll && <div className="mt-9 text-center"><button onClick={() => setShowAll(true)} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-slate-900">View all parts <ArrowRight size={16} /></button></div>}
        </section>

        <section id="why-us" className="bg-white py-16 sm:py-20">
          <div className="container-wide grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div><p className="eyebrow text-orange-600">Made for the long run</p><h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Less guesswork.<br />More confidence.</h2><p className="mt-5 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">Finding the right component starts with the right information. Share your vehicle details or part number with the team before you order.</p><WhatsAppLink className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#101820] px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-600">Talk to the parts team <ArrowUpRight size={17} /></WhatsAppLink></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[{ icon: BadgeCheck, title: 'Fitment comes first', desc: 'Confirm make, model, year, and part numbers before buying.' }, { icon: Clock3, title: 'Straight answers', desc: 'Ask about availability and expected timelines before placing an order.' }, { icon: PackageCheck, title: 'Clear product details', desc: 'Review descriptions and specifications to help choose the right part.' }, { icon: Headphones, title: 'Real conversations', desc: 'Use WhatsApp to ask questions and get information from the business.' }].map(({ icon: Icon, title, desc }, index) => <div key={title} className={`rounded-2xl border border-slate-200 p-6 ${index === 0 ? 'bg-slate-50' : 'bg-white'}`}><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100 text-orange-700"><Icon size={21} /></span><h3 className="font-display mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p></div>)}
            </div>
          </div>
        </section>

        <section className="container-wide py-14 sm:py-20">
          <div className="relative overflow-hidden rounded-[28px] bg-orange-500 px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
            <div className="absolute -right-8 -top-24 h-72 w-72 rounded-full border-[38px] border-white/10" /><div className="absolute -bottom-32 right-40 h-64 w-64 rounded-full border-[28px] border-white/10" />
            <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center"><div><p className="eyebrow text-orange-100">Need help finding a part?</p><h2 className="font-display mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">Tell us what your vehicle needs.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-orange-50 sm:text-base">Send a part number, vehicle details, or a photo to start an enquiry.</p></div><WhatsAppLink className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-bold text-slate-900 transition hover:bg-orange-50">Start an enquiry <ArrowUpRight size={17} /></WhatsAppLink></div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-[#101820] text-white">
        <div className="container-wide grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_.8fr_1fr] lg:py-14">
          <div><a href="#home" className="inline-flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500"><Wrench size={22} /></span><span className="font-display text-lg font-bold">{business.name}</span></a><p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">{business.tagline} Automotive essentials for drivers, technicians, and workshops. Contact the team to confirm fitment, availability, and pricing.</p><p className="mt-5 text-xs text-slate-500">A customizable storefront template by MetroDEVOPS.</p></div>
          <div><p className="eyebrow text-slate-500">Explore</p><div className="mt-4 flex flex-col items-start gap-3 text-sm text-slate-300"><a className="hover:text-orange-400" href="#catalogue">Parts catalogue</a><a className="hover:text-orange-400" href="#why-us">Why choose us</a><a className="hover:text-orange-400" href="#contact">Contact</a></div></div>
          <div><p className="eyebrow text-slate-500">Contact the store</p><div className="mt-4 space-y-3 text-sm text-slate-300"><p>{business.phone}</p><p>{business.email}</p><p>{business.address}</p></div><WhatsAppLink className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-semibold transition hover:border-orange-400 hover:text-orange-400">Message on WhatsApp <ArrowUpRight size={14} /></WhatsAppLink></div>
        </div>
        <div className="border-t border-white/10"><div className="container-wide flex flex-col justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row"><span>© {new Date().getFullYear()} {business.name}. All rights reserved.</span><span>Demo catalogue — replace sample products, prices, and contact details before launch.</span></div></div>
      </footer>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}