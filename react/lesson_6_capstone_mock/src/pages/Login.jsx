import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example credentials for validation
    const hrCredentials = { username: "hr", password: "hr123" };
    const employeeCredentials = { username: "employee", password: "emp123" };

    if (
      formData.username === hrCredentials.username &&
      formData.password === hrCredentials.password
    ) {
      localStorage.setItem('role', 'hr'); // Save role in localStorage
      navigate("/hr");
    } else if (
      formData.username === employeeCredentials.username &&
      formData.password === employeeCredentials.password
    ) {
      localStorage.setItem('role', 'employee'); // Save role in localStorage
      navigate("/employee");
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 p-4 max-w-md mx-auto border rounded shadow-md">
      <h1 className="text-3xl font-bold">Login</h1>
      <div className="flex flex-col w-full">
        <label htmlFor="username" className="mb-1">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          className="p-2 border rounded"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="password" className="mb-1">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="p-2 border rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            name="role"
            value="employee"
            className="mr-2"
            onChange={handleChange}
            required
          />
          Employee
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="hr"
            className="mr-2"
            onChange={handleChange}
            required
          />
          HR
        </label>
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
    </form>
  );
}

export default Login;
