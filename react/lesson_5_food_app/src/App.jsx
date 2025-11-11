import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import SearchByName from './pages/SearchByName';
import SearchByIngredient from './pages/SearchByIngredient';
import RecipeDetails from './pages/RecipeDetail';

function App() {

  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<div>Login</div>} />
            <Route path="/home" element={<Dashboard/>} />
            <Route path="/recipes" element={<div>Recipes</div>} />
            <Route path="/name" element={<SearchByName />} />
            <Route path="/name/:recipeId" element={<RecipeDetails/>} />
            <Route path="/ingredient" element={<SearchByIngredient />} />
          </Routes>
        </Layout>
      </Router>
    </>
  )
}

export default App;
