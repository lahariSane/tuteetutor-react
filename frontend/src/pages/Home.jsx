// import * as React from 'react';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import { createTheme } from '@mui/material/styles';
// import { AppProvider } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import SettingsIcon from '@mui/icons-material/Settings';
// import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
// import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
// import CalendarCard from '../components/CalanderCard';


// import Grid from '@mui/material/Grid2';
// import Paper from '@mui/material/Paper';
// import { styled } from '@mui/material/styles';

// const Item = styled(Paper)(({ theme }) => ({
//     display: 'flex',
//     backgroundColor: '#fff',
//     overflow: 'hidden',
//     ...theme.typography.body2,
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: theme.palette.text.secondary,
//     ...theme.applyStyles('dark', {
//         backgroundColor: '#1A2027',
//     }),
// }));

// const NAVIGATION = [
//     {
//         segment: 'dashboard',
//         title: 'Dashboard',
//         icon: <AutoAwesomeMosaicOutlinedIcon />,
//     },
//     {
//         segment: 'orders',
//         title: 'TimeTable',
//         icon: <EditCalendarOutlinedIcon />,
//     },
//     {
//         segment: 'almanc',
//         title: 'Almanac',
//         icon: <CalendarMonthIcon />,
//     },
//     {
//         kind: 'divider',
//     },
//     {
//         segment: 'settings',
//         title: 'Settings',
//         icon: < SettingsIcon />,
//     },
// ];

// const demoTheme = createTheme({
//     cssVariables: {
//         colorSchemeSelector: 'data-toolpad-color-scheme',
//     },
//     colorSchemes: { light: true, dark: true },
//     breakpoints: {
//         values: {
//             xs: 0,
//             sm: 600,
//             md: 600,
//             lg: 1200,
//             xl: 1536,
//         },
//     },
// });

// function DemoPageContent({ pathname }) {
//     return (
//         <Box
//             sx={{
//                 py: 4,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 textAlign: 'center',
//             }}
//         >
//             <Typography>Dashboard content for {pathname}</Typography>
//         </Box>
//     );
// }

// DemoPageContent.propTypes = {
//     pathname: PropTypes.string.isRequired,
// };

// function Home() {

//     const [pathname, setPathname] = React.useState('/dashboard');

//     // const router = React.useMemo(() => {
//     //     return {
//     //         pathname,
//     //         searchParams: new URLSearchParams(),
//     //         navigate: (path) => setPathname(String(path)),
//     //     };
//     // }, [pathname]);

//     return (
//         <AppProvider
//             navigation={NAVIGATION}
//             branding={{
//                 logo: <img src="logo.png" alt="Tuteetutor logo" width='50px' height='40px' />,
//                 title: 'Tutee Tutor',
//             }}
//             // router={router}
//             theme={demoTheme}
//         >
//             <DashboardLayout>
//                 <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
//                     <Grid container rowSpacing={1} size={9}>
//                         <Item>
//                             <Box component="section" sx={{ p: 50, border: '1px dashed grey' }}>
//                                 This Box renders as an HTML section element.
//                             </Box>
//                         </Item>
//                     </Grid>
//                     <Grid size={3} container justifyContent="space-between">
//                         <Item>
//                             <CalendarCard />
//                         </Item>
//                         <Item>
//                             <CalendarCard />
//                         </Item>
//                     </Grid>
//                 </Grid>
//             </DashboardLayout>
//         </AppProvider>
//     );
// }

// export default Home;

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const drawerWidth = 300;

const LogoContainer = styled('div')({
    position: 'relative',
    height: 40,
    '& img': {
        maxHeight: 40,
    },
});

const DivFullWidth = styled('div')({
    width: "100%",
})


function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    const splittedName = name.split(' ');
    return {
        sx: {
            width: "30px", height: "30px",
            bgcolor: stringToColor(name),
            fontSize: "12px",
        },
        children: `${splittedName[0][0]}`,
    };
}


const NavigationListItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: 8,
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
        color: (theme.vars ?? theme).palette.action.active,
    },
}));

function BadgeMax() {
    return (
        <Menu>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Badge color="secondary" badgeContent={10}>
                        <NotificationsIcon color="primary" fontSize="medium" />
                    </Badge>
                </IconButton>
            </MenuItem>
        </Menu>
    );
}

function Home(props) {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const topIcons = { Dashboard: <AutoAwesomeMosaicOutlinedIcon />, TimeTable: <EditCalendarOutlinedIcon />, Almanac: <CalendarMonthIcon /> };
    const bottomIcons = { Support: <SupportAgentIcon />, Settings: < SettingsIcon /> };
    const drawer = (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%", width: "100%" }}>
            <DivFullWidth>
                <Toolbar >
                    <Stack direction="row" alignItems="center">
                        <LogoContainer><img src="./logo.png"></img></LogoContainer>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: '700',
                                color: (theme) => (theme.vars ?? theme).palette.primary.main,
                            }}
                        >
                            TuteeTutor
                        </Typography>
                    </Stack>
                </Toolbar>
                <Divider />
                <List>
                    {Object.entries(topIcons).map(([key, value]) => (
                        <ListItem sx={{ pt: 0, pb: 0, pl: 2, pr: 2 }} key={key} disablePadding>
                            <NavigationListItemButton>
                                <ListItemIcon sx={{ minWidth: 34 }}>
                                    {value}
                                </ListItemIcon>
                                <ListItemText primary={key} sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: '500',
                                    },
                                }} />
                            </NavigationListItemButton>
                        </ListItem>
                    ))}
                </List>
            </DivFullWidth>
            <DivFullWidth>
                <Divider />
                <List>
                    {Object.entries(bottomIcons).map(([key, value]) => (
                        <ListItem sx={{ pt: 0, pb: 0, pl: 2, pr: 2 }} key={key} disablePadding>
                            <NavigationListItemButton>
                                <ListItemIcon>
                                    {value}
                                </ListItemIcon>
                                <ListItemText primary={key} />
                            </NavigationListItemButton>
                        </ListItem>
                    ))}
                </List>
            </DivFullWidth>
        </div >
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between", width: "100%", bgcolor: "white" }}>
                    <Stack direction="row" alignItems="center">
                        <IconButton
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{
                                color: (theme) => (theme.vars ?? theme).palette.primary.main,
                                mr: 2,
                                display: { sm: 'none' }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h7"
                            sx={{
                                fontWeight: '700',
                                color: (theme) => (theme.vars ?? theme).palette.primary.main,
                            }}
                        >
                            Dashboard
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar {...stringAvatar('Naveen Kumar')} src="./log.png" />
                        <BadgeMax />
                    </Stack>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}

export default Home;
