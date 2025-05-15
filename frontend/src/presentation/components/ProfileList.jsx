import React from 'react';

/**
 * ProfileList Component:
 *
 * This component displays a table of user profiles.  It receives an array of profile objects
 * as a prop and renders each profile in a table row.  It also provides "Editar" and "Excluir"
 * buttons for each profile, which call callback functions passed as props.
 */
export default function ProfileList({ profiles, onEdit, onDelete }) {
  // Render the table:
  return (
    <table border="1" cellPadding="5" style={{ width: '100%', marginBottom: '2rem' }}>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {/* Map over the 'profiles' array to render a table row for each profile. */}
        {profiles.map((p) => (
          <tr key={p.userEmail}> {/* Use userEmail as the key, assuming it's unique. */}
            <td>{p.firstName}</td>
            <td>{p.lastName}</td>
            <td>{p.phone}</td>
            <td>{p.userEmail}</td>
            <td>
              {/* Button to edit the profile. */}
              <button
                onClick={() => onEdit(p)} // Calls the 'onEdit' callback with the profile data when clicked.
                style={{ marginRight: '0.5rem' }} // Adds some right margin for spacing.
              >
                Editar
              </button>
              {/* Button to delete the profile. */}
              <button onClick={() => onDelete(p.userEmail)}>Excluir</button>  {/* Calls the 'onDelete' callback with the userEmail when clicked. */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
