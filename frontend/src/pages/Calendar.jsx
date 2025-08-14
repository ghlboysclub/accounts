import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, X, Save, Calendar as CalendarIcon, User, Clock, MapPin, Bell, CheckCircle, XCircle } from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Calendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Team Meeting',
      description: 'Weekly team sync to discuss project progress and upcoming tasks',
      date: '2024-01-15',
      time: '10:00',
      duration: 60,
      location: 'Conference Room A',
      attendees: ['Ahmad Ali', 'Hassan Khan', 'Fatima Shah'],
      priority: 'high',
      status: 'confirmed',
      category: 'meeting'
    },
    {
      id: 2,
      title: 'Client Presentation',
      description: 'Present Q4 financial report to TechCorp stakeholders',
      date: '2024-01-16',
      time: '14:30',
      duration: 90,
      location: 'TechCorp Office',
      attendees: ['Ahmad Ali', 'Omar Malik'],
      priority: 'high',
      status: 'confirmed',
      category: 'presentation'
    },
    {
      id: 3,
      title: 'Project Deadline',
      description: 'Mobile app UI design completion deadline',
      date: '2024-01-17',
      time: '17:00',
      duration: 0,
      location: 'Office',
      attendees: ['Fatima Shah'],
      priority: 'normal',
      status: 'pending',
      category: 'deadline'
    }
  ]);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isViewEventModalOpen, setIsViewEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    location: '',
    attendees: '',
    priority: 'normal',
    status: 'confirmed',
    category: 'meeting'
  });

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ];

  const statuses = [
    { value: 'confirmed', label: 'Confirmed', color: 'text-green-600' },
    { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' }
  ];

  const categories = [
    { value: 'meeting', label: 'Meeting', color: 'bg-blue-500' },
    { value: 'presentation', label: 'Presentation', color: 'bg-purple-500' },
    { value: 'deadline', label: 'Deadline', color: 'bg-red-500' },
    { value: 'event', label: 'Event', color: 'bg-green-500' },
    { value: 'reminder', label: 'Reminder', color: 'bg-yellow-500' }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: Math.max(...events.map(e => e.id)) + 1,
      ...eventFormData,
      attendees: eventFormData.attendees ? eventFormData.attendees.split(',').map(a => a.trim()) : []
    };

    setEvents([...events, newEvent]);
    setIsAddEventModalOpen(false);
    resetEventForm();
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const resetEventForm = () => {
    setEventFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: 60,
      location: '',
      attendees: '',
      priority: 'normal',
      status: 'confirmed',
      category: 'meeting'
    });
    setSelectedEvent(null);
  };

  const openViewEventModal = (event) => {
    setSelectedEvent(event);
    setIsViewEventModalOpen(true);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getCategoryColor = (category) => {
    const categoryObj = categories.find(c => c.value === category);
    return categoryObj ? categoryObj.color : 'bg-gray-500';
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysInMonth = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule and manage events
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
          <AppleButton
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddEventModalOpen(true)}
          >
            Add Event
          </AppleButton>
        </div>
      </div>

      {/* Calendar Navigation */}
      <AppleCard>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth(-1)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            &larr; Previous
          </button>
          <h2 className="text-xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Next &rarr;
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((date, index) => {
            const dayEvents = date ? getEventsForDate(date) : [];
            const isToday = date && date.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={index} 
                className={`min-h-24 p-2 border rounded-lg ${
                  date ? 'bg-white border-gray-200' : 'bg-gray-50 border-transparent'
                } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                {date && (
                  <>
                    <div className={`text-right text-sm font-medium ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div 
                          key={event.id}
                          className={`text-xs p-1 rounded truncate cursor-pointer ${getCategoryColor(event.category)} text-white`}
                          onClick={() => openViewEventModal(event)}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </AppleCard>

      {/* Add Event Modal */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Event</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsAddEventModalOpen(false)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <AppleInput
                  label="Event Title"
                  type="text"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={eventFormData.date}
                  onChange={(e) => setEventFormData({...eventFormData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={eventFormData.time}
                  onChange={(e) => setEventFormData({...eventFormData, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <AppleInput
                  label="Duration (minutes)"
                  type="number"
                  value={eventFormData.duration}
                  onChange={(e) => setEventFormData({...eventFormData, duration: parseInt(e.target.value) || 0})}
                  placeholder="Enter duration"
                />
              </div>

              <div>
                <AppleInput
                  label="Location"
                  type="text"
                  value={eventFormData.location}
                  onChange={(e) => setEventFormData({...eventFormData, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={eventFormData.category}
                  onChange={(e) => setEventFormData({...eventFormData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={eventFormData.priority}
                  onChange={(e) => setEventFormData({...eventFormData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={eventFormData.status}
                  onChange={(e) => setEventFormData({...eventFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <AppleInput
                  label="Attendees (comma separated)"
                  type="text"
                  value={eventFormData.attendees}
                  onChange={(e) => setEventFormData({...eventFormData, attendees: e.target.value})}
                  placeholder="Enter attendee names"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                  placeholder="Enter event description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <AppleButton
                variant="secondary"
                onClick={() => setIsAddEventModalOpen(false)}
              >
                Cancel
              </AppleButton>
              <AppleButton
                variant="primary"
                onClick={handleAddEvent}
              >
                Add Event
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View Event Modal */}
      {isViewEventModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Event Details</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsViewEventModalOpen(false)}
              />
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(selectedEvent.category)}`}>
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Event Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedEvent.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Time:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatTime(selectedEvent.time)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Duration:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedEvent.duration} minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Location:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedEvent.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {selectedEvent.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Priority:</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {selectedEvent.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Category:</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {selectedEvent.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendees */}
              {selectedEvent.attendees.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Attendees</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.attendees.map((attendee, index) => (
                      <div key={index} className="flex items-center px-3 py-1.5 bg-gray-100 rounded-lg">
                        <User className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{attendee}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <AppleButton
                variant="secondary"
                onClick={() => setIsViewEventModalOpen(false)}
              >
                Close
              </AppleButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;