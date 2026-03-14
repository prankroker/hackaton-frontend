import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Upload,
  Wand2,
  ImageIcon,
  ArrowRight,
  Sun,
  Trash2,
  Camera,
  Grid3x3,
  Layers,
  Download,
  Zap,
  Check,
  Menu
} from 'lucide-react';
import { BeforeAfterSlider } from './components/before-after-slider';

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const categories = ['all', 'clothing', 'sneakers', 'bags', 'accessories'];

  const galleryItems = [
    {
      category: 'sneakers',
      before: 'https://images.unsplash.com/photo-1573920265653-5ba7e5bfde9a?w=800',
      after: 'https://images.unsplash.com/photo-1756707235708-01aa79b8bf51?w=800',
    },
    {
      category: 'bags',
      before: 'https://images.unsplash.com/photo-1573920265653-5ba7e5bfde9a?w=800',
      after: 'https://images.unsplash.com/photo-1548175604-bc2d52e2271f?w=800',
    },
    {
      category: 'clothing',
      before: 'https://images.unsplash.com/photo-1573920265653-5ba7e5bfde9a?w=800',
      after: 'https://images.unsplash.com/photo-1620442771385-3f531ffdb9ca?w=800',
    },
    {
      category: 'accessories',
      before: 'https://images.unsplash.com/photo-1573920265653-5ba7e5bfde9a?w=800',
      after: 'https://images.unsplash.com/photo-1733908511568-3abc819b21b5?w=800',
    },
  ];

  const filteredItems = activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter(item => item.category === activeCategory);

  return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              <span className="font-semibold text-lg">SellShot</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-black transition">
                Features
              </button>
              <button onClick={() => scrollToSection('use-cases')} className="text-gray-600 hover:text-black transition">
                Use cases
              </button>
              <button onClick={() => scrollToSection('gallery')} className="text-gray-600 hover:text-black transition">
                Gallery
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-black transition">
                Pricing
              </button>
              <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-black transition">
                About
              </button>
            </nav>

            <Link to="/login" className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition">
              Get started
            </Link>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
              <div className="md:hidden bg-white shadow-lg">
                <nav className="flex flex-col items-center gap-4 px-6 py-4">
                  <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-black transition">
                    Features
                  </button>
                  <button onClick={() => scrollToSection('use-cases')} className="text-gray-600 hover:text-black transition">
                    Use cases
                  </button>
                  <button onClick={() => scrollToSection('gallery')} className="text-gray-600 hover:text-black transition">
                    Gallery
                  </button>
                  <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-black transition">
                    Pricing
                  </button>
                  <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-black transition">
                    About
                  </button>
                </nav>
              </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl mb-6">
                Turn messy product photos into images that sell
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Fix lighting, clean backgrounds, and generate multiple marketplace-ready angles.
                Perfect for resellers, marketplace sellers, and ecommerce stores.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/login" className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition inline-flex items-center gap-2">
                  Start generating
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                    onClick={() => scrollToSection('gallery')}
                    className="border border-black px-8 py-3 rounded-full hover:bg-gray-50 transition"
                >
                  View examples
                </button>
              </div>

              {/* Social Proof */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500 mb-4">Trusted by thousands of resellers and marketplace sellers</p>
                <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
                  <span>OLX</span>
                  <span>Facebook Marketplace</span>
                  <span>Vinted</span>
                  <span>Depop</span>
                  <span>Etsy</span>
                  <span>eBay</span>
                  <span>Shopify</span>
                </div>
              </div>
            </div>

            <div className="relative h-[500px]">
              <BeforeAfterSlider
                  beforeImage="https://images.unsplash.com/photo-1573920265653-5ba7e5bfde9a?w=800"
                  afterImage="https://images.unsplash.com/photo-1756707235708-01aa79b8bf51?w=800"
              />
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl text-center mb-16">Your product deserves better photos</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl mb-2">Bad lighting</h3>
                <p className="text-gray-600">
                  Poor lighting makes products look unprofessional and reduces buyer trust
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl mb-2">Messy backgrounds</h3>
                <p className="text-gray-600">
                  Cluttered backgrounds distract from your product and hurt conversions
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl mb-2">Only one photo</h3>
                <p className="text-gray-600">
                  Limited angles reduce buyer confidence and lead to more questions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl text-center mb-16">Create better product photos in seconds</h2>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4 text-sm">1</div>
                <h3 className="text-lg mb-2">Upload your photo</h3>
                <p className="text-gray-600 text-sm">
                  Drop any product photo, even with messy backgrounds
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-8 h-8" />
                </div>
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4 text-sm">2</div>
                <h3 className="text-lg mb-2">Describe the style you want</h3>
                <p className="text-gray-600 text-sm">
                  Tell our AI the look you're going for
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4 text-sm">3</div>
                <h3 className="text-lg mb-2">AI enhances the image</h3>
                <p className="text-gray-600 text-sm">
                  Watch as lighting, background, and quality improve
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Grid3x3 className="w-8 h-8" />
                </div>
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4 text-sm">4</div>
                <h3 className="text-lg mb-2">Generate additional angles</h3>
                <p className="text-gray-600 text-sm">
                  Create multiple views for carousel listings
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl text-center mb-4">See how one photo becomes a full product set</h2>
            <p className="text-center text-gray-600 mb-12">From a single messy photo to marketplace-ready carousel</p>

            {/* Transformation Demo Card */}
            <div className="bg-white rounded-3xl p-8 md:p-12 max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Original Photo */}
                <div>
                  <p className="text-sm text-gray-500 mb-3">Original</p>
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1573920265653-5ba7e5bfde9a?w=800"
                        alt="Original messy product photo"
                        className="w-full aspect-square object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs">
                      Bad lighting • Messy background
                    </div>
                  </div>
                </div>

                {/* Right Column: Generated Result with Angles */}
                <div>
                  <p className="text-sm text-gray-500 mb-3">Generated result with Angles</p>
                  <div className="flex gap-3 h-[400px]">
                    {/* Large Hero Image */}
                    <div className="flex-1 relative rounded-2xl overflow-hidden">
                      <img
                          src="https://images.unsplash.com/photo-1756707235708-01aa79b8bf51?w=800"
                          alt="AI enhanced product photo"
                          className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-black text-white px-3 py-1.5 rounded-full text-xs">
                        Main photo
                      </div>
                    </div>

                    {/* Vertical Stack of 4 Angle Thumbnails */}
                    <div className="flex flex-col gap-3 w-24">
                      <div className="flex-1 rounded-xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1548175604-bc2d52e2271f?w=400"
                            alt="Generated angle 1"
                            className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 rounded-xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1703034390224-f5f0a204abc7?w=400"
                            alt="Generated angle 2"
                            className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 rounded-xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1764698192457-c7cb840ecfa2?w=400"
                            alt="Generated angle 3"
                            className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 rounded-xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1625860191460-10a66c7384fb?w=400"
                            alt="Generated angle 4"
                            className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-1">1</div>
                  <div className="text-sm text-gray-600">Photo uploaded</div>
                </div>
                <div>
                  <div className="text-3xl mb-1">5</div>
                  <div className="text-sm text-gray-600">Images generated</div>
                </div>
                <div>
                  <div className="text-3xl mb-1">30s</div>
                  <div className="text-sm text-gray-600">Processing time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl text-center mb-16">Built for sellers</h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-2xl mb-3">Small ecommerce</h3>
                <p className="text-gray-600 mb-4">
                  Professional product photography for Etsy and Shopify stores without the studio costs.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Consistent brand look
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Studio-quality results
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Scale product photography
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-2xl mb-3">Dropshippers</h3>
                <p className="text-gray-600 mb-4">
                  Transform supplier photos into unique product images that help you stand out from competitors.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Customize supplier images
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Create unique variations
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Improve conversion rates
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl text-center mb-16">Everything you need to sell better</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl">
                <Sparkles className="w-8 h-8 mb-3" />
                <h3 className="text-lg mb-2">Realistic enhancement</h3>
                <p className="text-gray-600 text-sm">
                  AI improvements that look natural, not over-processed
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl">
                <ImageIcon className="w-8 h-8 mb-3" />
                <h3 className="text-lg mb-2">Marketplace-ready photos</h3>
                <p className="text-gray-600 text-sm">
                  Optimized for OLX, Vinted, eBay, and more
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl">
                <Grid3x3 className="w-8 h-8 mb-3" />
                <h3 className="text-lg mb-2">Generate multiple angles</h3>
                <p className="text-gray-600 text-sm">
                  Create different views from a single photo
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl">
                <Layers className="w-8 h-8 mb-3" />
                <h3 className="text-lg mb-2">Batch processing</h3>
                <p className="text-gray-600 text-sm">
                  Process multiple products at once to save time
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl">
                <Wand2 className="w-8 h-8 mb-3" />
                <h3 className="text-lg mb-2">Prompt control</h3>
                <p className="text-gray-600 text-sm">
                  Describe exactly the style and look you want
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl">
                <Download className="w-8 h-8 mb-3" />
                <h3 className="text-lg mb-2">Export carousel</h3>
                <p className="text-gray-600 text-sm">
                  Download all images ready for multi-photo listings
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl text-center mb-4">Simple pricing for sellers</h2>
            <p className="text-center text-gray-600 mb-16">Start free, upgrade as you grow</p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="border border-gray-200 p-8 rounded-2xl">
                <h3 className="text-2xl mb-2">Starter</h3>
                <div className="mb-6">
                  <span className="text-4xl">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    10 images per month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Basic enhancements
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Standard quality
                  </li>
                </ul>
                <Link to="/dashboard" className="block w-full text-center border border-black px-6 py-3 rounded-full hover:bg-gray-50 transition">
                  Get started
                </Link>
              </div>

              <div className="border-2 border-black p-8 rounded-2xl relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm">
                  Popular
                </div>
                <h3 className="text-2xl mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Unlimited images
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Advanced AI enhancements
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Generate multiple angles
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Batch processing
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Priority support
                  </li>
                </ul>
                <Link to="/dashboard" className="block w-full text-center bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
                  Start Pro trial
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl mb-6">Start improving your product photos today</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of sellers creating marketplace-ready images with AI
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login" className="bg-white text-black px-8 py-3 rounded-full hover:bg-gray-100 transition inline-flex items-center gap-2">
                Start generating
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                  onClick={() => scrollToSection('gallery')}
                  className="border border-white px-8 py-3 rounded-full hover:bg-white/10 transition"
              >
                View examples
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="about" className="py-12 px-6 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">SellShot</span>
                </div>
                <p className="text-sm text-gray-600">
                  Turn messy product photos into marketplace-ready images with AI
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><button onClick={() => scrollToSection('features')}>Features</button></li>
                  <li><button onClick={() => scrollToSection('use-cases')}>Use cases</button></li>
                  <li><button onClick={() => scrollToSection('gallery')}>Gallery</button></li>
                  <li><button onClick={() => scrollToSection('pricing')}>Pricing</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><button onClick={() => scrollToSection('about')}>About</button></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#">Privacy</a></li>
                  <li><a href="#">Terms</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
              © 2026 SellShot. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
  );
}