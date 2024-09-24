import * as React from "react";
import { useState, useEffect } from "react";
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
  const [selectedRow, setSelectedRow] = useState(null); // Track the clicked row

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/collections`);
        console.log(response);
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
  const handleButtonClick = (row) => {
    setSelectedRow(row); // Set the clicked row (optional)
    setShowCollectionTables(true); // Show the CollectionTables component
  };

  // Step 3: Handle closing the CollectionTables component
  const handleCloseCollectionTables = () => {
    setShowCollectionTables(false); // Close the CollectionTables component
    setSelectedRow(null); // Reset the selected row
  };

  return (
    <div>
      {/* Conditionally render the table if CollectionTables is not active */}
      {!showCollectionTables && (
        <TableContainer
          component={Paper}
          sx={{
            margin: "20px auto",
            borderRadius: 2,
            boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
            backgroundColor: "#f7f9fc",
          }}
        >
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
              {collections.map((collection) => (
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
                      Change
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Conditionally render CollectionTables */}
      {showCollectionTables && (
        <div style={{ marginTop: "20px", position: "relative" }}>
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
            {selectedRow?.name}
          </h2>

          {/* Render the CollectionTables component */}
          <CollectionTables />
        </div>
      )}
    </div>
  );
}

export default DbTables;
