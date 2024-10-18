// src/components/JournalInput.js
import React, { useState } from 'react';
import { addJournalEntry } from '../firebaseFunctions'; // Import the function

const JournalInput = () => {
  const [entryText, setEntryText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entryText.trim()) { // Check if the entry is not just whitespace
      addJournalEntry(entryText);
      setEntryText(''); // Clear the input after submission
    }
  };

  return (
    <div className="input-section">
      <form onSubmit={handleSubmit}>
        <textarea
          className="journal-input"
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
          placeholder="Write your journal entry..."
          rows="4"
        />
        <button type="submit">Save Entry</button>
      </form>
    </div>
  );
};

export default JournalInput;
