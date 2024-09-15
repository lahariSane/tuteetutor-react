import * as React from 'react';
import { Box } from "@mui/material";
import { styled } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import "../styles/Sidebar.css";

// importing required icons from material ui
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SettingsIcon from '@mui/icons-material/Settings';

const SidebarListItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: "30px 0px 0px 30px",
    paddingRight: "0px",
    marginRight: "0px",
    width: "100%",
    height: "60px",
    transition: "none",
    '&.Mui-selected': {
        '& .MuiListItemIcon-root': {
            color: (theme.vars ?? theme).palette.primary.dark,
        },
        '& .MuiTypography-root': {
            color: (theme.vars ?? theme).palette.primary.dark,
        },
        '& .MuiSvgIcon-root': {
            color: (theme.vars ?? theme).palette.primary.dark,
        },
        '& .MuiTouchRipple-child': {
            backgroundColor: (theme.vars ?? theme).palette.primary.dark,
        },
    },
    '& .MuiSvgIcon-root': {
        color: "white" //(theme.vars ?? theme).palette.action.active,
    },
    '&:hover': {
        backgroundColor: "white",
        '& .MuiListItemIcon-root, & .MuiTypography-root, & .MuiSvgIcon-root': {
            color: (theme.vars ?? theme).palette.primary.main, // Change icon and text color on hover
        },
    },
    '&:hover:before': {
        content: '""',
        position: "absolute",
        top: "-50px",
        right: "0px",
        height: "50px",
        width: "50px",
        borderRadius: "50%",
        backgroundColor: "transparent",
        boxShadow: "35px 35px 0px 10px white",
    },
    '&:hover::after': {
        content: '""',
        position: "absolute",
        top: "60px",
        right: "0px",
        height: "50px",
        width: "50px",
        borderRadius: "50%",
        backgroundColor: "transparent",
        boxShadow: "35px -35px 0px 10px #ffffff"
    },
}));

function Sidebar({ drawerWidth, mobileOpen, handleDrawerClose, handleDrawerTransitionEnd }) {

    const DivFullWidth = styled('div')({
        width: "100%",
    })

    const LogoContainer = styled('div')({
        position: 'relative',
        height: 40,
        '& img': {
            maxHeight: 40,
        },
    });

    const topIcons = {
        Dashboard: <AutoAwesomeMosaicOutlinedIcon sx={{ color: "white" }} />,
        TimeTable: <EditCalendarOutlinedIcon sx={{ color: "white" }} />,
        Almanac: <CalendarMonthIcon sx={{ color: "white" }} />,
        Support: <SupportAgentIcon sx={{ color: "white" }} />
    };
    const bottomIcons = { Settings: < SettingsIcon sx={{ color: "white" }} /> };

    const drawer = (
        <Box className="drawer">
            <DivFullWidth>
                <Toolbar >
                    <Stack direction="row" justifyContent="center" height="180px" paddingTop="30px" width="100%" border="None">
                        {/* <LogoContainer><img src="./logo.png"></img></LogoContainer> */}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: '700',
                                color: "white"//(theme) => (theme.vars ?? theme).palette.primary.main,
                            }}
                        >
                            TuteeTutor
                        </Typography>
                    </Stack>
                </Toolbar>
                <List>
                    {Object.entries(topIcons).map(([key, value]) => (
                        <ListItem sx={{ pl: 2 }} key={key} disablePadding width="100%">
                            <SidebarListItemButton>
                                <ListItemIcon sx={{ minWidth: 34 }}>
                                    {value}
                                </ListItemIcon>
                                <ListItemText primary={key} sx={{
                                    '& .MuiTypography-root': {
                                        color: "white",
                                        fontWeight: '500',
                                    },
                                }} />
                            </SidebarListItemButton>
                        </ListItem>
                    ))}
                </List>
            </DivFullWidth>
            <DivFullWidth>
                <Divider />
                <List>
                    {Object.entries(bottomIcons).map(([key, value]) => (
                        <ListItem sx={{ pl: 2 }} key={key} disablePadding>
                            <SidebarListItemButton>
                                <ListItemIcon sx={{ minWidth: 34, color: "white" }}>
                                    {value}
                                </ListItemIcon>
                                <ListItemText primary={key} sx={{ color: "white" }} />
                            </SidebarListItemButton>
                        </ListItem>
                    ))}
                </List>
            </DivFullWidth>
        </Box >
    );
    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, backgroundColor: "white" }}
            aria-label="mailbox folders"
        >
            <Drawer
                //   container={container}
                variant="temporary"
                open={mobileOpen}
                onTransitionEnd={handleDrawerTransitionEnd}
                onClose={handleDrawerClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    border: 'none',
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box', width: drawerWidth,   // Remove box-shadow
                        borderRight: 'none',
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}

export default Sidebar;