import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Popover,
  Divider,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Hooks/useUser";
import { useTodo } from "../../Hooks/useTodo";
import { useMediaQuery } from "@mui/material";

import {
  StyledFab,
  StyledPopoverContent,
  StyledAvatar,
  TodoItem,
  ActionBox,
  ActionIconButton,
} from "../../styles";
import AddTodoDialog from "../Popup/AddTodoDialog";
import EditTodoDialog from "../Popup/EditTodoDialog";
import ViewTodoDialog from "../Popup/viewTodoDialog";

export default function Home() {
  const name = useSelector((state) => state.user.user);
  const { logoutUser } = useUser();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const { deleteTodo, viewTodos, editTodo, todos } = useTodo();
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    viewTodos();
  }, [viewTodos]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleActionClick = (event, todo) => {
    setSelectedTodo(todo);
    setActionAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedTodo(null);
  };

  const handleActionDelete = async () => {
    try {
      const res = await deleteTodo(selectedTodo);
      if (res && res.status === 200) {
        viewTodos();
      }
    } catch (error) {
      console.log("Failed to delete todo. Please try again.");
    }

    setActionAnchorEl(null);
    setSelectedTodo(null);
  };

  const handleAddIconClick = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleAddTodoSuccess = () => {
    viewTodos();
  };

  const handleEditIconClick = (todo) => {
    setTodoToEdit(todo);
    setEditDialogOpen(true);
    setActionAnchorEl(null);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setTodoToEdit(null);
  };

  const handleEditTodoSuccess = () => {
    viewTodos();
  };

  const handleViewIconClick = (todo) => {
    setSelectedTodo(todo);
    setViewDialogOpen(true);
    setActionAnchorEl(null);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedTodo(null);
  };

  const handleDoneToggle = async (todo) => {
    try {
      const updatedTodo = { ...todo, done: !todo.done };
      const data = {
        id: updatedTodo._id,
        name: updatedTodo.name,
        details: updatedTodo.details,
        done: updatedTodo.done,
        constant: updatedTodo.constant,
      };
      const res = await editTodo(data);
      if (res && res.status === 200) {
        viewTodos();
      }
    } catch (error) {
      console.log("Failed to update todo. Please try again.");
    }
    setActionAnchorEl(null);
    setSelectedTodo(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const actionOpen = Boolean(actionAnchorEl);
  const actionId = actionOpen ? "action-popover" : undefined;

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <React.Fragment>
      <Typography
        variant="h5"
        gutterBottom
        component="div"
        sx={{
          p: 2,
          pb: 0,
          position: "sticky",
          top: 0,
          bgcolor: "white",
          zIndex: 1,
        }}
      >
        Today
      </Typography>

      <Box sx={{ padding: "20px", pb: "80px" }}>
        <List
          sx={{
            width: "100%",
            maxWidth: "100%",
            bgcolor: "background.paper",
          }}
        >
          {todos
            .filter((todo) => !todo.done)
            .concat(todos.filter((todo) => todo.done))
            .map((todo) => (
              <React.Fragment key={todo._id}>
                <TodoItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="more"
                      onClick={(event) => handleActionClick(event, todo)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                  sx={{
                    mb: 2,
                    opacity: todo.done ? 0.5 : 1,
                    textDecoration: todo.done ? "line-through" : "none",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#3f51b5" }}>
                      <Typography variant="caption" color="white">
                        {todo.name.charAt(0)}
                      </Typography>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={truncateText(todo.name, isSmallScreen ? 25 : 35)}
                    secondary={truncateText(
                      ` - ${todo.details}`,
                      isSmallScreen ? 25 : 40
                    )}
                  />
                </TodoItem>
              </React.Fragment>
            ))}
        </List>
      </Box>
      <AppBar
        position="fixed"
        sx={{ top: "auto", bottom: 0, bgcolor: "white" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            sx={{ color: "black" }}
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <StyledFab aria-label="add" onClick={handleAddIconClick}>
            <AddIcon />
          </StyledFab>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <StyledPopoverContent>
          <StyledAvatar
            alt={name}
            src="/static/images/avatar/default-avatar.png"
          />
          <Typography variant="h6">{name}</Typography>
          <Typography variant="body2" color="textSecondary">
            Welcome back!
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </StyledPopoverContent>
      </Popover>
      <Popover
        id={actionId}
        open={actionOpen}
        anchorEl={actionAnchorEl}
        onClose={handleActionClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <ActionBox>
          <ActionIconButton
            className="done"
            onClick={() => handleDoneToggle(selectedTodo)}
          >
            <DoneIcon />
          </ActionIconButton>
          <ActionIconButton className="view" onClick={() => handleViewIconClick(selectedTodo)}>
            <VisibilityIcon />
          </ActionIconButton>
          <ActionIconButton
            className="edit"
            onClick={() => handleEditIconClick(selectedTodo)}
          >
            <EditIcon />
          </ActionIconButton>
          <ActionIconButton className="delete" onClick={handleActionDelete}>
            <DeleteIcon />
          </ActionIconButton>
          <ActionIconButton className="close" onClick={handleActionClose}>
            <CloseIcon />
          </ActionIconButton>
        </ActionBox>
      </Popover>
      <AddTodoDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        onSuccess={handleAddTodoSuccess}
      />
      <EditTodoDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        onSuccess={handleEditTodoSuccess}
        todoToEdit={todoToEdit}
      />
      <ViewTodoDialog
        open={viewDialogOpen}
        onClose={handleViewDialogClose}
        todo={selectedTodo}
      />
    </React.Fragment>
  );
}
