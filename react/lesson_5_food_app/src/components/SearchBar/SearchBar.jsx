
const SearchBar = ({ setSearchTerm }) => {
  
    const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search by name..."
      className="border border-gray-300 rounded-lg p-2 w-full"
      onChange={handleInputChange}
    />
  );
}

export default SearchBar;
