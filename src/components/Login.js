import React, {useState} from 'react'
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import {useDispatch} from "react-redux";
import {loginAction} from "../store/auth/auth.slice";
import {useHistory} from "react-router-dom";
import {Toast} from "./Toast";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const STYLES = {
  textField: { padding: '8px' },
  btn: { margin: '15px' },
  btnBlock: { display: 'flex', justifyContent: 'center', flexDirection: 'column'},
  mainBlock: { margin: '5px' }
}

const defaultError = {
  password: {
    hasError: false,
    helperText: ''
  }
}

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(defaultError)
  const [open, setOpen] = useState(false)

  const dispatch = useDispatch()
  const history = useHistory()

  const passwordValidation = (value) => {
    if (value.length < 6) {
      setError({...error, password: {hasError: true, helperText: 'password should contain at least 6 characters'}})
    } else {
      setError(defaultError)
    }
  }

  const usernameChangeHandler = (e) => setUsername(e.target.value)
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value)
    passwordValidation(e.target.value)
  }

  const loginClickHandler = () => {
    passwordValidation(password)
    if (error.password.hasError) return

    const user = {username, password}
    dispatch(loginAction(user)).then((res) => {
      if (res.error) {
        setOpen(true)
      } else {
        history.push('/')
      }
    })
  }

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div style={STYLES.mainBlock}>
      <TextField
        id="userName"
        label="Логін або емейл"
        variant="outlined"
        color={"secondary"}
        fullWidth
        margin="normal"
        value={username}
        onChange={usernameChangeHandler}
        styles={STYLES.textField}/>
      <TextField
        error={error.password.hasError}
        helperText={error.password.helperText}
        id="password"
        label="Пароль"
        color={"secondary"}
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        styles={STYLES.textField}
        onChange={passwordChangeHandler}
        type={showPassword ? "text" : "password"}
        InputProps={{ // <-- This is where the toggle button is added.
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleShowPassword}
                onMouseDown={handleShowPassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <div style={STYLES.btnBlock}>
        <Button variant="contained" style={STYLES.btn} onClick={loginClickHandler} color={"secondary"}>
          Вхід
        </Button>
        <Button color={"secondary"} onClick={() => history.push("/registration")}>Реєстрація</Button>
      </div>
      <Toast message="Неправильний логін або пароль" open={open} setOpen={setOpen}/>
    </div>
  )
}
