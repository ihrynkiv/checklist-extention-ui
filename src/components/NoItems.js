import {Typography} from "@mui/material";
import React from 'react'

const STYLES = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '40px 10px'
  },
  btn: {
    marginTop: '10px'
  }
}

export const NoItems = ({message = 'Немає даних'}) => {
  return (
    <div style={STYLES.wrapper}>
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        textAlign="center"
      >
        {message}
      </Typography>
    </div>
  )
}
