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
    ...row, // Spread the rest of the row data
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

const formatDate = (isoDate) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  };

  const dateObj = new Date(isoDate);

  // Check if the time is 00:00:00
  if (
    dateObj.getUTCHours() === 0 &&
    dateObj.getUTCMinutes() === 0 &&
    dateObj.getUTCSeconds() === 0
  ) {
    options.hour = undefined;
    options.minute = undefined;
  }

  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
};


const paginationModel = { page: 0, pageSize: 10 };

export default function CollectionTables({ name, rows, columns }) {
  const [searchText, setSearchText] = useState("");

  // Generate unique IDs for each row
  const rowsWithId = generateRowsWithId(rows);
  const filteredColumns = columns.filter(
    (col) => col !== "_id" && col !== "__v" && !(name === "timetables" && col === "date")
  );
  const formattedColumns = getColumns(filteredColumns);

  // Filtered rows based on search text
  const filteredRows = rowsWithId.map((row) => {
    const { _id, __v, date, ...rest } = row;
    if (name === "timetables") {
      // Exclude the `date` field for timetables rows
      return rest;
    }
    return { ...rest, date: date ? formatDate(date) : null };
  });

  const searchFilteredRows = filteredRows.filter((row) => {
    return Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <Paper sx={{ width: "100%", color: "black" }}>
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
          },
        }}
        style={{ margin: "20px", width: "40%" }}
      />

      <DataGrid
        rows={searchFilteredRows} // Use filtered rows with auto-generated IDs
        columns={formattedColumns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0, color: "black" }}
      />
    </Paper>
  );
}
