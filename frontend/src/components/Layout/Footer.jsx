import React from 'react';
import { 
  Heart, MessageSquare, Globe, Mail, Phone, MapPin,
  Twitter, Facebook, Instagram, Linkedin, Github,
  Shield, Zap, Users, Award, ArrowUp
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Blog', href: '#blog' }
  ];

  const solutions = [
    { name: 'Daily Communicator', href: '#daily' },
    { name: 'Voice Personalizer', href: '#voice' },
    { name: 'Content Amplifier', href: '#content' },
    { name: 'Smart Predictor', href: '#predictor' },
    { name: 'Symbol Board', href: '#symbols' },
    { name: 'Emergency Mode', href: '#emergency' }
  ];

  const support = [
    { name: 'Help Center', href: '#help' },
    { name: 'Documentation', href: '#docs' },
    { name: 'Video Tutorials', href: '#tutorials' },
    { name: 'Community Forum', href: '#forum' },
    { name: 'Contact Support', href: '#contact' }
  ];

  const legal = [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'Accessibility', href: '#accessibility' },
    { name: 'Compliance', href: '#compliance' }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/voiceforge', color: 'hover:text-blue-400' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/voiceforge', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/voiceforge', color: 'hover:text-pink-500' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/voiceforge', color: 'hover:text-blue-500' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/voiceforge', color: 'hover:text-gray-400' }
  ];

  const contactInfo = [
    { icon: Mail, text: 'support@voiceforge.com', href: 'mailto:support@voiceforge.com' },
    { icon: Phone, text: '+254 700 123 456', href: 'tel:+254700123456' },
    { icon: MapPin, text: 'Nairobi, Kenya', href: '#location' }
  ];

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          
          {/* Brand Section */}
          <div className="brand-section">
            <div className="brand-logo">
              <div className="logo-icon">
                <MessageSquare size={24} />
              </div>
              <div className="brand-text">
                <span className="brand-name">VoiceForge</span>
                <span className="brand-tagline">Empowering Communication</span>
              </div>
            </div>
            
            <p className="brand-description">
              Transforming how people communicate through AI-powered assistive technology. 
              Making every voice heard, clearly and confidently.
            </p>
            
            <div className="contact-info">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="contact-item"
                >
                  <item.icon size={16} />
                  <span>{item.text}</span>
                </a>
              ))}
            </div>

            <div className="social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`social-link ${social.color}`}
                  aria-label={`Follow us on ${social.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="links-sections">
            <div className="links-column">
              <h3 className="links-title">Solutions</h3>
              <ul className="links-list">
                {solutions.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="links-column">
              <h3 className="links-title">Support</h3>
              <ul className="links-list">
                {support.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="links-column">
              <h3 className="links-title">Company</h3>
              <ul className="links-list">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="links-column">
              <h3 className="links-title">Legal</h3>
              <ul className="links-list">
                {legal.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="newsletter-section">
            <h3 className="newsletter-title">
              <Zap size={20} />
              <span>Stay Updated</span>
            </h3>
            <p className="newsletter-description">
              Get the latest features and updates delivered to your inbox.
            </p>
            
            <form className="newsletter-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </div>
              <p className="newsletter-note">
                No spam, unsubscribe at any time
              </p>
            </form>

            <div className="trust-badges">
              <div className="trust-badge">
                <Shield size={16} />
                <span>Secure & Private</span>
              </div>
              <div className="trust-badge">
                <Users size={16} />
                <span>10,000+ Users</span>
              </div>
              <div className="trust-badge">
                <Award size={16} />
                <span>Award Winning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} VoiceForge. All rights reserved.</p>
              <p className="made-with">
                Made with <Heart size={14} className="heart-icon" /> in Kenya
              </p>
            </div>
            
            <div className="bottom-links">
              <a href="#accessibility" className="bottom-link">
                <Globe size={14} />
                <span>Accessibility Statement</span>
              </a>
              <span className="separator">•</span>
              <a href="#sitemap" className="bottom-link">
                Sitemap
              </a>
            </div>

            <button 
              onClick={scrollToTop}
              className="back-to-top"
              aria-label="Back to top"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;