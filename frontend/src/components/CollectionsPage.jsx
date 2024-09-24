import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DataTable from './CollectionTables'; // Adjust import as needed

// Dropdown (actions menu) component
function ActionsMenu({ onDeleteSelected, onActionSelect }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedAction, setSelectedAction] = React.useState('------');
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action) => {
    setSelectedAction(action);
    handleClose();
    onActionSelect(action); // Pass selected action to parent
  };

  return (
    <>
      <TextField
        label="Actions"
        variant="outlined"
        size="small"
        value={selectedAction}
        onClick={handleClick} // Open dropdown on TextField click
        InputProps={{
          readOnly: true,
        }}
        style={{ width: '150px', cursor: 'pointer' }} // Adjust width and cursor
      />
      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick('------')}>
          ------  {/* Default option */}
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Delete Selected')}>
          Delete Selected
        </MenuItem>
      </Menu>
    </>
  );
}

function CollectionsPage() {
  const [searchText, setSearchText] = React.useState('');
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [selectedAction, setSelectedAction] = React.useState('------');

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
  };

  const handleGoClick = () => {
    alert(`Selected Action: ${selectedAction}`);
    // Implement your 'Go' button logic here
  };

  return (
    <div>
      {/* Heading */}
      <h1>Data Management</h1>

      {/* Add Button, Search Bar, Actions Menu, and Go Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        {/* Search bar on the left with reduced size */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: '200px' }}
          />
        </div>

        {/* Actions dropdown and Go button */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ActionsMenu onActionSelect={handleActionSelect} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoClick}
            style={{ marginLeft: 16 }}
          >
            Go
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert('Add button clicked')}
            style={{ marginLeft: 16 }}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        searchText={searchText}
        selectedRows={selectedRows}
        onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
      />
    </div>
  );
}

export default CollectionsPage;
