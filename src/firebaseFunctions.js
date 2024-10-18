import { database } from './firebaseConfig'; // Import the database
import { ref, push } from 'firebase/database';

// Function to add a journal entry
const addJournalEntry = async (entryText) => {
  try {
    const entryRef = ref(database, 'journalEntries'); // Reference to journal entries
    const newEntryRef = push(entryRef); // Create a new entry
    await newEntryRef.set({
      text: entryText,
      date: new Date().toISOString(), // Use ISO format for date
    });
    console.log("Journal entry added successfully");
  } catch (error) {
    console.error("Error adding journal entry: ", error);
  }
};
