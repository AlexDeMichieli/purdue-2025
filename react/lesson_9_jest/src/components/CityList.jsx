/**
 * CityList Component
 * 
 * Displays a list of cities returned from the AccuWeather API search.
 * Each city has a "Fetch Weather" button to retrieve current weather conditions.
 * 
 * Props:
 * @param {Array} cities - Array of city objects from the API response
 * @param {function} onFetchWeather - Callback function to fetch weather for a specific city
 */
const CityList = ({ cities, onFetchWeather }) => {
  // Early return: if no cities, don't render anything
  // This prevents errors and unnecessary DOM rendering
  if (!cities || cities.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md px-4">
      {/* Unordered list with styling for a card-like appearance */}
      <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
        {/* 
          Map over cities array to create a list item for each city
          Key prop is required by React to efficiently track list items
          Using city.Key from the API as the unique identifier
        */}
        {cities.map((city) => (
          <li key={city.Key} className="p-4 flex items-center justify-between hover:bg-gray-50">
            {/* City information display */}
            <div>
              {/* Primary city name and country */}
              <p className="font-semibold text-gray-800">
                {city.LocalizedName}, {city.Country?.LocalizedName}
              </p>
              {/* Secondary information: state/province/region */}
              <p className="text-sm text-gray-600">
                {/* Using optional chaining (?.) to safely access nested properties */}
                {city.AdministrativeArea?.LocalizedName}
              </p>
            </div>
            {/* 
              Button to fetch weather for this specific city
              Passes the entire city object to the parent handler
            */}
            <button
              onClick={() => onFetchWeather(city)}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Fetch Weather
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CityList;
