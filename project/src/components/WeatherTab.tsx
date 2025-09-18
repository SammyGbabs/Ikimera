import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react';

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    conditions: string;
    windSpeed: number;
    icon: string;
  };
  tomorrow: {
    temperature: number;
    humidity: number;
    conditions: string;
    windSpeed: number;
    icon: string;
  };
  location: string;
}

const WeatherTab = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported');
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    if (!location) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/weather?lat=${location.lat}&lon=${location.lon}`
      );

      if (response.ok) {
        const data = await response.json();
        setWeather(data);
      } else {
        setError('Failed to fetch weather data');
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
      setError('Unable to connect to weather service');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (conditions: string, iconCode: string = '') => {
    const conditionsLower = conditions.toLowerCase();
    
    if (conditionsLower.includes('rain') || conditionsLower.includes('shower')) {
      return <CloudRain size={32} />;
    } else if (conditionsLower.includes('cloud')) {
      return <Cloud size={32} />;
    } else {
      return <Sun size={32} />;
    }
  };

  if (loading) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="loading">
            <div className="spinner" />
            <p>Getting weather information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-header">
            <Cloud size={24} />
            <h2>Weather Forecast</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--error)' }}>
            <Cloud size={48} style={{ marginBottom: '16px' }} />
            <h3>Weather Unavailable</h3>
            <p>{error}</p>
            <button
              onClick={() => {
                setError('');
                setLoading(true);
                getCurrentLocation();
              }}
              className="btn btn-primary"
              style={{ marginTop: '16px' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <Cloud size={24} />
          <h2>Weather Forecast</h2>
        </div>

        {weather && (
          <>
            <p style={{ color: 'var(--neutral-600)', marginBottom: '20px', textAlign: 'center' }}>
              📍 {weather.location}
            </p>

            <div className="weather-cards">
              <div className="weather-card">
                <div style={{ marginBottom: '12px' }}>
                  {getWeatherIcon(weather.current.conditions, weather.current.icon)}
                </div>
                <div className="weather-temp">{weather.current.temperature}°C</div>
                <div className="weather-condition">{weather.current.conditions}</div>
                <div style={{ fontSize: '0.875rem', marginTop: '8px', opacity: 0.8 }}>
                  Today
                </div>
              </div>

              <div className="weather-card" style={{ background: 'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)' }}>
                <div style={{ marginBottom: '12px' }}>
                  {getWeatherIcon(weather.tomorrow.conditions, weather.tomorrow.icon)}
                </div>
                <div className="weather-temp">{weather.tomorrow.temperature}°C</div>
                <div className="weather-condition">{weather.tomorrow.conditions}</div>
                <div style={{ fontSize: '0.875rem', marginTop: '8px', opacity: 0.8 }}>
                  Tomorrow
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'var(--neutral-50)', marginTop: '16px' }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--neutral-700)' }}>Details</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Droplets size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>Humidity</div>
                    <div style={{ fontWeight: '600' }}>{weather.current.humidity}%</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wind size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>Wind Speed</div>
                    <div style={{ fontWeight: '600' }}>{weather.current.windSpeed} m/s</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Farming Tips</h4>
                <ul style={{ fontSize: '0.875rem', color: 'var(--neutral-700)', paddingLeft: '16px' }}>
                  {weather.current.humidity > 80 ? (
                    <li>High humidity - watch for fungal diseases</li>
                  ) : weather.current.humidity < 40 ? (
                    <li>Low humidity - consider additional watering</li>
                  ) : (
                    <li>Good humidity levels for most crops</li>
                  )}
                  
                  {weather.current.conditions.toLowerCase().includes('rain') ? (
                    <li>Rain expected - delay pesticide applications</li>
                  ) : (
                    <li>Good weather for field activities</li>
                  )}
                  
                  {weather.current.windSpeed > 10 ? (
                    <li>Strong winds - secure loose materials</li>
                  ) : (
                    <li>Calm conditions suitable for spraying</li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherTab;