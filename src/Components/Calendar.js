import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import Sidebar from './Sidebar';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Styles/CalendarView.css';

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate, onView }) => {
  return (
    <div className="custom-toolbar">
      <div className="navigation-buttons">
        <button onClick={() => onNavigate('TODAY')}>Today</button>
        <button onClick={() => onNavigate('PREV')}>Back</button>
        <button onClick={() => onNavigate('NEXT')}>Next</button>
      </div>
      <div className="current-label">{label}</div>
      <div className="view-buttons">
        <button onClick={() => onView('month')}>Month</button>
        <button onClick={() => onView('week')}>Week</button>
        <button onClick={() => onView('day')}>Day</button>
      </div>
    </div>
  );
};

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(Views.WEEK);
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const userId = localStorage.getItem('userId');

  // Modal state & form data
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    Title: '',
    Description: '',
    Start_Time: '',
    End_Time: '',
    Event_Type: 'Meeting',
    Location: '',
  });

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:5000/api/calendar/${userId}`)
      .then(response => {
        const data = response.data;
        const formattedEvents = data.map(event => ({
          id: event.Event_ID,
          title: event.Title,
          start: new Date(event.Start_Time),
          end: new Date(event.End_Time),
          desc: event.Description,
          type: event.Event_Type
        }));
        setEvents(formattedEvents);
      })
      .catch(error => {
        console.error("Error fetching events:", error);
      });
  }, [userId]);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    if (event.type === 'Break') backgroundColor = '#fcbf49';
    else if (event.type === 'Task') backgroundColor = '#ef233c';
    else if (event.type === 'Meeting') backgroundColor = '#4361ee';
    else if (event.type === 'Reminder') backgroundColor = '#3a86ff';
    else if (event.type === 'Deadline') backgroundColor = '#ff006e';
    else if (event.type === 'Training') backgroundColor = '#06d6a0';

    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '8px',
        border: 'none',
        padding: '4px',
      }
    };
  };

  // Open modal
  const openAddEventModal = () => {
    setNewEventData({
      Title: '',
      Description: '',
      Start_Time: '',
      End_Time: '',
      Event_Type: 'Meeting',
      Location: '',
    });
    setShowAddEventModal(true);
  };

  // Close modal
  const closeAddEventModal = () => {
    setShowAddEventModal(false);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEventData(prev => ({ ...prev, [name]: value }));
  };

  // Save event to backend and update calendar
  const handleSaveEvent = () => {
    if (
      !newEventData.Title ||
      !newEventData.Start_Time ||
      !newEventData.End_Time
    ) {
      alert('Please fill in required fields: Title, Start Time and End Time');
      return;
    }

    const eventToSend = {
      User_ID: userId,
      Title: newEventData.Title,
      Description: newEventData.Description,
      Start_Time: new Date(newEventData.Start_Time),
      End_Time: new Date(newEventData.End_Time),
      Event_Type: newEventData.Event_Type,
      Location: newEventData.Location,
    };

    axios.post('http://localhost:5000/api/calendar', eventToSend)
      .then(response => {
        const addedEvent = response.data;
        setEvents([...events, {
          id: addedEvent.Event_ID,
          title: newEventData.Title,
          start: new Date(newEventData.Start_Time),
          end: new Date(newEventData.End_Time),
          desc: newEventData.Description,
          type: newEventData.Event_Type,
        }]);
        closeAddEventModal();
      })
      .catch(error => {
        console.error("Error adding event:", error);
      });
  };

  const handleNavigate = (action) => {
    const newDate = new Date(currentDate);

    switch (action) {
      case 'TODAY':
        setCurrentDate(new Date());
        break;
      case 'PREV':
        if (view === 'month') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else if (view === 'week') {
          newDate.setDate(newDate.getDate() - 7);
        } else if (view === 'day') {
          newDate.setDate(newDate.getDate() - 1);
        }
        setCurrentDate(newDate);
        break;
      case 'NEXT':
        if (view === 'month') {
          newDate.setMonth(newDate.getMonth() + 1);
        } else if (view === 'week') {
          newDate.setDate(newDate.getDate() + 7);
        } else if (view === 'day') {
          newDate.setDate(newDate.getDate() + 1);
        }
        setCurrentDate(newDate);
        break;
      default:
        break;
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="calendar-view">
      <Sidebar />
      <div className="calendar-container">
        <h2>My Weekly Schedule</h2>
        <button onClick={openAddEventModal} className="add-event-button">
          Add Event
        </button>
        <Calendar
          localizer={localizer}
          events={events}
          view={view}
          views={['week', 'day', 'month']}
          step={30}
          timeslots={2}
          style={{ height: '85vh' }}
          eventPropGetter={eventStyleGetter}
          components={{ toolbar: (props) => <CustomToolbar {...props} onNavigate={handleNavigate} onView={handleViewChange} /> }}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          date={currentDate}
        />

        {/* Add Event Modal */}
        {showAddEventModal && (
          <div className="add-event-modal-overlay" onClick={closeAddEventModal}>
            <div className="add-event-modal-container" onClick={e => e.stopPropagation()}>
              <h3>Add New Event</h3>

              <input
                type="text"
                name="Title"
                placeholder="Title *"
                value={newEventData.Title}
                onChange={handleInputChange}
                required
              />

              <textarea
                name="Description"
                placeholder="Description"
                rows="3"
                value={newEventData.Description}
                onChange={handleInputChange}
              />

              <label>
                Start Time:</label>
                <input
                  type="datetime-local"
                  name="Start_Time"
                  value={newEventData.Start_Time}
                  onChange={handleInputChange}
                  required
                />
              
 
              <label>
                End Time:</label>
                <input
                  type="datetime-local"
                  name="End_Time"
                  value={newEventData.End_Time}
                  onChange={handleInputChange}
                  required
                />
              

              <select
                name="Event_Type"
                value={newEventData.Event_Type}
                onChange={handleInputChange}
              >
                <option value="Meeting">Meeting</option>
                <option value="Break">Break</option>
                <option value="Task">Task</option>
                <option value="Reminder">Reminder</option>
                <option value="Deadline">Deadline</option>
                <option value="Training">Training</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="text"
                name="Location"
                placeholder="Location"
                value={newEventData.Location}
                onChange={handleInputChange}
              />

              <div className="add-event-modal-buttons">
                <button className="add-event-cancel-btn" onClick={closeAddEventModal}>Cancel</button>
                <button className="add-event-save-btn" onClick={handleSaveEvent}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
