import React from "react";
import moment from "moment";
import { FaTrash } from "react-icons/fa";

const JournalEntries = ({ entries, onDelete }) => {
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = moment(entry.date).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {});

  return (
    <div className="entries-section">
      {Object.keys(groupedEntries).map((date) => (
        <div key={date} className="entry-group">
          <h3>{moment(date).format("MMMM Do YYYY")}</h3>
          {groupedEntries[date].map((entry) => (
            <div key={entry.id} className="entry">
              <p>{entry.text}</p>
              <span>{moment(entry.date).format("h:mm A")}</span>
              <FaTrash
                onClick={() => onDelete(entry.id)}
                style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
                title="Delete Entry"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default JournalEntries;
