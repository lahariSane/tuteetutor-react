import React, { useState } from "react";
import { Edit2, Trash2, Calendar } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";

function TimetableManager() {
    const [selectedOption, setSelectedOption] = useState("Timetable");
    const [classes, setClasses] = useState([]);
    const [changes, setChanges] = useState([]);
    const [breaks, setBreaks] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [currentClassesPage, setCurrentClassesPage] = useState(1);
    const [totalClassesPages, setTotalClassesPages] = useState(1);
    const [currentBreaksPage, setCurrentBreaksPage] = useState(1);
    const [totalBreaksPages, setTotalBreaksPages] = useState(1);
    const [currentChangesPage, setCurrentChangesPage] = useState(1);
    const [totalChangesPages, setTotalChangesPages] = useState(1);
    const [currentHolidaysPage, setCurrentHolidaysPage] = useState(1);
    const [totalHolidaysPages, setTotalHolidaysPages] = useState(1);
    const [holidaysData, setHolidaysData] = useState({
        _id: null,
        date: "",
        occasion: "",
    });
    const [formData, setFormData] = useState({
        _id: null,
        day: "Monday",
        startTime: "",
        endTime: "",
        roomNo: "",
        subject: "",
        section: "",
    });
    const [changeData, setChangeData] = useState({
        _id: null,
        date: "",
        changeTo: "",
    });

    const [breakData, setBreakData] = useState({
        _id: null,
        startTime: "",
        endTime: "",
        description: "",
    });

    const handleHoliday = (e) => {
        setHolidaysData({ ...holidaysData, [e.target.name]: e.target.value });
    };
    const handleHolidaySubmit = async (e) => {
        e.preventDefault();
        try {
            const holidayPayload = {
                date: holidaysData.date,
                occasion: holidaysData.occasion,
            };
            if (holidaysData._id !== null) {
                await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/holiday/${holidaysData._id}`, holidayPayload,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            } else {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/holidays`, holidayPayload,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            }
            fetchHolidays(); // Refresh holiday list after operation
            setHolidaysData({ _id: null, date: "", occasion: "" });
            e.target.reset();
        } catch (error) {
            console.error("Error saving holiday:", error);
        }
    };

    const handleHolidayEdit = (_id) => {
        const selectedHoliday = holidays.find((hol) => hol._id === _id);
        if (selectedHoliday) {
            setHolidaysData(selectedHoliday);
        }
    };

    const handleHolidayDelete = async (_id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/holiday/${_id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            fetchHolidays(); // Refresh after delete
        } catch (error) {
            console.error("Error deleting holiday:", error);
        }
    };

    const fetchHolidays = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/holidays`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            const formattedHolidays = response.data.map(holiday => ({
                ...holiday,
                date: `${String(holiday.date).substring(0, 10)}`,
                occasion: holiday.occasion
            }));
            setHolidays(formattedHolidays);
            setTotalHolidaysPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching holidays:", error);
        }
    };

    // Handle input changes
    const handleBreak = (e) => {
        setBreakData({ ...breakData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        fetchHolidays();
        fetchBreaks();
        fetchChanges();
        fetchChanges()
    }, [selectedOption]);

    useEffect(() => {
        fetchHolidays();
    }, [currentHolidaysPage]);

    useEffect(() => {
        fetchBreaks();
    }, [currentBreaksPage]);

    const convertTo12HourFormat = (timeString) => {
        if (!timeString) return null;

        const [hours, minutes] = timeString.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const adjustedHours = hours % 12 || 12; // Convert 0 to 12

        return { hours: adjustedHours, minutes, part: period };
    };

    const convertTo24HourFormat = (timeObj) => {
        if (!timeObj || typeof timeObj !== "object") return null; // Ensure it's a valid object

        let { hours, minutes, part } = timeObj;

        if (part === "PM" && hours !== 12) {
            hours += 12;
        } else if (part === "AM" && hours === 12) {
            hours = 0; // Midnight case (12 AM → 00:00)
        }

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

    const fetchBreaks = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/break/breaks?page=${currentBreaksPage}&limit=5`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            ); // Adjust the endpoint as per backend route
            const formattedBreaks = response.data["breaks"].map(breakItem => ({
                ...breakItem,
                startTime: convertTo24HourFormat(breakItem.startTime),
                endTime: convertTo24HourFormat(breakItem.endTime)
            }));
            setBreaks(formattedBreaks);
            setTotalBreaksPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching breaks:", error);
        }
    };

    const handleBreakSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert 24-hour format times to 12-hour format
            const formattedStartTime = convertTo12HourFormat(breakData.startTime);
            const formattedEndTime = convertTo12HourFormat(breakData.endTime);

            const breakPayload = {
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                description: breakData.description
            };

            if (breakData._id !== null) {
                await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/break/breaks/${breakData._id}`, breakPayload,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            } else {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/break/addBreak`, breakPayload,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            }

            fetchBreaks(); // Refresh break list after operation
            setBreakData({ _id: null, startTime: "", endTime: "", description: "" });
            e.target.reset();

        } catch (error) {
            console.error("Error saving break:", error);
        }
    };

    // Handle edit (pre-fill form with selected break)
    const handleEditBreak = (_id) => {
        const selectedBreak = breaks.find((brk) => brk._id === _id);
        if (selectedBreak) {
            setBreakData(selectedBreak);
        }
    };

    // Handle delete
    const handleDeleteBreak = async (_id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/break/breaks/${_id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            fetchBreaks(); // Refresh after delete
        } catch (error) {
            console.error("Error deleting break:", error);
        }
    };


    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            // Convert day name to number before sending
            const formattedData = {
                ...formData,
                day: dayNames.indexOf(formData.day), // Convert to number (0-6)
            };

            if (formData._id) {
                await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/timetable/${formData._id}`, formattedData,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            } else {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/timetable`, formattedData,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            }

            fetchClasses(); // Refresh timetable
            setFormData({ _id: null, day: "Monday", startTime: "", endTime: "", roomNo: "", subject: "", section: "" });
        } catch (error) {
            console.error("Error saving class:", error);
        }
    };


    const handleEdit = (cls) => setFormData(cls);

    const handleDelete = async (_id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/timetable/${_id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            fetchClasses(); // Reload classes after deletion
        } catch (error) {
            console.error("Error deleting class:", error);
        }
    };

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/timetables?page=${currentClassesPage}&limit=5`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            const formattedClasses = response.data.timetables.map((cls) => ({
                id: cls._id,
                day: dayNames[cls.day] || "Unknown", // Convert number to day (adjusted for 0-indexing)
                startTime: cls.startTime,
                endTime: cls.endTime,
                subject: cls.subject,
                section: cls.section,
                room: cls.roomNo
            }));
            setClasses(formattedClasses);
            setTotalClassesPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };


    useEffect(() => {
        fetchClasses();
    }, [currentClassesPage]);

    const handleChangeSubmit = async (e) => {
        e.preventDefault();
        try {
            // Split date into day, month, and year (assuming input is in YYYY-MM-DD format)
            const [year, month, date] = changeData.date.split("-").map(Number);
            const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            const changePayload = {
                date,
                month,
                year,
                changeTo: dayNames.indexOf(changeData.changeTo) // Ensure it's a number
            };

            if (changeData._id !== null) {
                await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/changes/${changeData._id}`, changePayload,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            } else {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changes`, changePayload,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            }
            fetchChanges(); // Refresh the changes list
            setChangeData({ _id: null, date: "", changeTo: "" });

        } catch (error) {
            console.error("Error saving change:", error);
        }
    };


    const handleChangeData = (e) => setChangeData({ ...changeData, [e.target.name]: e.target.value });

    const handleChangeEdit = (_id) => {
        const selectedChange = changes.find((chg) => chg._id === _id);
        if (selectedChange) {
            setChangeData(selectedChange);
        }
    };

    const handleChangeDelete = async (_id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/changes/${_id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            fetchChanges(); // Refresh the changes list
        } catch (error) {
            console.error("Error deleting change:", error);
        }
    };

    const fetchChanges = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/changes`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            // Convert { date, month, year } into a string format "YYYY-MM-DD"
            const formattedChanges = response.data.map(change => ({
                ...change,
                date: `${change.year}-${String(change.month).padStart(2, "0")}-${String(change.date).padStart(2, "0")}`,
                changeTo: dayNames[change.changeTo] // Convert number to weekday
            }));

            setChanges(formattedChanges);
            setTotalChangesPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching changes:", error);
        }
    };


    useEffect(() => {
        fetchChanges();
    }, [currentChangesPage]);

    return (
        <div className="max-w-4xl mx-auto p-6 mt-[150px] h-[100vh]">
            {/* Dropdown Selection */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Option</label>
                <select
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="Timetable">Timetable</option>
                    <option value="Breaks">Breaks</option>
                    <option value="Changes">Changes</option>
                    <option value="Holidays">Holidays</option>
                </select>
            </div>

            {/* Timetable Section */}
            {selectedOption == "Timetable" && (
                <>
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                                <input type="text" name="roomNo" value={formData.roomNo} onChange={handleChange} className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                                <select name="day" value={formData.day} onChange={handleChange} className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                                        <option key={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                                <input name="section" value={formData.section} onChange={handleChange} className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                            <button type="submit" className="col-span-2 mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formData._id !== null ? "Update Class" : "Add Class"}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm overflow-scroll">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    {["Day", "Time", "Room", "Subject", "Section", "Actions"].map((head) => (
                                        <th key={head} className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {classes.map((cls, index) => (
                                    <tr key={cls.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{cls.day}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{`${cls.startTime} - ${cls.endTime}`}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{cls.room}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{cls.subject}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{cls.section}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button onClick={() => handleEdit(cls)} className="text-blue-600 hover:text-blue-800">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(cls._id)} className="text-red-600 hover:text-red-800">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {classes.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            No classes added yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center items-center space-x-2 my-4">
                        <button
                            onClick={() => setCurrentClassesPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentClassesPage === 1}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {currentClassesPage} of {totalClassesPages}
                        </span>
                        <button
                            onClick={() => setCurrentClassesPage((prev) => Math.min(prev + 1, totalClassesPages))}
                            disabled={currentClassesPage === totalClassesPages}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {selectedOption === "Breaks" && (
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                        <form onSubmit={handleBreakSubmit} className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={breakData.startTime}
                                    onChange={handleBreak}
                                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={breakData.endTime}
                                    onChange={handleBreak}
                                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={breakData.reason}
                                    onChange={handleBreak}
                                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="col-span-2 mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                {breakData._id !== null ? "Update Break" : "Add Break"}
                            </button>
                        </form>
                    </div>

                    {/* List of Breaks */}
                    <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Break Schedule</h2>
                        {breaks.length > 0 ? (
                            <>
                                <ul className="divide-y divide-gray-200">
                                    {breaks.map((brk) => (
                                        <li key={brk.id} className="flex justify-between items-center py-3">
                                            <span className="text-gray-600">
                                                {brk.startTime} - {brk.endTime} | {brk.description}
                                            </span>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEditBreak(brk._id)}
                                                    className="text-blue-600 hover:text-blue-800 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBreak(brk._id)}
                                                    className="text-red-600 hover:text-red-800 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex justify-center items-center space-x-2 my-4">
                                    <button
                                        onClick={() => setCurrentBreaksPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentBreaksPage === 1}
                                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {currentBreaksPage} of {totalBreaksPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentBreaksPage((prev) => Math.min(prev + 1, totalBreaksPages))}
                                        disabled={currentBreaksPage === totalBreaksPages}
                                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500">No breaks added yet.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Changes Section */}
            {selectedOption === "Changes" && (
                <>
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                        <form onSubmit={handleChangeSubmit} className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Change</label>
                                <input type="date" name="date" value={changeData.date} onChange={handleChangeData} className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To Day</label>
                                <select name="changeTo" value={changeData.toDay} onChange={handleChangeData} className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                                        <option key={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="col-span-2 mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {changeData._id !== null ? "Update Change" : "Add Change"}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    {["Date", "Change to", "Actions"].map((head) => (
                                        <th key={head} className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {changes.map((chg, index) => (
                                    <tr key={chg.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{chg.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{chg.changeTo}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button onClick={() => handleChangeEdit(chg._id)} className="text-blue-600 hover:text-blue-800">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleChangeDelete(chg._id)} className="text-red-600 hover:text-red-800">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {changes.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            No changes recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Holidays section */}
            {selectedOption === "Holidays" && (
                <>
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                        <form onSubmit={handleHolidaySubmit} className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Holiday</label>
                                <input type="date" name="date" value={holidaysData.date} onChange={handleHoliday} className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                                <input type="text" name="occasion" value={holidaysData.occasion} onChange={handleHoliday} className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                            </div>
                            <button type="submit" className="col-span-2 mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {holidaysData._id !== null ? "Update Holiday" : "Add Holiday"}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    {["Date", "Occasion", "Actions"].map((head) => (
                                        <th key={head} className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {holidays.map((holiday, index) => (
                                    <tr key={holiday.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{holiday.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{holiday.occasion}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button onClick={() => handleHolidayEdit(holiday._id)} className="text-blue-600 hover:text-blue-800">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleHolidayDelete(holiday._id)} className="text-red-600 hover:text-red-800">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {holidays.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            No holidays recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default TimetableManager;


