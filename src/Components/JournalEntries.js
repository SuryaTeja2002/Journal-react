import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FaTrash } from 'react-icons/fa'; // Import delete icon from react-icons
import { getDatabase, ref, onValue } from 'firebase/database'; // Import Firebase Database methods

const JournalEntries = ({ onDelete }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const entriesRef = ref(db, 'entries'); // Reference to the "entries" node in your database

    // Set up a listener for changes
    const unsubscribe = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedEntries = [];

      for (const key in data) {
        loadedEntries.push({ id: key, ...data[key] });
      }

      setEntries(loadedEntries); // Update state with the new entries
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = moment(entry.date).format('YYYY-MM-DD'); // Format date for grouping
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry); // Push entry into the correct date group
    return acc;
  }, {});

  return (
    <div className="entries-section">
      {Object.keys(groupedEntries).map((date) => (
        <div key={date} className="entry-group">
          <h3>{moment(date).format('MMMM Do YYYY')}</h3> {/* Display date */}
          {groupedEntries[date].map((entry) => (
            <div key={entry.id} className="entry">
              <p>{entry.text}</p> {/* Display journal text */}
              <span>{moment(entry.date).format('h:mm A')}</span> {/* Display timestamp */}
              <FaTrash
                onClick={() => onDelete(entry.id)} // Use the icon for delete action
                style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }} // Style the icon
                title="Delete Entry" // Tooltip for accessibility
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default JournalEntries;
