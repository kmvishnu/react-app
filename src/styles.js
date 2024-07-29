import { styled } from "@mui/material/styles";
import { Fab, Box, Avatar, IconButton, ListItem } from "@mui/material";

export const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
  backgroundColor: "#ffd740",
  "& svg": {
    fontSize: "2.5rem", // Increase the font size
  },
});

export const StyledPopoverContent = styled(Box)({
  padding: "16px",
  textAlign: "center",
  minWidth: "200px",
});

export const StyledAvatar = styled(Avatar)({
  margin: "0 auto 8px",
  width: "60px",
  height: "60px",
});

export const TodoItem = styled(ListItem)({
  padding: "10px 20px",
  marginBottom: "15px",
  borderRadius: "10px",
  boxShadow: "0 -2px 4px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
});

export const ActionBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "16px",
  textAlign: "center",
  minWidth: "200px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
});

export const ActionIconButton = styled(IconButton)({
  margin: "0 8px", // Add spacing between icons
  "& svg": {
    fontSize: "1.5rem",
  },
});
