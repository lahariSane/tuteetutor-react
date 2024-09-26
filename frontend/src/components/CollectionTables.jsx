// import * as React from "react";
// import { useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import Paper from "@mui/material/Paper";
// import { Button, TextField } from "@mui/material";

// // const columns = [
// //   { field: 'id', headerName: 'ID', flex: 1 },
// //   { field: 'firstName', headerName: 'First name', flex: 1, editable: true },
// //   { field: 'lastName', headerName: 'Last name', flex: 1, editable: true },
// //   { field: 'age', headerName: 'Age', type: 'number', flex: 1, editable: true },
// //   {
// //     field: 'edit',
// //     headerName: 'Edit',
// //     flex: 1,
// //     renderCell: (params) => (
// //       <Button
// //         variant="contained"
// //         color="primary"
// //         onClick={() => alert(`Editing row: ${JSON.stringify(params.row)}`)}
// //       >
// //         Edit
// //       </Button>
// //     ),
// //   },
// // ];

// const paginationModel = { page: 0, pageSize: 15 };

// export default function CollectionTables({ rows, columns }) {
//   console.log("to", columns);
//   const [searchText, setSearchText] = useState("");

//   // Remove '_id' key
//   const filteredKeys = columns.filter((key) => key !== "_id");

//   // Filtered rows based on search text
//   const filteredRows = rows.filter((row) => {
//     // const firstName = row.firstName ?? '';
//     // const lastName = row.lastName ?? '';
//     if (row._id) {
//       delete row._id; // Or simply avoid using '_id' in the filtering process
//     }
//     return row;
//   });

//   return (
//     <Paper sx={{ width: "100%" }}>
//       <TextField
//         variant="outlined"
//         placeholder="Search by First or Last Name..."
//         value={searchText}
//         onChange={(e) => setSearchText(e.target.value)}
//         style={{ marginBottom: "20px", width: "100%" }}
//       />

//       <DataGrid
//         rows={filteredRows} // Use filtered rows
//         columns={filteredKeys}
//         initialState={{ pagination: { paginationModel } }}
//         pageSizeOptions={[5, 10]}
//         checkboxSelection
//         // onRowSelectionModelChange={onRowSelectionModelChange}
//         sx={{ border: 0 }}
//       />
//     </Paper>
//   );
// }


import * as React from "react";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Button, TextField } from "@mui/material";

// Automatically generate IDs for rows
const generateRowsWithId = (rows) => {
  return rows.map((row, index) => ({
    id: index + 1, // Generate a unique ID based on the index
    ...row,        // Spread the rest of the row data
  }));
};

const getColumns = (columnNames) => {
  return columnNames.map((col) => ({
    field: col,
    headerName: col.charAt(0).toUpperCase() + col.slice(1), // Capitalize header names
    flex: 1, // Adjust flex for layout
    editable: true, // Make columns editable if needed
  }));
};

const paginationModel = { page: 0, pageSize: 15 };

export default function CollectionTables({ rows, columns }) {
  console.log(rows)
  const [searchText, setSearchText] = useState("");

  // Generate unique IDs for each row
  const rowsWithId = generateRowsWithId(rows);
  const formattedColumns = getColumns(columns);

  // Remove '_id' key from the columns (if needed)
  const filteredKeys = formattedColumns.filter((key) => key.field !== "_id");

  // Filtered rows based on search text
  const filteredRows = rowsWithId.filter((row) => {
    // const firstName = row.firstName ?? "";
    // const lastName = row.lastName ?? "";
    // return (
    //   firstName.toLowerCase().includes(searchText.toLowerCase()) ||
    //   lastName.toLowerCase().includes(searchText.toLowerCase())
    // );
    if (row._id) {
      delete row._id; // Or simply avoid using '_id' in the filtering process
    }
    return row;
  });


  console.log(filteredKeys)
  console.log(filteredRows)
  return (
    <Paper sx={{ width: "100%", color: "black" }}>
      <TextField
        variant="outlined"
        placeholder="Search by First or Last Name..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: "20px", width: "100%" }}
      />

      <DataGrid
        rows={filteredRows} // Use filtered rows with auto-generated IDs
        columns={filteredKeys}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0, color: "black" }}
      />
    </Paper>
  );
}
