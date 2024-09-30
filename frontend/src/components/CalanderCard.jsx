import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Modal, Box } from '@mui/material';
import dayjs from 'dayjs';

function CustomDay(props) {
    const { day, outsideCurrentMonth, ...other } = props;

    // Check if the current day is Sunday (0 = Sunday)
    const isSunday = day.day() === 0;

    return (
            <PickersDay
                {...other}
                day={day}
                outsideCurrentMonth={outsideCurrentMonth}
                sx={{
                    color: isSunday ? 'red' : 'inherit', // Apply red color to Sundays
                }}
            />
    );
}


function CalendarCard() {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                renderLoading={() => <DayCalendarSkeleton />}
                value={dayjs()}
                slots={{
                    day: CustomDay,
                }}
            />
        </LocalizationProvider>
    );
}

const style = {
    position: 'absolute',
    top: '64px',
    right: '50px',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
};

function CalenderModel({ open, handleClose }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={style}>
                <CalendarCard />
            </Box>
        </Modal>
    );
}

export { CalendarCard, CalenderModel };
