import React, { useState, useEffect } from "react";
import { auth, database } from "../firebaseConfig";
import { ref, set, remove, push, onValue } from "firebase/database";
import { signOut } from "firebase/auth";
import JournalEntries from "./JournalEntries";
import { FaPen, FaSignOutAlt } from "react-icons/fa"; 
import CryptoJS from "crypto-js"; 
import "../App.css";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY; // Access the environment variable

const Dashboard = () => {
  const [showInput, setShowInput] = useState(false);
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Encrypt and Decrypt functions
  const encryptEntry = (text) => {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  };

  const decryptEntry = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  // Fetch entries for the logged-in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const entriesRef = ref(database, `journals/${user.uid}`);
        onValue(entriesRef, (snapshot) => {
          const journalEntries = [];
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            // Decrypt the text entry before displaying
            const decryptedText = decryptEntry(childData.text);
            journalEntries.push({
              id: childSnapshot.key,
              text: decryptedText,
              date: childData.date,
            });
          });

          // Sort entries from current to past based on date
          journalEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

          setEntries(journalEntries);
        });
      } else {
        setUser(null); // Reset user state if not authenticated
      }
      setLoading(false); // Set loading to false after checking auth state
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!entry.trim()) return; // Prevent saving empty entries
    const newEntry = {
      text: encryptEntry(entry), // Encrypt the text before saving
      date: new Date().toISOString(),
    };
    const newRef = push(ref(database, `journals/${user.uid}`));
    await set(newRef, newEntry);
    setEntry(""); // Clear input field after saving
    setShowInput(false); // Hide input field
  };

  const handleDelete = async (id) => {
    const entryRef = ref(database, `journals/${user.uid}/${id}`);
    await remove(entryRef);
    setEntries(entries.filter((entry) => entry.id !== id)); // Update local state
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="app-container">
      {loading ? ( // Show loading state
        <p>Loading...</p>
      ) : user ? (
        <>
          <div className="header">
            <h1 className="heading">Journal</h1>
            <div className="header-icons">
              <button
                className="text-icon"
                onClick={() => setShowInput(!showInput)}
                title="Add Entry"
              >
                <FaPen />
              </button>
              <button
                className="signout-icon"
                onClick={handleSignOut}
                title="Sign out"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
          {showInput && (
            <div className="input-section">
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Write your journal here..."
                className="journal-input"
              />
              <button className="save-button" onClick={handleSave}>
                Save Entry
              </button>
            </div>
          )}
          <JournalEntries entries={entries} onDelete={handleDelete} />
        </>
      ) : (
        <p>Please sign in to access your journal.</p>
      )}
    </div>
  );
};

export default Dashboard;
