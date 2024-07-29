import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
  Box,
  Button,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTodo } from "../../Hooks/useTodo";

const EditTodoDialog = ({ open, onClose, onSuccess, todoToEdit }) => {
  const [todo, setTodo] = useState(todoToEdit?.name || "");
  const [details, setDetails] = useState(todoToEdit?.details || "");
  const [done, setDone] = useState(todoToEdit?.done || false);
  const [constantTodo, setConstantTodo] = useState(
    todoToEdit?.constant || false
  );

  const [errorMessage, setErrorMessage] = useState("");

  const { editTodo, loading } = useTodo();

  useEffect(() => {
    if (todoToEdit) {
      setTodo(todoToEdit.name);
      setDetails(todoToEdit.details);
      setConstantTodo(todoToEdit.constant);
      setDone(todoToEdit.done);
    }
  }, [todoToEdit]);

  const handleTodoChange = (event) => {
    if (event.target.value.length <= 35) {
      setTodo(event.target.value);
    }
  };

  const handleDetailsChange = (event) => {
    if (event.target.value.length <= 150) {
        setDetails(event.target.value);
      }
  };

  const handleConstantTodoChange = (event) => {
    setConstantTodo(event.target.checked);
  };

  const handleSubmit = async () => {
    if (todo.trim()) {
      try {
        const data = {
          id: todoToEdit._id,
          name: todo,
          details: details,
          done: done,
          constant: constantTodo,
        };
        const res = await editTodo(data);
        if (res && res.status === 200) {
          setErrorMessage("");
          onClose();
          onSuccess();
        } else {
          setErrorMessage("Failed to edit todo. Please try again.");
        }
      } catch (error) {
        setErrorMessage("Failed to edit todo. Please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div>Edit Todo</div>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          id="todo"
          label="Enter todo"
          type="text"
          fullWidth
          variant="standard"
          value={todo}
          onChange={handleTodoChange}
          helperText={`${todo.length}/20`}
          error={todo.length === 20}
        />
        <TextField
          margin="dense"
          id="details"
          label="Details"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={details}
          onChange={handleDetailsChange}
          helperText={`${details.length}/150`}
          error={details.length === 150}
        />
        <FormControlLabel
          control={
            <Switch
              checked={constantTodo}
              onChange={handleConstantTodoChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label="Constant?"
        />
        {errorMessage && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        )}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={!todo.trim() || loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditTodoDialog;
