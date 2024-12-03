import React from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

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
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {message}
          </Typography>
        }
      />
    </ListItem>
  );
};

const NotificationDashboard = ({ notifications }) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    // Implement mark all as read functionality
    console.log("Mark all as read");
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
