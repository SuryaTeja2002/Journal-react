import React, { useState, useEffect } from "react";
import { ref, set, get, remove } from "firebase/database"; // Import necessary functions
import { database } from "./firebaseConfig"; // Import Firebase configuration
import JournalEntries from "./Components/JournalEntries"; // Correct case-sensitive import
import { FaPen } from "react-icons/fa"; // Import icon for text input toggle
import "./App.css"; // Import styles

const App = () => {
  const [showInput, setShowInput] = useState(false); // State to toggle input visibility
  const [entry, setEntry] = useState(""); // State for journal entry text
  const [entries, setEntries] = useState([]); // State for all journal entries

  // Fetch journal entries from Firebase Realtime Database when the component mounts
  useEffect(() => {
    const fetchEntries = async () => {
      const entriesRef = ref(database, "journals"); // Reference to 'journals' path
      const snapshot = await get(entriesRef);
      if (snapshot.exists()) {
        const journalEntries = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          journalEntries.push({ id: childSnapshot.key, ...childData });
        });
        setEntries(journalEntries); // Set fetched entries to state
      } else {
        console.log("No entries found");
      }
    };

    fetchEntries(); // Call the fetch function
  }, []);

  // Handle saving a new journal entry
  const handleSave = async () => {
    if (!entry.trim()) return; // Do not proceed if the entry is empty
    const newEntry = {
      text: entry,
      date: new Date().toISOString(), // Save the current date
    };
    const newRef = ref(database, `journals/${new Date().getTime()}`); // Create a new reference for the entry
    await set(newRef, newEntry); // Save the new entry to the database

    setEntries([{ id: newRef.key, ...newEntry }, ...entries]); // Add new entry to the beginning of the entries array
    setEntry(""); // Clear the input
    setShowInput(false); // Hide input section
  };

  // Handle deleting a journal entry
  const handleDelete = async (id) => {
    const entryRef = ref(database, `journals/${id}`); // Reference to the specific entry
    await remove(entryRef); // Remove the entry from the database
    setEntries(entries.filter((entry) => entry.id !== id)); // Remove entry from state
  };

//   return (
//     <div className="app-container">
//       <button className="text-icon" onClick={() => setShowInput(!showInput)}>
//         <FaPen /> {/* Text icon */}
//       </button>
//       {showInput && (
//         <div className="input-section">
//           <textarea
//             value={entry}
//             onChange={(e) => setEntry(e.target.value)}
//             placeholder="Write your journal here..."
//             className="journal-input"
//           />
//           <button onClick={handleSave}>Save Entry</button>
//         </div>
//       )}
//       <JournalEntries entries={entries} onDelete={handleDelete} />{" "}
//       {/* Pass delete function */}
//     </div>
//   );
// };
return (
  <div className="app-container">
    <div className="header">
      <h1 className="heading">Journal</h1> {/* Heading on the left */}
      <button className="text-icon" onClick={() => setShowInput(!showInput)}>
        <FaPen /> {/* Text icon on the right */}
      </button>
    </div>
    {showInput && (
      <div className="input-section">
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your journal here..."
          className="journal-input"
        />
        <button className="save-button" onClick={handleSave}>Save Entry</button>
      </div>
    )}
    <JournalEntries entries={entries} onDelete={handleDelete} />{" "}
    {/* Pass delete function */}
  </div>
);
}

export default App;
