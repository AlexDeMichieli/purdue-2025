import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import HR from "./pages/HR";

function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem('role');
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/hr"
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <HR />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRoles={['employee', 'hr']}>
                  <h1 className="text-3xl font-bold">Employee Page</h1>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
