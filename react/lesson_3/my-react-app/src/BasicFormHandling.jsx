import React, { useState } from "react"; // Importing React and the useState hook for managing state

function BasicFormHandling() {
  // useState initializes two pieces of state: formValues and errors
  const [formValues, setFormValues] = useState({
    name: "", // Initial value for the "name" input field
    email: "", // Initial value for the "email" input field
    message: "", // Initial value for the "message" input field
  });

  const [errors, setErrors] = useState({
    name: false, // Tracks if there's an error for the "name" field
    email: false, // Tracks if there's an error for the "email" field
    message: false, // Tracks if there's an error for the "message" field
  });

  // Function to handle changes in input fields
  const handleChange = (event) => {
    const { name, value } = event.target; // Destructuring to get the name and value of the input field
    // Updating formValues state using the spread operator
    setFormValues({ 
      ...formValues, // Spread operator: copies all existing key-value pairs from formValues
      [name]: value, // Dynamically updates the key (name) with the new value
    });
    // Resetting the error for the specific field being updated
    setErrors({ 
      ...errors, // Spread operator: copies all existing key-value pairs from errors
      [name]: false, // Dynamically sets the error for the current field to false
    });
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior (page reload)
    let formValid = true; // Tracks whether the form is valid
    const errorsCopy = { ...errors }; // Creates a copy of the current errors state

    // Loop through each field in formValues to check for empty values
    for (const field in formValues) {
      if (!formValues[field]) { // If the field is empty
        formValid = false; // Mark the form as invalid
        errorsCopy[field] = true; // Set the error for the field to true
      }
    }

    setErrors(errorsCopy); // Update the errors state with the new errors
    if (formValid) {
      console.log("Form submitted with values: ", formValues); // Log the form values if valid
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formValues.name} // Controlled input: value is tied to formValues state
          onChange={handleChange} // Calls handleChange when the input value changes
        />
        {errors.name && <div className="error">Please enter your name</div>} {/* Error message */}
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formValues.email} // Controlled input: value is tied to formValues state
          onChange={handleChange} // Calls handleChange when the input value changes
        />
        {errors.email && <div className="error">Please enter a valid email address</div>} {/* Error message */}
      </div>
      <div>
        <label htmlFor="message">Message:</label>
        <textarea 
          id="message" 
          name="message" 
          value={formValues.message} // Controlled input: value is tied to formValues state
          onChange={handleChange} // Calls handleChange when the input value changes
        />
        {errors.message && <div className="error">Please enter a message</div>} {/* Error message */}
      </div>
      <button type="submit">Submit</button> {/* Submit button */}
    </form>
  );
}

export default BasicFormHandling;
