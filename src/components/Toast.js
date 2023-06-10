import {Alert, Button, IconButton, Snackbar} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

export const Toast = ({message, open, setOpen, severity = "info"}) => {
  const handleClose = () => setOpen(false)

  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      action={action}
    >
      <Alert onClose={handleClose} severity={severity}>{message}</Alert>
    </Snackbar>
  )
}