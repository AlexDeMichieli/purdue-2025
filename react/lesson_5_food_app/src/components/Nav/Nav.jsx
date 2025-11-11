import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/home" className="hover:text-gray-300">Home</Link>
        <Link to="/recipes" className="hover:text-gray-300">Recipes</Link>
      </div>
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-gray-300">Login</Link>
        <button className="hover:text-gray-300">Logout</button>
      </div>
    </nav>
  );
}

export default Nav;
