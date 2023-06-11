import React from 'react'
import {Box} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {useHistory} from "react-router-dom";

export const Settings = () => {
  const history = useHistory()

  const logoutHandler = () => {
    window.localStorage.clear()
    history.push('/login')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '80%',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.primary',
          borderRadius: 1,
          p: 3,
        }}
      >
        Змінити дані користувача
        <IconButton sx={{ ml: 1 }} color={"secondary"} onClick={() => history.push('/update-user-info')}>
          <AccountCircleIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          marginTop: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'red',
          borderRadius: 1,
          p: 3,
        }}
      >
        Вихід
        <IconButton sx={{ ml: 1 }} color={"error"} onClick={logoutHandler}>
          <LogoutIcon/>
        </IconButton>
      </Box>
    </Box>
  )
}
