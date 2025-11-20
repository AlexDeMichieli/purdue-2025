// Import React hooks and axios for API calls
import { useState } from "react";
import axios from "axios";

// Import child components
import SearchBar from "./components/SearchBar";
import CityList from "./components/CityList";
import WeatherDisplay from "./components/WeatherDisplay";

/**
 * Main App Component
 * 
 * This is the main component that orchestrates the weather search application.
 * It manages all application state and coordinates communication between child components.
 * 
 * Data Flow:
 * 1. User enters a city name in SearchBar
 * 2. User clicks Search button, triggering handleSearch()
 * 3. API returns list of matching cities, stored in 'cities' state
 * 4. CityList displays the results
 * 5. User clicks "Fetch Weather" on a city, triggering handleFetchWeather()
 * 6. API returns weather data, stored in 'currentCity' state
 * 7. WeatherDisplay shows the weather information
 */
function App() {
  // ===== STATE MANAGEMENT =====
  
  // State for the search input value
  // This demonstrates "lifting state up" - the state lives in the parent (App)
  // and is passed down to the child (SearchBar) as props
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for storing the array of cities returned from the search API
  // Initially empty array []
  const [cities, setCities] = useState([]);
  
  // State for storing the current weather data for the selected city
  // Initially null until a city is selected
  const [currentCity, setCurrentCity] = useState(null);

  // ===== API CALL FUNCTIONS =====

  /**
   * handleSearch - Searches for cities matching the search term
   * 
   * This is an async function because API calls take time and return Promises.
   * The async/await syntax makes it easier to work with asynchronous code.
   */
  const handleSearch = async () => {
    try {
      // Make GET request to AccuWeather's city search endpoint
      const response = await axios.get(
        'https://dataservice.accuweather.com/locations/v1/cities/search',
        {
          // Query parameters sent with the request
          params: {
            q: searchTerm  // 'q' is the API's parameter for the search query
          },
          // Request headers - including our API key for authentication
          headers: {
            // Access environment variable using Vite's import.meta.env
            // NEVER hardcode API keys in production code!
            'Authorization': `Bearer ${import.meta.env.VITE_ACCUWEATHER_API_KEY}`
          }
        }
      );
      
      // Log the response for debugging purposes
      console.log('Response:', response.data);
      
      // Update the cities state with the API response data
      // This will trigger a re-render and display the cities in CityList
      setCities(response.data);
      
    } catch (error) {
      // Catch and log any errors (network issues, API errors, etc.)
      console.error('Error:', error);
      // In a production app, you might want to show an error message to the user
    }
  };

  /**
   * handleFetchWeather - Fetches current weather for a specific city
   * 
   * @param {Object} city - The city object from the search results
   * 
   * This function is passed down to CityList and called when a user
   * clicks "Fetch Weather" on a city
   */
  const handleFetchWeather = async (city) => {
    // Extract the city key (unique identifier) from the city object
    const cityKey = city.Key;
    
    // Inner function to fetch weather data
    // Note: This could be moved outside for better code organization
    const fetchCurrentWeather = async (cityKey) => {
      try {
        // Make GET request to AccuWeather's current conditions endpoint
        // The cityKey is used in the URL path to specify which city
        const response = await axios.get(
          `https://dataservice.accuweather.com/currentconditions/v1/${cityKey}`,
          {
            headers: {
              // Same authentication pattern as the search request
              'Authorization': `Bearer ${import.meta.env.VITE_ACCUWEATHER_API_KEY}`
            }
          }
        );
        
        // API returns an array with one object, so we take the first element [0]
        // Update the currentCity state with the weather data
        // This will trigger a re-render and display the weather in WeatherDisplay
        setCurrentCity(response.data[0]);
        
      } catch (error) {
        // Log any errors that occur during the weather fetch
        console.log('Error fetching weather:', error);
      }
    }
    
    // Call the inner function with the cityKey
    fetchCurrentWeather(cityKey);
  };
  
  // Debug log to see the current weather data in console
  console.log('Current city weather:', currentCity);

  // ===== RENDER =====
  
  return (
    // Main container with flexbox for vertical centering
    <div className="flex items-center justify-center min-h-screen flex-col px-4 py-8">
      {/* 
        SearchBar: Controlled component for user input
        - value: Current search term from state
        - onChange: Updates searchTerm state as user types
        - onSubmit: Triggers API search when button is clicked
      */}
      <SearchBar 
        value={searchTerm} 
        onChange={setSearchTerm} 
        onSubmit={handleSearch} 
      />
      
      {/* 
        CityList: Displays search results
        - cities: Array of city objects from API
        - onFetchWeather: Callback to fetch weather for selected city
      */}
      <CityList 
        cities={cities} 
        onFetchWeather={handleFetchWeather} 
      />
      
      {/* 
        WeatherDisplay: Shows weather for selected city
        - weather: Current weather data object
        - Component handles null/undefined gracefully (returns null if no data)
      */}
      <WeatherDisplay 
        weather={currentCity} 
      />
    </div>
  );
}

export default App;
