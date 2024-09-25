import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', flex: 1 }, // Assign flex to allow equal spacing
  { field: 'firstName', headerName: 'First name', flex: 1, editable: true },
  { field: 'lastName', headerName: 'Last name', flex: 1, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    flex: 1,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not editable.',
    sortable: false,
    flex: 1,
    // valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
  {
    field: 'edit',
    headerName: 'Edit',
    flex: 1,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="primary"
        onClick={() => alert(`Editing row: ${JSON.stringify(params.row)}`)}
      >
        Edit
      </Button>
    ),
  },
];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

const paginationModel = { page: 0, pageSize: 15 };

export default function CollectionTables({ searchText = '', rows, onRowSelectionModelChange }) {
  return (
    <Paper sx={{ width: '100%' }}>
      <DataGrid
        rows={rows.filter((row) => {
          const firstName = row.firstName ?? ''; // Use empty string if null or undefined
          const lastName = row.lastName ?? ''; // Use empty string if null or undefined
          return (
            firstName.toLowerCase().includes(searchText.toLowerCase()) ||
            lastName.toLowerCase().includes(searchText.toLowerCase())
          );
        })}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={onRowSelectionModelChange}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
