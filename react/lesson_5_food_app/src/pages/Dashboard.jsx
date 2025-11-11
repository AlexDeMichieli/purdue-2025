import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Link to="/name" className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center hover:bg-blue-600">
        <span className="text-4xl mb-2">🔍</span>
        <h2 className="text-xl font-bold">Search by Name</h2>
      </Link>
      <Link to="/ingredient" className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center hover:bg-green-600">
        <span className="text-4xl mb-2">🥦</span>
        <h2 className="text-xl font-bold">Search by Ingredient</h2>
      </Link>
    </div>
  );
}

export default Dashboard;
