import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ViewTodoDialog({ open, onClose, todo }) {
  if (!todo) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle  sx={{
          maxHeight: '60px',
          overflowY: 'auto',
          overflowX: 'hidden',
          wordBreak: 'break-word', 
          overflowWrap: 'break-word', 
        }}>
        <Typography variant="h6" gutterBottom>
          {todo.name}
        </Typography>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          maxHeight: '300px',
          overflowY: 'auto',
          overflowX: 'hidden',
          wordBreak: 'break-word', 
          overflowWrap: 'break-word', 
        }}
      >
        <Typography variant="body1">{`Details - ${todo.details}`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
