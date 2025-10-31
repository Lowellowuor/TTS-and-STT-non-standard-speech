import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = React.useState('dark');
  const [showPalette, setShowPalette] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setShowPalette(false);
  };

  const accentColors = [
    { name: 'Blue', value: '#007AFF' },
    { name: 'Purple', value: '#5856D6' },
    { name: 'Green', value: '#30D158' },
    { name: 'Orange', value: '#FF6B35' },
    { name: 'Pink', value: '#FF2D55' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowPalette(!showPalette)}
        className="glass-button p-3 relative group"
        title="Theme Settings"
      >
        {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
        
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent-primary opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
      </button>

      {/* Theme Palette Dropdown */}
      {showPalette && (
        <div className="absolute top-full right-0 mt-2 glass-card p-4 w-64 z-50 animate-in">
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <div className="flex glass-button p-1">
                <button
                  onClick={() => toggleTheme('light')}
                  className={`p-2 rounded-lg transition-all ${
                    theme === 'light' ? 'bg-accent-primary text-white' : 'text-gray-400'
                  }`}
                >
                  <Sun size={16} />
                </button>
                <button
                  onClick={() => toggleTheme('dark')}
                  className={`p-2 rounded-lg transition-all ${
                    theme === 'dark' ? 'bg-accent-primary text-white' : 'text-gray-400'
                  }`}
                >
                  <Moon size={16} />
                </button>
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <span className="text-sm font-medium mb-3 block">Accent Color</span>
              <div className="grid grid-cols-5 gap-2">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => {
                      document.documentElement.style.setProperty('--accent-primary', color.value);
                      // Update secondary color to match
                      const secondaryMap = {
                        '#007AFF': '#5856D6',
                        '#5856D6': '#007AFF',
                        '#30D158': '#007AFF',
                        '#FF6B35': '#FF2D55',
                        '#FF2D55': '#FF6B35'
                      };
                      document.documentElement.style.setProperty('--accent-secondary', secondaryMap[color.value] || '#5856D6');
                    }}
                    className="w-8 h-8 rounded-full border-2 border-white/20 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Visual Effects */}
            <div>
              <span className="text-sm font-medium mb-3 block">Effects</span>
              <div className="flex space-x-2">
                <button className="glass-button flex-1 py-2 text-xs">
                  Blur On
                </button>
                <button className="glass-button flex-1 py-2 text-xs">
                  Animations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;