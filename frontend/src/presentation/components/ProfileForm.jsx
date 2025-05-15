import React, { useState, useEffect } from 'react';

/**
 * ProfileForm Component:
 *
 * This component renders a form for creating or editing user profile information.  It receives
 * initial profile data as a prop and provides input fields for first name, last name, phone,
 * and user email.  It uses state to manage the form values and calls callback functions
 * for saving or canceling the form submission.
 */
export default function ProfileForm({ profile, onSubmit, onCancel }) {
  // Declare state variables for each form field, initialized with empty strings.
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');

  /**
   * useEffect Hook:
   *
   * This hook is responsible for updating the form's state when the 'profile' prop changes.
   * If a 'profile' object is passed to the component (meaning we are editing an existing profile),
   * the hook updates the corresponding state variables with the values from the profile object.
   *
   * Dependencies: [profile] - This effect will run whenever the 'profile' prop changes.
   */
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setPhone(profile.phone);
      setUserEmail(profile.userEmail);
    }
  }, [profile]);

  /**
   * handleSubmit Function:
   *
   * This function is called when the form is submitted.  It prevents the default form submission
   * behavior (which would cause a page reload) and calls the 'onSubmit' callback function
   * passed as a prop, providing it with an object containing the current form values.
   *
   * @param e The submit event object.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior.
    onSubmit({ firstName, lastName, phone, userEmail }); // Calls the onSubmit callback with form data.
  };

  // Render the form:
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <div>
        <label>First Name: </label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)} // Updates firstName state when input changes.
          required // Makes this field required.
        />
      </div>
      <div>
        <label>Last Name: </label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)} // Updates lastName state when input changes.
          required // Makes this field required.
        />
      </div>
      <div>
        <label>Phone: </label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)} // Updates phone state when input changes.
          required // Makes this field required.
        />
      </div>
      <div>
        <label>User Email: </label>
        <input
          type="email" // Sets input type to email for validation and better UI.
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)} // Updates userEmail state when input changes.
          required // Makes this field required.
        />
      </div>
      {/* Buttons for saving or canceling the form. */}
      <button type="submit" style={{ marginRight: '0.5rem' }}>
        Salvar
      </button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
}
