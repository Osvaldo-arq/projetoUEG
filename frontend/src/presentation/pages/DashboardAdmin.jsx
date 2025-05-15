import React, { useState, useEffect } from 'react';

import PoemService from '../../application/PoemService';
import PoemList from '../components/PoemList';
import PoemForm from '../components/PoemForm';

import ProfileService from '../../application/ProfileService';
import ProfileList from '../components/ProfileList';
import ProfileForm from '../components/ProfileForm';


/**
 * DashboardAdmin Component:
 *
 * This component represents the admin dashboard, providing functionality to manage poems and profiles.
 * It includes a sidebar for navigation and a main content area for displaying and managing data.
 */
export default function DashboardAdmin() {
  // State variables:
  const [section, setSection] = useState('poems');       // Controls which section is displayed ('poems', 'profiles', 'users').
  const [error, setError] = useState(null);           // Stores any error messages.

  // Poem-related state:
  const [poems, setPoems] = useState([]);             // Stores the list of poems.
  const [editingPoem, setEditingPoem] = useState(null); // Stores the poem being edited.
  const [showPoemForm, setShowPoemForm] = useState(false); // Controls the visibility of the poem form.

  // Profile-related state:
  const [profiles, setProfiles] = useState([]);         // Stores the list of profiles.
  const [editingProfile, setEditingProfile] = useState(null); // Stores the profile being edited.
  const [showProfileForm, setShowProfileForm] = useState(false); // Controls the visibility of the profile form.


  /**
   * useEffect Hook:
   *
   * This hook is used to load initial data when the component mounts.  It calls loadPoems and loadProfiles.
   *
   * Dependencies: [] - This effect runs only once, when the component is mounted.
   */
  useEffect(() => {
    loadPoems();    // Load poems on component mount.
    loadProfiles(); // Load profiles on component mount.
  }, []);

  /**
   * loadPoems Function:
   *
   * Fetches the list of poems from the PoemService and updates the 'poems' state.
   * Handles errors and updates the 'error' state if necessary.
   */
  const loadPoems = async () => {
    try {
      setPoems(await PoemService.listAll()); // Fetch poems and update state.
    } catch (e) {
      setError(e.message); // Store error message.
    }
  };

  /**
   * loadProfiles Function:
   *
   * Fetches the list of profiles from the ProfileService and updates the 'profiles' state.
   * Handles errors and updates the 'error' state if necessary.
   */
  const loadProfiles = async () => {
    try {
      setProfiles(await ProfileService.listAll()); // Fetch profiles and update state.
    } catch (e) {
      setError(e.message); // Store error message.
    }
  };


  // Poem Handlers:
  /**
   * handlePoemSubmit Function:
   *
   * Handles the submission of the poem form (both create and update).  It calls the appropriate PoemService
   * method (create or update) and then reloads the poem list.  It also resets the form state.
   *
   * @param poem The poem data from the form.
   */
  const handlePoemSubmit = async (poem) => {
    try {
      if (editingPoem) {
        await PoemService.update(editingPoem.id, poem); // Update existing poem.
      } else {
        await PoemService.create(poem);            // Create a new poem.
      }
      setShowPoemForm(false);    // Hide the form after submission.
      setEditingPoem(null);     // Reset editing state.
      loadPoems();             // Reload the poem list.
    } catch (e) {
      setError(e.message); // Store error message.
    }
  };

  /**
   * handlePoemDelete Function:
   *
   * Handles the deletion of a poem by its ID.  It calls the PoemService.deleteById method and
   * then reloads the poem list.  It also handles errors.
   *
   * @param id The ID of the poem to delete.
   */
  const handlePoemDelete = async (id) => {
    try {
      await PoemService.deleteById(id); // Delete the poem.
      loadPoems();                 // Reload the poem list.
    } catch (e) {
      setError(e.message); // Store error message.
    }
  };

  // Profile Handlers:
    /**
   * handleProfileSubmit Function:
   *
   * Handles the submission of the profile form.  It calls the ProfileService.create method
   * and then reloads the profile list.  It also resets the form state.
   *
   * @param profile The profile data from the form.
   */
  const handleProfileSubmit = async (profile) => {
    try {
      await ProfileService.create(profile); // Create new profile
      setShowProfileForm(false);   // Hide form
      setEditingProfile(null);    // Reset editing state
      loadProfiles();            // Reload profile list
    } catch (e) {
      setError(e.message);
    }
  };

  /**
   * handleProfileDelete Function:
   *
   * Handles the deletion of a profile by its email. It calls the ProfileService.deleteByEmail method and
   * then reloads the profile list.
   *
   * @param email The email of the profile to delete.
   */
  const handleProfileDelete = async (email) => {
    try {
      await ProfileService.deleteByEmail(email);  // Delete profile by email
      loadProfiles();                     // Load profiles
    } catch (e) {
      setError(e.message);
    }
  };

  // Logout Handler:
  /**
   * handleLogout Function:
   *
   * Handles user logout.  It removes the authentication token from localStorage and redirects the user
   * to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    window.location.href = '/login';  // Redirect to login page
  };

  // Render the component:
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px',             // Fixed width for the sidebar.
        background: '#f0f0f0',      // Light gray background.
        padding: '1rem',           // Padding inside the sidebar.
        display: 'flex',          // Use flexbox for layout.
        flexDirection: 'column'    // Stack items vertically.
      }}>
        <h2>Admin</h2>
        <nav style={{
          display: 'flex',          // Use flexbox for navigation items.
          flexDirection: 'column',    // Stack navigation items vertically.
          gap: '0.5rem',         // Space between navigation items.
          marginTop: '1rem'         // Space above the navigation.
        }}>
          {/* Buttons to switch between sections. */}
          <button onClick={() => setSection('poems')} style={{ textAlign: 'left' }}>
            Gerenciar Poemas
          </button>
          <button onClick={() => setSection('profiles')} style={{ textAlign: 'left' }}>
            Gerenciar Perfis
          </button>
          <button onClick={() => setSection('users')} style={{ textAlign: 'left' }}>
            Gerenciar Usuários
          </button>
        </nav>
        {/* Logout button, positioned at the bottom of the sidebar. */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: 'auto',        // Push button to the bottom.
            background: '#d9534f', // Red background.
            color: '#fff',         // White text.
            padding: '0.5rem',       // Padding inside the button.
            width: '100%'          // Full width of the sidebar.
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <h1>Dashboard Admin</h1>

        {/* Conditional rendering of sections. */}
        {section === 'poems' && (
          <section>
            <h2>Gerenciar Poemas</h2>
            {/* Button to show the poem form for creating a new poem. */}
            <button onClick={() => { setShowPoemForm(true); setEditingPoem(null); }}>
              Novo Poema
            </button>
            {/* Render the poem form if showPoemForm is true. */}
            {showPoemForm && (
              <PoemForm
                poem={editingPoem}        // Pass the poem being edited (null for new).
                onSubmit={handlePoemSubmit} // Pass the submit handler.
                onCancel={() => { setShowPoemForm(false); setEditingPoem(null); }} // Pass the cancel handler.
              />
            )}
            {/* Render the poem list. */}
            <PoemList
              poems={poems}             // Pass the list of poems.
              onEdit={p => { setEditingPoem(p); setShowPoemForm(true); }} // Pass the edit handler.
              onDelete={handlePoemDelete} // Pass the delete handler.
            />
          </section>
        )}

        {section === 'profiles' && (
          <section>
            <h2>Gerenciar Perfis</h2>
            {/* Button to show the profile form */}
            <button onClick={() => { setShowProfileForm(true); setEditingProfile(null); }}>
              Novo Perfil
            </button>
            {/* Show profile form if showProfileForm is true */}
            {showProfileForm && (
              <ProfileForm
                profile={editingProfile}
                onSubmit={handleProfileSubmit}
                onCancel={() => { setShowProfileForm(false); setEditingProfile(null); }}
              />
            )}
            {/* Render the profile list */}
            <ProfileList
              profiles={profiles}
              onEdit={p => { setEditingProfile(p); setShowProfileForm(true); }}
              onDelete={handleProfileDelete}
            />
          </section>
        )}

        {/* Display any errors. */}
        {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      </main>
    </div>
  );
}