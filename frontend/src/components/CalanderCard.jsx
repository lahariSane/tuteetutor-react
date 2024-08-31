import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

function CalendarCard() {
  return (
    <Card variant="outlined" sx={{ display: 'inline-block' }}>
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar />
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
}

export default CalendarCard;
