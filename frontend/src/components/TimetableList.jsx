import React from "react";

function TimetableList() {
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