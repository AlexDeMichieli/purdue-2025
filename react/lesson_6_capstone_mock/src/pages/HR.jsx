import React, { useState } from 'react';
import EmployeeModal from "../components/EmployeeModal/EmployeeModal";

const HR = () => {
    const [employees, setEmployees] = useState([
        { name: "Alex", department: "Engineering", email: "alex@example.com" }
    ]);

    const [editingIndex, setEditingIndex] = useState(null); // Track which employee is being edited
    const [editedEmployee, setEditedEmployee] = useState({}); // Store the edited employee data

    // Function to add a new employee to the employees state
    const addEmployee = (newEmployee) => {
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    };

    // Function to delete an employee
    const deleteEmployee = (index) => {
        const updatedEmployees = [...employees];
        updatedEmployees.splice(index, 1);
        setEmployees(updatedEmployees);
    };
    console.log("current index", editingIndex)
    // Function to handle edit button click
    const handleEdit = (index) => {
        setEditingIndex(index); // Set the index of the employee being edited
        setEditedEmployee(employees[index]); // Pre-fill the form with the current employee data
    };

    // Function to handle input changes for the edited employee
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployee((prev) => ({
            ...prev,
            [name]: value, // Dynamically update the field being edited
        }));
    };

    // Function to save the edited employee
    const handleSave = (index) => {
        const updatedEmployees = [...employees];
        updatedEmployees[index] = editedEmployee; // Update the employee at the specified index
        setEmployees(updatedEmployees); // Update the state
        setEditingIndex(null); // Exit edit mode
        setEditedEmployee({}); // Clear the edited employee data
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">HR Policy Page</h1>
            <EmployeeModal addEmployee={addEmployee} />
            {employees.length > 0 && (
                <table className="min-w-full bg-white mt-4 border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Department</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={index}>
                                {editingIndex === index ? (
                                    <>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                name="name"
                                                value={editedEmployee.name}
                                                onChange={handleInputChange}
                                                className="border px-2 py-1"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                name="department"
                                                value={editedEmployee.department}
                                                onChange={handleInputChange}
                                                className="border px-2 py-1"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="email"
                                                name="email"
                                                value={editedEmployee.email}
                                                onChange={handleInputChange}
                                                className="border px-2 py-1"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleSave(index)}
                                                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Save
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-2 px-4 border-b">{employee.name}</td>
                                        <td className="py-2 px-4 border-b">{employee.department}</td>
                                        <td className="py-2 px-4 border-b">{employee.email}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleEdit(index)}
                                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteEmployee(index)}
                                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default HR;