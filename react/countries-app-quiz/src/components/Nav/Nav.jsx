import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <a href="/" className="hover:text-gray-300">Login</a>
      </div>
    </nav>
  );
}

export default Nav;
