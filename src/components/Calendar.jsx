import React, { useState, useEffect } from 'react';
import { collection, addDoc,updateDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext'; // Import your auth context hook
import EventCard from './EventCard';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MyCalendar() {
  const { currentUser } = useAuth(); // Access the current user
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchEvents();
  }, [filter]); // Fetch events when filter changes

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleSaveEvent = async () => {
    try {
      const docRef = await addDoc(collection(firestore, 'events'), {
        date,
        title,
        note,
        userUid: currentUser.uid, // Use the current user's UID
      });
      console.log('Document written with ID: ', docRef.id);
      // Reset fields after saving
      setTitle('');
      setNote('');
      // Fetch events again after adding a new event
      fetchEvents();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const q = query(collection(firestore, 'events'), where('userUid', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const eventsData = [];
      querySnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() });
      });
      setEvents(eventsData);
      filterEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);
    filterEvents(events);
  };

  const filterEvents = (events) => {
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    let filteredEvents;
    if (filter === 'upcoming') {
      filteredEvents = events.filter((event) => new Date(event.date.seconds * 1000) > currentDate);
    } else if (filter === 'past') {
      filteredEvents = events.filter((event) => new Date(event.date.seconds * 1000) < currentDate);
    } else if (filter === 'today') {
      filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.date.seconds * 1000);
        return eventDate >= today && eventDate < tomorrow;
      });
    }
  
    setFilteredEvents(filteredEvents);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(firestore, 'events', eventId));
      setFilteredEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event: ', error);
    }
  };

  const handleUpdateEvent = async (eventId, updatedTitle, updatedNote) => {
    try {
      await updateDoc(doc(firestore, 'events', eventId), {
        title: updatedTitle,
        note: updatedNote
      });
      // Fetch events again after updating
      fetchEvents();
    } catch (error) {
      console.error('Error updating event: ', error);
    }
  };
  return (
    <div className='calendarPage'>
     
      <div className='createEventSection'>
        <h1>Calendar</h1>
        <Calendar onChange={handleDateChange} value={date} className="c"/>

        <div >
          <label>Title</label>
          <input placeholder='Type Title' type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label>Note</label>
          <textarea placeholder='Type Note' value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <button onClick={handleSaveEvent}>Save</button>
      </div>

      <div className='EventsHolder'>
        <h1>Events</h1>

        <div className='btnsHolder'>
          <button onClick={() => handleFilterChange('upcoming')} className={filter === "upcoming" ? "selected" :""}>Upcoming Events</button>
          <button onClick={() => handleFilterChange('past')} className={filter === "past" ? "selected" :""}>Past Events</button>
          <button onClick={() => handleFilterChange('today')} className={filter === "today" ? "selected" :""}>Today's Events</button>
        </div>

        <ul>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onDelete={handleDeleteEvent} onUpdate={handleUpdateEvent} />
          ))}
          {filteredEvents.length === 0 && <h1>No Events</h1>}
        </ul>

      </div>
    </div>
  );
}

export default MyCalendar;
