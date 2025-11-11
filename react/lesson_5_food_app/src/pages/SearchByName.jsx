import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';

function SearchByName() {
    const [searchTerm, setSearchTerm] = useState('');
    const [recipes, setRecipes] = useState([]);

    const handleSubmit = () => {
        const searcRecipe = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
                const data = await response.json();
                setRecipes(data.meals || []);
            } catch (error) {
                console.error('Error fetching recipe data:', error);
            }
        }
        searcRecipe();
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Search Recipes by Name</h1>
            <SearchBar setSearchTerm={setSearchTerm} />
            <p className="mt-4">Searching for: <strong>{searchTerm}</strong></p>
            <div className="flex justify-center mt-6">
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Submit
                </button>
            </div>
            {recipes.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipes.map((recipe) => (
                        <div key={recipe.idMeal} className="border border-gray-300 rounded-lg p-4">
                            <h2 className="text-xl font-bold mb-2">{recipe.strMeal}</h2>
                            <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-auto rounded-lg mb-2" />
                            <p><strong>Category:</strong> {recipe.strCategory}</p>
                            <p><strong>Area:</strong> {recipe.strArea}</p>
                            <Link to={`/name/${recipe.idMeal}`} className="text-blue-500 hover:underline mt-2 inline-block">
                                View Details</Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-6">No recipes found.</p>
            )}
        </div>
    );
}

export default SearchByName;
