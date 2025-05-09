import React from 'react';
import Box from "@mui/material/Box";
import DbTables from "../components/DbTables";
import { createTheme } from "@mui/material";
import styled from "styled-components";
import { useOutletContext } from 'react-router-dom';
import LeaveApproval from "../components/leaveApproval";

const StyledBox = styled(Box)(({ theme, navBarHeight, drawerWidth }) => ({
  width: "90%",
  position: "absolute",
  left: `${drawerWidth}px`,
  top: `${navBarHeight}px`,
  marginLeft: `${250 - drawerWidth}px`,
  display: 'flex',
  flexWrap: 'nowrap', // Prevents wrapping of content (to keep it on one line)
  [theme.breakpoints.down("md")]: {
    width: "90%",
    left: "0",
    alignItems: "center",
  },
}));

function AdminDashboard() {
  const data = useOutletContext();
  const theme = createTheme({ breakpoints: { values: { sm: 700, md: 1380 } } });

  return (
    <>
      <StyledBox theme={theme} drawerWidth={data.drawerWidth} navBarHeight={data.navBarHeight}>
        <DbTables />
      </StyledBox>
    </>
  );
}

export default AdminDashboard;
