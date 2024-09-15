import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';

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


function Navbar({ drawerWidth, handleDrawerToggle }) {
    return (
        <AppBar
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                boxShadow: "none",
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", width: "100%", height: "100%", bgcolor: "white" }}>
                <Stack direction="row" alignItems="center">
                    <IconButton
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{
                            color: "black",// (theme) => (theme.vars ?? theme).palette.primary.main,
                            mr: 2,
                            display: { sm: 'none' }
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
                        Dashboard
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ color: (theme) => (theme.vars ?? theme).palette.primary.main }}>
                    <SearchIcon sx={{ color: "#4F75FF" }} fontSize="medium" />
                    <Badge color="secondary" variant="dot" invisible={false}>
                        <NotificationsIcon sx={{ color: "#4F75FF" }} fontSize="medium" />
                    </Badge>
                    <Avatar {...stringAvatar('Naveen Kumar')} src="./log.png" />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;