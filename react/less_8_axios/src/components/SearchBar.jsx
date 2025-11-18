/**
 * SearchBar Component
 * 
 * A reusable search input component with a submit button.
 * This component is a "controlled component" - its value is controlled by the parent component.
 * 
 * Props:
 * @param {string} value - The current value of the search input (controlled by parent state)
 * @param {function} onChange - Callback function called when the input value changes
 * @param {function} onSubmit - Callback function called when the Search button is clicked
 */
const SearchBar = ({ value, onChange, onSubmit }) => {
  return (
    // Container with max width to prevent the search bar from stretching too wide
    <div className="mb-4 px-4 w-full max-w-md">
      {/* Flexbox container to place input and button side by side */}
      <div className="flex gap-2">
        {/* Controlled input - value comes from parent, changes sent back via onChange */}
        <input
          type="text"
          value={value}
          // When user types, extract the new value and pass it to parent via onChange
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search..."
          className="border border-gray-300 rounded-full px-6 py-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {/* Submit button triggers the search action in the parent component */}
        <button
          onClick={onSubmit}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
