import * as React from "react";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CollectionTables from "./CollectionTables";
import axios from "axios";

function DbTables() {
  // Step 1: Create state to track if a button has been clicked
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCollectionTables, setShowCollectionTables] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); // Track the clicked row
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/collections`
        );
        console.log(response.data);
        setCollections(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching collections");
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // Step 2: Handle button click
  const handleButtonClick = async (row) => {
    // setSelectedRows(row); // Set the clicked row (optional)
    setShowCollectionTables(true); // Show the CollectionTables component

    try {
      // Fetch data for the clicked collection
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/collections/${row.name}`
      );
      console.log(response.data);
      // setSelectedRows(response.data); // Store the fetched collection data
      setSelectedRows({
        ...row,
        data: response.data
      })
      console.log(selectedRows);
    } catch (err) {
      setError("Error fetching collection data");
    }
  };

  // Step 3: Handle closing the CollectionTables component
  const handleCloseCollectionTables = () => {
    setShowCollectionTables(false); // Close the CollectionTables component
    // setSelectedRow(null); // Reset the selected row
  };

  // const rows = [
  //   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  //   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  //   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  //   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  //   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  //   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  //   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  //   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  //   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  // ];

  const filteredCollections = collections.filter((row) => {
    const name = row.name ?? "";
    return (
      name.toLowerCase().includes(searchText.toLowerCase()) 
    );
  });

  return (
    <div>
      {/* Conditionally render the table if CollectionTables is not active */}
      {!showCollectionTables && (
        <>
          <TableContainer
            component={Paper}
            sx={{
              margin: "20px auto",
              borderRadius: 2,
              boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
              backgroundColor: "#f7f9fc",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ marginBottom: "20px", width: "100%" }}
            />
            <Table
              sx={{
                backgroundColor: "#ffffff",
                "& .MuiTableCell-head": {
                  fontWeight: "bold",
                  color: "#333",
                  backgroundColor: "#f0f0f0",
                  fontSize: "16px",
                  textTransform: "uppercase",
                },
              }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>COLLECTIONS</TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCollections.map((collection) => (
                  <TableRow
                    key={collection.name} // Assuming each collection has a name property
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Button onClick={() => handleButtonClick(collection)}>
                        {collection.name}
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <Button onClick={() => handleButtonClick(collection)}>
                        Add
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <Button onClick={() => handleButtonClick(collection)}>
                        Modify
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Conditionally render CollectionTables */}
      {showCollectionTables && selectedRows != [] && (
        <div style={{ marginTop: "80px", position: "relative" }}>
          {/* Close button at the top right */}
          <IconButton
            onClick={handleCloseCollectionTables}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              margin: "10px",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Heading with larger font size */}
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {selectedRows?.name}
          </h2>

          {/* Render the CollectionTables component */}
          {selectedRows?.data && <CollectionTables rows={selectedRows?.data} columns={Object.keys(selectedRows?.data[0])} />}
          {/* <CollectionTables rows={selectedRows?.data || []} /> */}
        </div>
      )}
    </div>
  );
}

export default DbTables;