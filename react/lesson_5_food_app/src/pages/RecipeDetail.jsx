import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetails = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
                const data = await response.json();
                console.log(data.meals[0], Object.keys(data.meals[0]));
                setRecipe(data.meals[0]);
            } catch (error) {
                console.error('Error fetching recipe data:', error);
            }
        };
        fetchRecipe();
    }, [recipeId]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Recipe Details</h1>
            {recipe ? (
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-3xl font-bold mb-4">{recipe.strMeal}</h2>
                    <img
                        src={recipe.strMealThumb}
                        alt={recipe.strMeal}
                        className="w-full h-auto rounded-lg mb-4"
                    />
                    <p className="text-lg mb-2">
                        <strong>Category:</strong> {recipe.strCategory}
                    </p>
                    <p className="text-lg mb-2">
                        <strong>Area:</strong> {recipe.strArea}
                    </p>
                    <p className="text-lg mb-4">
                        <strong>Instructions:</strong> {recipe.strInstructions}
                    </p>
                    <h3 className="text-xl font-bold mb-2">Ingredients:</h3>
                    <ul className="list-disc list-inside mb-4">
                        {Object.keys(recipe)
                            .filter((key) => key.startsWith('strIngredient') && recipe[key])
                            .map((key, index) => (
                                <li key={index}>
                                    {recipe[key]} - {recipe[`strMeasure${key.slice(13)}`]}
                                </li>
                            ))}
                    </ul>
                    <a
                        href={recipe.strYoutube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        Watch on YouTube
                    </a>
                </div>
            ) : (
                <p>Loading recipe details...</p>
            )}
        </div>
    );
};

export default RecipeDetails;