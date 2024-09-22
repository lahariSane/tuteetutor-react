import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Stack, styled } from '@mui/material';
import Card from '@mui/material/Card';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createTheme } from '@mui/material';
import { Typography } from '@mui/material';
import { useOutletContext } from 'react-router-dom';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Room = styled('div')(({ theme }) => ({
    color: theme.palette.text.secondary,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
}));

const Subject = styled('div')(({ theme }) => ({
    color: theme.palette.primary.main,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    fontSize: "18px",
    fontWeight: "bold",
}));

const Time = styled('Typography')(({ theme }) => ({
    color: theme.palette.text.secondary,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    fontSize: "1rm",
}));

const Topic = styled('Typography')(({ theme }) => ({
    color: theme.palette.primary.main,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    width: "100%",
    fontSize: "25px",
    fontWeight: "bold",
}));

const Announcment = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "20px",
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: "100%",
}));

export default function StudentDashboard() {
    const [value, setValue] = React.useState(0);
    const [subValue, setSubValue] = React.useState(0);
    const data = useOutletContext(); 
    const drawerWidth = data.drawerWidth;

    const theme = createTheme({ breakpoints: { values: { sm: 700, md: 1380 } } }); // Access the Material-UI theme

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handlesubChange = (event, newValue) => {
        setSubValue(newValue);
    };

    return (

        <Stack
            direction="row"
            sx={{
                minHeight: "700px",
                backgroundColor: "#f6f7f6",
                width: `calc(100vw - ${drawerWidth}px)`,
                left: drawerWidth,
                position: "relative",
                overflow: "hidden",
                [theme.breakpoints.down('md')]: {
                    width: "100%",
                    left: 0,
                    flexDirection: "column-reverse",
                    direction: "column",
                    alignItems: "center",
                },
                overflowY: "visible"
            }}
            height="100vh"
        >
            <Box
                width="75%"
                sx={{
                    margin: "10px",
                    marginLeft: "20px",
                    top: "70px",
                    position: "relative",
                    minHeight: "calc(100% - 90px)",
                    height: "calc(100% - 90px)",
                    [theme.breakpoints.down('md')]: {
                        width: "90%",
                        maxWidth: "950px",
                        height: "auto",
                        display: "flex",
                        flexDirection: "row-reverse",
                        direction: "column",
                    },
                }}
            >
                <Card
                    elevation={4}
                    sx={{
                        borderRadius: "10px",
                        height: "100%", width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        [theme.breakpoints.down('md')]: {
                            height: "90%",
                            maxHeight: "calc(100vh - 200px)",
                            marginBottom: "10px",
                        },
                    }}>
                    <Box sx={{ height: "100%" }}>
                        <Box sx={{ marginLeft: "12px", borderBottom: 1, borderColor: 'transparent', backgroundColor: "white", borderRadius: "30px" }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Announcments" {...a11yProps(0)} sx={{ color: "black", fontSize: "16px", fontWeight: "bold" }} />
                                <Tab label="Assignments" {...a11yProps(1)} sx={{ color: "black", fontSize: "16px", fontWeight: "bold" }} />
                                <Tab label="ToDo" {...a11yProps(2)} sx={{ color: "black", fontSize: "16px", fontWeight: "bold" }} />
                            </Tabs>
                        </Box>
                        <Box sx={{ overflowY: "auto", height: "calc(100% - 50px)" }}>
                            <CustomTabPanel value={value} index={0} sx={{ paddingTop: "300px" }}>
                                <Card elevation={4} sx={{ borderRadius: "20px", padding: "12px", marginBottom: "10px", background: "#fafafa", "&:hover": { boxShadow: 10 } }}>
                                    <Stack direction="row">
                                        <Box sx={{ height: "200px", minWidth: "200px", borderRadius: '10px', backgroundImage: `url("/images/unnamed.jpg")`, backgroundSize: "cover", marginRight: "50px" }} />
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "left", width: "calc(98% - 200px)" }}>
                                            <Box>
                                                <Topic>Operating System</Topic>
                                                <Announcment>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem dolores soluta ipsa enim distinctio dolor exercitationem blanditiis ex, neque fuga, eum est vel veniam asperiores porro magni ut quisquam corporis?</Announcment>
                                            </Box>
                                            <Time sx={{ justifyContent: "right", paddingRight: "1vw" }}>Anonunced By: <b>Lahari Sane</b></Time>
                                        </Box>
                                    </Stack>
                                </Card>
                                <Card elevation={4} sx={{ borderRadius: "20px", padding: "12px", marginBottom: "10px", background: "#fafafa", "&:hover": { boxShadow: 10 } }}>
                                    <Stack direction="row">

                                        <Box sx={{ height: "200px", minWidth: "200px", borderRadius: '10px', backgroundImage: `url("/images/unnamed2.jpg")`, backgroundSize: "cover", marginRight: "50px" }} />
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "left", width: "calc(98% - 200px)" }}>
                                            <Box>
                                                <Topic>Artificial Intelligence</Topic>
                                                <Announcment>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem dolores soluta ipsa enim distinctio dolor exercitationem blanditiis ex, neque fuga, eum est vel veniam asperiores porro magni ut quisquam corporis?</Announcment>
                                                <Time sx={{ justifyContent: "right", paddingRight: "1vw" }}>Anonunced By: <b>Lahari Sane</b></Time>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Card>
                                <Card elevation={4} sx={{ borderRadius: "20px", padding: "12px", marginBottom: "10px", background: "#fafafa", "&:hover": { boxShadow: 10 } }}>
                                    <Stack direction="row">

                                        <Box sx={{ height: "200px", minWidth: "200px", borderRadius: '10px', backgroundImage: `url("/images/unnamed3.jpg")`, backgroundSize: "cover", marginRight: "50px" }} />
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "left", width: "calc(98% - 200px)" }}>
                                            <Box>
                                                <Topic>Machine Learning</Topic>
                                                <Announcment>sdfc , eum est vel veniam asperiores porro magni ut quisquam corporis?</Announcment>
                                            </Box>
                                            <Time sx={{ justifyContent: "right", paddingRight: "1vw" }}>Anonunced By: <b>Lahari Sane</b></Time>
                                        </Box>
                                    </Stack>
                                </Card>
                                <Card elevation={4} sx={{ borderRadius: "20px", padding: "12px", marginBottom: "10px", background: "#fafafa", "&:hover": { boxShadow: 10 } }}>
                                    <Stack direction="row">

                                        <Box sx={{ height: "200px", minWidth: "200px", borderRadius: '10px', backgroundImage: `url("/images/unnamed.jpg")`, backgroundSize: "cover", marginRight: "50px" }} />

                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "left", width: "calc(98% - 200px)" }}>
                                            <Topic>Cloud computing</Topic>
                                            <Announcment>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem dolores soluta ipsa enim distinctio dolor exercitationem blanditiis ex, neque fuga, eum est vel veniam asperiores porro magni ut quisquam corporis?</Announcment>
                                            <Time sx={{ justifyContent: "right", paddingRight: "1vw" }}>Anonunced By: <b>Lahari Sane</b></Time>
                                        </Box>
                                    </Stack>
                                </Card>
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                Item Two
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={2}>
                                Item Three
                            </CustomTabPanel>
                        </Box>
                    </Box>
                </Card>
            </Box>
            <Box sx={{
                height: "calc(100% - 90px)",
                top: "70px",
                position: "relative",
                width: "400px",
                minWidth: "400px",
                [theme.breakpoints.down('md')]: {
                    width: "100%",
                    display: "flex",
                    flexDirection: "row-reverse",
                    direction: "column",
                    alignItems: "center",
                    justifyContent: "center"
                },
            }}>
                <Card elevation={4} sx={{
                    margin: "10px",
                    height: "calc(40% - 10px)", width: "calc(100% - 30px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    minHeight: "350px",
                    maxHeight: "400px",
                    [theme.breakpoints.down('md')]: {
                        width: "45%",
                        height: "90%",
                        maxWidth: "450px",
                        display: "flex",
                        flexDirection: "row-reverse",
                        direction: "column",
                        marginRight: "20px",
                    },
                    [theme.breakpoints.down('sm')]: {
                        width: "700px",
                        height: "90%",
                        display: "none",
                        flexDirection: "row-reverse",
                        direction: "column",
                    },
                }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar />
                    </LocalizationProvider>
                </Card>
                <Card elevation={4} sx={{
                    height: "calc(60% - 10px)", width: "calc(100% - 30px)",
                    margin: "20px 10px 10px 10px",
                    borderRadius: "10px",
                    minHeight: "350px",
                    maxHeight: "400px",
                    [theme.breakpoints.down('md')]: {
                        height: "90%",
                        maxWidth: "450px",
                        margin: "10px",
                        width: "45%",
                        marginLeft: "30px",
                    },
                    [theme.breakpoints.down('sm')]: {
                        width: "100%",
                        maxWidth: "900px",
                        maxHeight: "350px",
                        marginRight: "30px",
                    },
                }}>
                    <Box sx={{ height: "100%" }}>
                        <Box sx={{ marginLeft: "12px", borderBottom: 1, borderColor: 'transparent' }}>
                            <Tabs value={subValue} onChange={handlesubChange} aria-label="basic tabs example">
                                <Tab label="Classes" {...a11yProps(0)} sx={{ color: "black", fontSize: "16px", fontWeight: "bold" }} />
                                <Tab label="Holidays" {...a11yProps(1)} sx={{ color: "black", fontSize: "16px", fontWeight: "bold" }} />
                            </Tabs>
                        </Box>
                        <Box sx={{ overflowY: "auto", height: "calc(100% - 30px)" }}>
                            <CustomTabPanel value={subValue} index={0}>
                                <Card elevation={1} sx={{ padding: "12px", marginBottom: "10px" }}>
                                    <Subject>FDFED - 1</Subject>
                                    <Room>Room No: G06</Room>
                                    <Time>10:00 PM - 11:00 PM</Time>
                                </Card>
                                <Card elevation={1} sx={{ padding: "12px", marginBottom: "10px" }}>
                                    <Subject>CC - 2</Subject>
                                    <Room>Room No: G06</Room>
                                    <Time>10:00 PM - 11:00 PM</Time>
                                </Card>
                                <Card elevation={1} sx={{ padding: "12px", marginBottom: "10px" }}>
                                    <Subject>FDFED - 1</Subject>
                                    <Room>Room No: G06</Room>
                                    <Time>10:00 PM - 11:00 PM</Time>
                                </Card>
                                <Card elevation={1} sx={{ padding: "12px", marginBottom: "10px" }}>
                                    <Subject>CC - 2</Subject>
                                    <Room>Room No: G06</Room>
                                    <Time>10:00 PM - 11:00 PM</Time>
                                </Card>
                            </CustomTabPanel>
                            <CustomTabPanel value={subValue} index={1}>
                                <Card elevation={1} sx={{ padding: "12px", marginBottom: "10px" }}>
                                    <Subject>Maha Navami</Subject>
                                    <Room>11 oct 2024</Room>
                                    <Time>Friday</Time>
                                </Card>
                                <Card elevation={1} sx={{ padding: "12px", marginBottom: "10px" }}>
                                    <Subject>Dussehra</Subject>
                                    <Room>12 oct 2024</Room>
                                    <Time>Saturday</Time>
                                </Card>
                            </CustomTabPanel>
                        </Box>
                    </Box>
                </Card>
            </Box>
        </Stack >
    );
}
