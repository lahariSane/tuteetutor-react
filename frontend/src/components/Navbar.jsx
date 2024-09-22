import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { createTheme } from '@mui/material';

import Typography from '@mui/material/Typography';

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


function Navbar({ drawerWidth, handleDrawerToggle, sidbarActive }) {

    const theme = createTheme({ breakpoints: { values: { sm: 700, md: 1380 } } });

    return (
        <AppBar
            sx={{
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
                boxShadow: "none",
                [theme.breakpoints.down('md')]: {
                    width: `calc(100%)`,
                    ml: `0px`,
                },
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", width: "100%", height: "100%", bgcolor: "white" }}>
                <Stack direction="row" alignItems="center">
                    <IconButton
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{
                            width: "40px",
                            height: "40px",
                            display: 'none',
                            color: "black",// (theme) => (theme.vars ?? theme).palette.primary.main,
                            mr: 2,
                            [theme.breakpoints.down('md')]: {
                                display: "flex",
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: '700',
                            color: "black"// (theme) => (theme.vars ?? theme).palette.primary.main,
                        }}
                    >
                        {sidbarActive}
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.9} sx={{ color: (theme) => (theme.vars ?? theme).palette.primary.main }}>
                    <IconButton color="primary">
                        <SearchIcon fontSize="medium" />
                    </IconButton>
                    <IconButton color="primary" sx={{ display: { sm: "none" } }}>
                        <CalendarMonthIcon fontSize="medium" />
                    </IconButton>
                    <IconButton color="primary">
                        <Badge color="secondary" variant="dot" invisible={false}>
                            <NotificationsIcon fontSize="medium" />
                        </Badge>
                    </IconButton>
                    <IconButton>
                        <Avatar {...stringAvatar('Naveen Kumar')} src="./log.png" />
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar >
    );
}

export default Navbar;