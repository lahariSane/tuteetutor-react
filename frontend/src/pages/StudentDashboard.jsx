import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Stack, styled } from '@mui/material';
import Card from '@mui/material/Card';
import { createTheme } from '@mui/material';
import { Typography } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { CalendarCard } from '../components/CalanderCard';
import AnnouncementModel from '../components/AnnouncementModel';
import axios from 'axios';

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    fontSize: "18px",
    fontWeight: "bold",
}));

const Time = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    fontSize: "1rm",
}));

const Topic = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
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
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: "100%",
}));

export default function StudentDashboard() {
    const [value, setValue] = React.useState(0);
    const [subValue, setSubValue] = React.useState(0);
    const [modal, setModal] = React.useState(false);

    const [announcementData, setAnnouncementData] = React.useState([]);
    const [timetable, setTimetable] = React.useState([]);

    const handleModalOpen = () => setModal(true);
    const handleModalClose = () => setModal(false);

    const data = useOutletContext();
    const drawerWidth = data.drawerWidth;

    const theme = createTheme({ breakpoints: { values: { sm: 700, md: 1380 } } }); // Access the Material-UI theme

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handlesubChange = (event, newValue) => {
        setSubValue(newValue);
    };

    React.useEffect(() => {
        async function fetchData() {
            try {
                let response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/announcements`);
                setAnnouncementData(response.data);
                response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/timetable`);
                setTimetable(response.data);
            } catch (error) {
                console.error('Error fetching announcement data:', error);
            }
        }
        fetchData();
    }, []);

    const imageList = ["/images/unnamed.jpg", "/images/unnamed2.jpg", "/images/unnamed3.jpg"];
    const announcement = announcementData.map((announcement, index) => {
        const image = imageList[Math.floor(Math.random() * imageList.length)];
        return (
            <Card key={index} elevation={4} sx={{ borderRadius: "20px", padding: "12px", marginBottom: "10px", background: "#fafafa", "&:hover": { boxShadow: 10 } }}>
                <Stack direction="row">
                    <Box sx={{ height: "200px", minWidth: "200px", borderRadius: '10px', backgroundImage: `url(${image})`, backgroundSize: "cover", marginRight: "50px" }} />
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "left", width: "calc(98% - 200px)" }}>
                        <Box>
                            <Topic>{announcement.course}</Topic>
                            <Announcment>
                                {announcement.title.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        {index < announcement.title.split('\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </Announcment>
                        </Box>
                        <Time sx={{ justifyContent: "right", paddingRight: "1vw" }}>Anonunced By: <b>{announcement.author}</b></Time>
                    </Box>
                </Stack>
            </Card>
        )
    });

    const timetableData = timetable.map((timetable, index) => {
        return (
            <Card key={index} elevation={1} sx={{ padding: "12px", marginBottom: "10px" }}>
                <Subject>{timetable.subject} - {timetable.section}</Subject>
                <Room>Room No: {timetable.roomNo}</Room>
                <Time>{timetable.startTime} - {timetable.endTime}</Time>
            </Card>
        )
    })
    return (

        <Stack
            direction="row"
            sx={{
                minHeight: "900px",
                backgroundColor: "#f6f7f6",
                width: `calc(100vw - ${drawerWidth}px)`,
                left: drawerWidth,
                top: "64px",
                position: "absolute",
                [theme.breakpoints.down('md')]: {
                    height: "700px",
                    width: "100%",
                    left: 0,
                    flexDirection: "column-reverse",
                    direction: "column",
                    alignItems: "center",
                },
                overflowY: "visible",
                overflowX: "hidden"
            }}
            height="100vh"
        >
            <AnnouncementModel open={modal} handleClose={handleModalClose} />
            <Box
                width="75%"
                sx={{
                    margin: "10px",
                    marginLeft: "20px",
                    position: "relative",
                    minHeight: "calc(100% - 90px)",
                    height: "calc(100% - 90px)",
                    [theme.breakpoints.down('md')]: {
                        width: "90%",
                        minHeight: "900px",
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
                        position: "relative",
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
                            <CustomTabPanel value={value} index={0} sx={{ paddingTop: "300px", position: "relative" }}>
                                {announcement}
                                <Box sx={{ height: "50px" }} />
                                <Fab onClick={handleModalOpen} color="primary" variant="extended" aria-label="add" sx={{ position: "sticky", zIndex: 1, bottom: "20px", position: "absolute", bottom: "20px", right: "20px" }}>
                                    <AddIcon sx={{ marginRight: "6px" }} />
                                    New Announcment
                                </Fab>
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
                    <CalendarCard />
                </Card>
                <Card elevation={4} sx={{
                    height: "calc(60% - 10px)",
                    width: "calc(100% - 30px)",
                    margin: "20px 10px 10px 10px",
                    borderRadius: "10px",
                    minHeight: "calc(60% - 20px)",
                    maxHeight: "400px",
                    [theme.breakpoints.down('md')]: {
                        minHeight: "350px",
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
                                {timetableData}
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
