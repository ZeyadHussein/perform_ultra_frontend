// PerformUltraContact.jsx
import React from 'react';
import Sidebar from './Sidebar';
import '../Styles/PerformUltraContact.css';

const PerformUltraContact = () => {
  return (
    <div className="perform-ultra">
      <Sidebar />
      <div className="perform-ultra__content">
        <form className="perform-ultra__form">
          <div className="form-header">
            <h1 className="perform-ultra__title">Email Us</h1>
            <p className="perform-ultra__subtitle">We're here to help you succeed</p>
          </div>
          
          <p className="perform-ultra__welcome">
            Get in touch with our expert support team. We typically respond 
            within 1 business day. Your information is protected by 
            enterprise-grade security standards.
          </p>

          <div className="form-grid">
            <div className="perform-ultra__form-group">
              <label htmlFor="email" className="perform-ultra__label">
                Email Address
              </label>
              <div className="input-container">
                <input
                  type="email"
                  id="email"
                  className="perform-ultra__input"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="perform-ultra__form-group">
              <label htmlFor="message" className="perform-ultra__label">
                Message
              </label>
              
              <div className="input-container">
                <textarea
                  id="message"
                  className="perform-ultra__textarea"
                  placeholder="Describe your inquiry in detail..."
                  rows="6"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="perform-ultra__submit">
              Send Message
              <svg className="submit-icon" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerformUltraContact;