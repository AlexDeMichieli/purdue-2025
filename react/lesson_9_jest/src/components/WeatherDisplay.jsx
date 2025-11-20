/**
 * WeatherDisplay Component
 * 
 * Displays current weather conditions for a selected city.
 * Shows temperature, weather description, and additional metrics.
 * 
 * Props:
 * @param {Object} weather - Weather data object from the AccuWeather API
 */
const WeatherDisplay = ({ weather }) => {
  // Early return: if no weather data, don't render anything
  // This is a common pattern to handle conditional rendering
  if (!weather) {
    return null;
  }

  return (
    <div className="w-full max-w-md px-4 mt-6">
      {/* Weather card with gradient background for visual appeal */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Current Weather</h2>
        
        {/* Weather information container */}
        <div className="space-y-2">
          {/* Weather description (e.g., "Partly Cloudy", "Sunny") */}
          <p className="text-lg">{weather.WeatherText}</p>
          
          {/* 
            Temperature display with large, bold text
            Using optional chaining (?.) to safely access nested properties
            This prevents errors if the API structure changes or data is missing
          */}
          <p className="text-4xl font-bold">
            {weather.Temperature?.Metric?.Value}°{weather.Temperature?.Metric?.Unit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
