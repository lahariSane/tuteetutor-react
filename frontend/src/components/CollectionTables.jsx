import * as React from "react";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

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
    <Paper sx={{ width: "100%", color: "black"}}>
      <TextField
        variant="standard"
        placeholder="Search by First or Last Name..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }
        }}
        style={{ margin: "20px", width: "40%" }}
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
