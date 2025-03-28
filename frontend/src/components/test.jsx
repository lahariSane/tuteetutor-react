import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Edit2,
  Home,
  BookOpen,
  Users,
  Settings,
  Trash2,
  LayoutDashboard,
  CalendarDays,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';

function Sidebar() {
  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-8">
        <GraduationCap className="w-8 h-8 text-blue-600" />
        <h1 className="text-xl font-bold">TuteeTutor</h1>
      </div>
      
      <nav className="space-y-2">
        {[
          { icon: <LayoutDashboard />, text: 'Dashboard' },
          { icon: <Calendar />, text: 'Timetable', active: true },
          { icon: <BookOpen />, text: 'Almanac' },
          { icon: <HelpCircle />, text: 'Support' },
          { icon: <Users />, text: 'Faculty' },
          { icon: <Settings />, text: 'Settings' },
        ].map((item) => (
          <a
            key={item.text}
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
              item.active
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.text}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

function TimetableForm() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Number
          </label>
          <input
            type="text"
            className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter room number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Day
          </label>
          <select className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time
          </label>
          <input
            type="time"
            className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time
          </label>
          <input
            type="time"
            className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter subject name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section
          </label>
          <select className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>Section A</option>
            <option>Section B</option>
            <option>Section C</option>
          </select>
        </div>
      </div>
      <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Add Class
      </button>
    </div>
  );
}

function TimetableTable() {
  const classes = [
    {
      day: 'Monday',
      time: '09:00 - 10:30',
      room: '101',
      subject: 'Mathematics',
      section: 'A',
    },
    {
      day: 'Monday',
      time: '11:00 - 12:30',
      room: '202',
      subject: 'Physics',
      section: 'B',
    },
    {
      day: 'Tuesday',
      time: '09:00 - 10:30',
      room: '303',
      subject: 'Chemistry',
      section: 'A',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Day
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Time
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Room
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Subject
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Section
            </th>
            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {classes.map((class_, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-blue-50 transition-colors`}
            >
              <td className="px-6 py-4 text-sm text-gray-900">{class_.day}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{class_.time}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{class_.room}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {class_.subject}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {class_.section}
              </td>
              <td className="px-6 py-4 text-right space-x-3">
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RightPanel() {
  const upcomingClasses = [
    {
      subject: 'Mathematics',
      time: '09:00 AM',
      room: '101',
    },
    {
      subject: 'Physics',
      time: '11:00 AM',
      room: '202',
    },
  ];

  return (
    <div className="w-80 fixed right-0 top-0 h-screen bg-white border-l border-gray-200 p-6">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl">
          <CalendarDays className="w-6 h-6 mb-2" />
          <h3 className="font-semibold">March 2025</h3>
          <p className="text-sm opacity-80">Calendar Widget Here</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Upcoming Classes</h3>
        <div className="space-y-3">
          {upcomingClasses.map((class_, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium">{class_.subject}</div>
              <div className="text-sm text-gray-500">
                {class_.time} • Room {class_.room}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="ml-64 mr-80 px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Modify Timetable</h1>
          <p className="text-gray-500">Add or Update Classes</p>
        </div>
        
        <TimetableForm />
        <TimetableTable />
      </main>

      <RightPanel />
    </div>
  );
}

export default App;