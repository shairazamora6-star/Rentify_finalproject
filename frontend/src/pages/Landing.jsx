import { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Camera, ChevronRight, Clock3, Heart, MapPin, Menu, Search, ShieldCheck, Sparkles, Star, Truck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import RentalAssistant from '../components/RentalAssistant';
import RentifyLogo from '../components/RentifyLogo';
import './Landing.css';

const categories = [
  { label: 'Camera & tech', value: 'cameras', icon: Camera },
  { label: 'Tools & DIY', value: 'tools', icon: Sparkles },
  { label: 'Gaming', value: 'gaming', icon: ArrowUpRight },
  { label: 'Outdoor & sport', value: 'sports', icon: MapPin },
  { label: 'Electronics', value: 'electronics', icon: ShieldCheck },
  { label: 'Everything else', value: 'all', icon: ArrowRight },
];

const formatPrice = value => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(value);

export default function Landing() {
  const navigate = useNavigate();
  const { items, toggleFavorite, isFavorited } = useApp();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const search = (event) => {
    event.preventDefault();
    navigate(`/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  const browseCategory = (category) => navigate(`/search?category=${category}`);

  return (
    <div className="storefront">
      <div className="store-announcement">
        <span>Good things are closer than you think</span>
        <span className="announcement-divider">·</span>
        <span>Rent from people in your neighborhood</span>
        <ArrowRight size={14} aria-hidden="true" />
      </div>

      <header className="store-header">
        <a className="store-brand" href="/" aria-label="Rentify home">
          <span className="brand-mark"><RentifyLogo size={35} /></span>
          <span>rentify<span className="brand-period">.</span></span>
        </a>
        <nav className={`store-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href="#discover" onClick={() => setMenuOpen(false)}>Discover</a>
          <a href="#categories" onClick={() => setMenuOpen(false)}>Categories</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
        </nav>
        <div className="store-account">
  <button className="store-signin" onClick={() => navigate('/login')}>
    Log in
  </button>

  <button className="store-admin" onClick={() => navigate('/admin/login')}>
    Admin
  </button>

  <button className="store-join" onClick={() => navigate('/register')}>
    Join Rentify <ArrowRight size={15} />
  </button>
</div>
        <button className="store-menu-button" onClick={() => setMenuOpen(open => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <main>
        <section className="store-hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> THE NEIGHBORHOOD RENTAL MARKETPLACE</div>
            <h1>Big plans.<br />No big <span>purchases.</span></h1>
            <p className="hero-description">From weekend projects to once-in-a-lifetime moments, find the things you need — right around the corner.</p>
            <form className="hero-search" onSubmit={search}>
              <Search size={20} aria-hidden="true" />
              <input aria-label="Search rentals" value={query} onChange={event => setQuery(event.target.value)} placeholder="What are you looking to rent?" />
              <button type="submit">Find a rental <ArrowRight size={16} /></button>
            </form>
            <button className="hero-note" onClick={() => navigate('/nearby')}><MapPin size={15} /> Explore rentals near you <ArrowRight size={14} /></button>
          </div>
          <div className="hero-art">
            <img className="hero-image" src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=85" alt="Laptop and camera ready for a creative project" />
            <div className="hero-image-shade" />
            <div className="hero-photo-caption"><span className="caption-pip" /> YOUR NEXT GREAT IDEA STARTS HERE</div>
            <div className="hero-float-card">
              <div className="float-icon"><ShieldCheck size={19} /></div>
              <div><strong>Good gear. Good people.</strong><span>Verified local community</span></div>
              <BadgeCheck size={18} className="float-check" />
            </div>
            <div className="hero-sticker"><span>USE MORE</span><ArrowDown size={18} /><span>OWN LESS</span></div>
          </div>
        </section>

        <div className="trust-strip" aria-label="Why rent with Rentify">
          <div><ShieldCheck /><span><strong>Rent with confidence</strong><small>Verified people, safer handoffs</small></span></div>
          <div><MapPin /><span><strong>Close to home</strong><small>Discover great finds nearby</small></span></div>
          <div><Clock3 /><span><strong>Only as long as you need</strong><small>Flexible rentals, easy returns</small></span></div>
          <div><Truck /><span><strong>Keep things in use</strong><small>A smarter way to get what you need</small></span></div>
        </div>

        <section className="store-section category-section" id="categories">
          <div className="section-heading">
            <div><span className="section-kicker">A LITTLE BIT OF EVERYTHING</span><h2>What do you need today?</h2></div>
            <button className="text-link" onClick={() => browseCategory('all')}>Explore all categories <ArrowRight size={16} /></button>
          </div>
          <div className="category-grid">
            {categories.map(({ label, value, icon: Icon }, index) => (
              <button className={`category-tile category-tone-${index + 1}`} key={value} onClick={() => browseCategory(value)}>
                <span className="category-icon"><Icon size={21} strokeWidth={1.8} /></span>
                <span>{label}</span>
                <ArrowUpRight className="category-arrow" size={17} />
              </button>
            ))}
          </div>
        </section>

        <section className="discover-section" id="discover">
          <div className="store-section">
            <div className="section-heading">
              <div><span className="section-kicker">GOOD FINDS, READY WHEN YOU ARE</span><h2>Popular around Rentify</h2></div>
              <button className="text-link" onClick={() => browseCategory('all')}>See everything <ArrowRight size={16} /></button>
            </div>
            <div className="listing-grid">
              {items.slice(0, 4).map((item, index) => (
                <article className="listing-card" key={item.id}>
                  <button className="listing-image-button" onClick={() => navigate(`/item/${item.id}`)} aria-label={`View ${item.title}`}>
                    <img className="listing-image" src={item.image} alt={item.title} loading={index > 1 ? 'lazy' : 'eager'} />
                    {item.featured && <span className="listing-badge"><Sparkles size={12} /> COMMUNITY PICK</span>}
                  </button>
                  <button className={`listing-favorite${isFavorited(item.id) ? ' is-favorite' : ''}`} onClick={() => toggleFavorite(item.id)} aria-label={isFavorited(item.id) ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}>
                    <Heart size={17} fill={isFavorited(item.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button className="listing-info" onClick={() => navigate(`/item/${item.id}`)}>
                    <span className="listing-category">{item.category}</span>
                    <span className="listing-title">{item.title}</span>
                    <span className="listing-meta"><span><Star size={13} fill="currentColor" /> {item.rating}</span><span><MapPin size={12} /> {item.distance}</span></span>
                    <span className="listing-price">{formatPrice(item.price)} <small>/ {item.pricePeriod || 'day'}</small><ChevronRight size={16} /></span>
                  </button>
                </article>
              ))}
            </div>
            <button className="browse-all-button" onClick={() => navigate('/register')}>Browse all rentals <ArrowRight size={16} /></button>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="store-section how-layout">
            <div className="how-intro">
              <span className="section-kicker">EASY AS IT SHOULD BE</span>
              <h2>Find it. Book it.<br /><span>Get on with it.</span></h2>
              <p>Skip the ownership, not the experience. Your next rental is just around the corner.</p>
              <button className="text-link" onClick={() => navigate('/register')}>Get started for free <ArrowRight size={16} /></button>
            </div>
            <div className="how-steps">
              <article><span className="step-number">01</span><div><h3>Find your thing</h3><p>Search local listings and discover just what you need.</p></div><Search size={20} /></article>
              <article><span className="step-number">02</span><div><h3>Choose your dates</h3><p>Book the days that work for your plans. No long-term commitment.</p></div><Clock3 size={20} /></article>
              <article><span className="step-number">03</span><div><h3>Pick up & enjoy</h3><p>Meet your local host, grab your gear, and make it happen.</p></div><ArrowUpRight size={20} /></article>
            </div>
          </div>
        </section>

        <section className="community-cta">
          <div className="cta-pattern" />
          <div className="cta-copy"><span>MAKE ROOM FOR MORE</span><h2>Less owning.<br />More doing.</h2><p>Join a community that believes the best things are better when shared.</p></div>
          <button onClick={() => navigate('/register')}>Find your next rental <ArrowRight size={17} /></button>
        </section>
      </main>

      <footer className="store-footer">
        <a className="store-brand" href="/" aria-label="Rentify home"><span className="brand-mark"><RentifyLogo size={30} /></span><span>rentify<span className="brand-period">.</span></span></a>
        <span>Borrow a little. Live a lot.</span>
        <span>© 2025 Rentify · Made for sharing</span>
      </footer>
      <RentalAssistant />
    </div>
  );
}
