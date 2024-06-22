import React, { useState } from 'react';
import { MdDateRange } from "react-icons/md";

function EventCard({ event, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(event.title);
  const [updatedNote, setUpdatedNote] = useState(event.note);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = () => {
    // Perform the update operation by calling the onUpdate function
    onUpdate(event.id, updatedTitle, updatedNote);
    setIsEditing(false); // Set editing mode to false after updating
  };

  const handleCancel = () => {
    // Reset the updatedTitle and updatedNote
    setUpdatedTitle(event.title);
    setUpdatedNote(event.note);
    setIsEditing(false); // Set editing mode to false
  };

  return (
    <li>
      <div>
        <p className='eventCardHeader'><span><MdDateRange/></span>{new Date(event.date.seconds * 1000).toLocaleDateString()}</p>
        {isEditing ? (
          <div className='EventeditHolder'>
            <input type="text" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />
            <textarea value={updatedNote} onChange={(e) => setUpdatedNote(e.target.value)} />
            <div className='btnsHolder'>
              <button onClick={handleUpdate}>Save</button>
              <button onClick={handleCancel} style={{backgroundColor : '#DC3545',color : "white"}}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h3>Title : {event.title}</h3>
            <p className='note'>{event.note}</p>
            <div className='btnsHolder'>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={() => onDelete(event.id)} style={{backgroundColor : '#DC3545',color : "white"}}>Delete</button>
            </div>
          </>
        )}
      </div>
    </li>
  );
}

export default EventCard;