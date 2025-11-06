import React, { useState, useEffect } from 'react';

const FetchData = () => {
  const [selectedItem, setSelectedItem] = useState('posts'); // State to track the selected item
  const [data, setData] = useState([]); // State to store fetched data

  useEffect(() => {
    // useEffect runs whenever `selectedItem` changes
    const fetchData = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/${selectedItem}`);
        const result = await response.json();
        setData(result); // Update the data state with the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetchData function
  }, [selectedItem]); // Dependency array: useEffect runs only when `selectedItem` changes

  return (
    <div>
      <h2>Fetch Data Example</h2>
      <label htmlFor="data-select">Choose what to fetch:</label>
      <select
        id="data-select"
        value={selectedItem}
        onChange={(e) => setSelectedItem(e.target.value)} // Update `selectedItem` when the user selects an option
      >
        <option value="posts">Posts</option>
        <option value="comments">Comments</option>
        <option value="users">Users</option>
      </select>
      <h3>Fetched Data:</h3>
      <ul>
        {data.slice(0, 5).map((item, index) => (
          <li key={index}>
            {typeof item === 'object' ? JSON.stringify(item) : item} {/* Display fetched data */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchData;
