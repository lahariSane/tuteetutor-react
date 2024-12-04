import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function AddData({ open, onClose, onSave }) {
  const [date, setDate] = React.useState('');  // State for date
  const [holidayType, setHolidayType] = React.useState('');  // State for holiday type

  const handleSave = () => {
    if (!date || !holidayType) {
      alert('All fields are required.');
      return;
    }

    const data = { date, holidayType };
    onSave(data);
    handleClose();
  };

  const handleClose = () => {
    setDate('');
    setHolidayType('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}
      PaperProps={{
        style: {
          borderRadius: '30px',
        },
      }}
    >
      <DialogTitle>Edit Holiday</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Date"
          type="date"
          fullWidth
          variant="outlined"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,  // Make the label stay above the input
          }}
        />
        <TextField
          margin="dense"
          label="Holiday Type"
          fullWidth
          variant="outlined"
          value={holidayType}
          onChange={(e) => setHolidayType(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary"
          sx={{
            "&:hover": {
              variant: "contained",
              color: "white",
              backgroundColor: (theme) => theme.palette.primary.main,
            }
          }}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary"
          sx={{
            "&:hover": {
              variant: "contained",
              color: "white",
              backgroundColor: (theme) => theme.palette.primary.main,
            }
          }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddData;
