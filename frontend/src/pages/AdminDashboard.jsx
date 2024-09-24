import Box from "@mui/material/Box";
import DbTables from "../components/DbTables";
import { createTheme } from "@mui/material";
import CollectionTables from "../components/CollectionTables";
import styled from "styled-components";

const StyledBox = styled(Box)(({theme, navBarHeight, drawerWidth}) => ({
    width: "75%",
    position: "absolute",
    left: `${drawerWidth}px`,
    top: `${navBarHeight}px`,
    marginLeft: `${300 - drawerWidth}px`,
    [theme.breakpoints.down("md")]: {
        width: "90%",
        left: "0",
        alignItems: "center",
    },
}   )        
);

function AdminDashboard({ drawerWidth, navBarHeight }) {
    const theme = createTheme({ breakpoints: { values: { sm: 700, md: 1380 } } });
    return (
        <>
            <StyledBox theme={theme} drawerWidth={drawerWidth} navBarHeight = {navBarHeight}>
                <DbTables />
            </StyledBox>
        </>
    );
}

export default AdminDashboard;