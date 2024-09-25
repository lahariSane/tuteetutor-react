import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Modal, Box } from '@mui/material';

function CalendarCard() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar />
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
            sx={{ display: { sm: "none" } }}
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
