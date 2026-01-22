import React, { useState } from 'react';
import '../Styles/AccessibilitySettings.css';
import Sidebar from './Sidebar';

const AccessibilitySettings = () => {
  // State to track selected color scheme and text style
  const [selectedColorScheme, setSelectedColorScheme] = useState('deuteranopia');
  const [selectedTextStyle, setSelectedTextStyle] = useState('normal');
  const [fontSize, setFontSize] = useState(16);  // State to adjust font size
  const [highContrast, setHighContrast] = useState(false);  // Toggle high contrast mode

  // Color schemes for different color blindness types
  const colorSchemes = {
    deuteranopia: [
      { color: '#007bff', label: 'Blue' },
      { color: '#fcbf49', label: 'Yellow' },
      { color: '#0d1b2a', label: 'Dark' },
    ],
    tritanopia: [
      { color: '#b91c1c', label: 'Red' },
      { color: '#14b8a6', label: 'Teal' },
      { color: '#94a3b8', label: 'Gray' },
    ],
  };

  // Available text styles
  const textStyles = ['normal', 'italic', 'underline'];

  return (
    <div className={`accessibility-container ${highContrast ? 'high-contrast' : ''}`}>
      <div className="sidebar-section">
        <Sidebar />
      </div>
      <div className="settings-content">
        <h1>Accessibility Settings</h1>

        <div className="color-settings">
          <h2>Colors</h2>
          <select
            value={selectedColorScheme}
            onChange={(e) => setSelectedColorScheme(e.target.value)}
            className="settings-dropdown"
          >
            <option value="deuteranopia">Deuteranopia / Protanopia</option>
            <option value="tritanopia">Tritanopia</option>
          </select>
          <div style={{ display: 'flex' }}>
            {colorSchemes[selectedColorScheme].map((color, index) => (
              <div
                key={index}
                className="color-sample"
                style={{ backgroundColor: color.color }}
                title={color.label}
              ></div>
            ))}
          </div>
        </div>

        <div className="text-style-settings">
          <h2>Text Styles</h2>
          <div className="text-style-options">
            {textStyles.map((style, index) => (
              <span
                key={index}
                style={style === selectedTextStyle ? { fontWeight: 'bold' } : {}}
                onClick={() => setSelectedTextStyle(style)}
                className={`text-style ${style}`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </span>
            ))}
          </div>
        </div>

        <div className="font-size-settings">
          <h2>Font Size</h2>
          <input
            type="range"
            min="12"
            max="30"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="font-size-slider"
          />
          <span>{fontSize}px</span>
        </div>

        <div className="contrast-settings">
          <h2>High Contrast</h2>
          <label className="switch">
            <input
              type="checkbox"
              checked={highContrast}
              onChange={() => setHighContrast(!highContrast)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <h1
          className={`heading-one ${selectedTextStyle}`}
          style={{ fontSize: `${fontSize}px`, marginTop: '1rem' }}
        >
          Heading 1
        </h1>
        <h2 className={`heading-two ${selectedTextStyle}`} style={{ fontSize: `${fontSize}px` }}>
          Heading 2
        </h2>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
