import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
  Button,
  Box,
  Alert,
  AlertTitle,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";

const NotificationHeader = ({ unreadCount, onMarkAllRead }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: "divider",
        position: "sticky",
        top: 0,
        bgcolor: "background.paper",
        zIndex: 1,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6">Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
          </Typography>
        </Box>
        <Button
          size="small"
          onClick={onMarkAllRead}
          sx={{ textTransform: "none" }}
        >
          Mark all as read
        </Button>
      </Box>
    </Box>
  );
};

const NotificationList = ({ notifications }) => {
  return (
    <List sx={{ p: 0 }}>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} />
      ))}
    </List>
  );
};

const getIconByType = (type) => {
  const iconProps = { fontSize: "small" };
  switch (type) {
    case "success":
      return <CheckCircleIcon {...iconProps} color="success" />;
    case "warning":
      return <WarningIcon {...iconProps} color="warning" />;
    default:
      return <InfoIcon {...iconProps} color="info" />;
  }
};

const NotificationItem = ({ title, message, time, isRead, type = "info" }) => {
  return (
    <ListItem
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: !isRead ? "action.hover" : "transparent",
        "&:hover": {
          bgcolor: "action.selected",
        },
        cursor: "pointer",
        transition: "background-color 0.2s",
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>{getIconByType(type)}</ListItemIcon>
      <ListItemText
        primary={
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2" component="span">
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(time), { addSuffix: true })}
            </Typography>
          </Box>
        }
        secondary={
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2, // Limit to 2 lines by default
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              transition: "all 0.2s", // Smooth transition for hover effect
              "&:hover": {
                WebkitLineClamp: "unset", // Show the full message when hovered
                overflow: "visible", // Allow the content to overflow when hovered
              },
            }}
          >
            {message}
          </Typography>
        }
      />
    </ListItem>
  );
};


const NotificationDashboard = ({ user, setNotificationsRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace with your API endpoint
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(response.data.notifications.reverse());
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  if (loading)
    return (
      <Box padding={2}>
        <Typography variant="h6">Notifications</Typography>
        <Skeleton animation="wave" variant="text" height={30} width="60%" />
        <Skeleton
          animation="wave"
          variant="rectangular"
          height={60}
          width="100%"
          sx={{ marginBottom: 2 }}
        />
        <Skeleton
          animation="wave"
          variant="rectangular"
          height={60}
          width="100%"
          sx={{ marginBottom: 2 }}
        />
        <Skeleton variant="rectangular" height={60} width="100%" />
      </Box>
    );

  if (error)
    return (
      <Box padding={2}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Box>
    );

  const handleMarkAllRead = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      setNotificationsRead(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
      />
      <NotificationList notifications={notifications} />
    </>
  );
};

export default NotificationDashboard;
