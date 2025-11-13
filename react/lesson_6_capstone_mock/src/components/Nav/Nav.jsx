import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-gray-300">Login</Link>
      </div>
      <div className="flex space-x-4">
        <Link to="/HR" className="hover:text-gray-300">HR Policy</Link>
        <Link to="/employee" className="hover:text-gray-300">Employee Policy</Link>
      </div>
    </nav>
  );
}

export default Nav;
