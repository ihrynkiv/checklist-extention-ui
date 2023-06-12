import React, {useEffect} from 'react'
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {registrationAction} from "../store/auth/auth.slice";
import {Toast} from "./Toast";
import {fetchUserNames} from "../store/users/users.slice";
import {getUserNames} from "../store/users/users.selector";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const STYLES = {
  textField: { padding: '8px' },
  btn: { margin: '15px' },
  btnBlock: { display: 'flex', justifyContent: 'center', flexDirection: 'column'},
  mainBlock: { margin: '5px' }
}

const noError = {
  hasError: false,
  helperText: ''
}

const defaultError = {
  userName: noError,
  password: noError,
  rePassword: noError
}

const defaultErrorMessage = 'Щось пішло не так';

export const Registration = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [error, setError] = useState(defaultError)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState(defaultErrorMessage)

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(fetchUserNames())
  }, [dispatch])

  const userNames = useSelector(getUserNames)

  const usernameChangeHandler = (e) => {
    if (userNames.includes(e?.target?.value?.toLowerCase())) {
      setError({...error, userName: {hasError: true, helperText: 'userName is already taken'}})
    } else {
      setError({...error, userName: noError})
    }
    setUsername(e?.target?.value)
  }

  const rePasswordValidation = (value) => {
    if (value.length < 6) {
      setError({...error, rePassword: {hasError: true, helperText: 'password should contain at least 6 characters'}})
    } else {
      setError({...error, rePassword: noError})
    }
  }

  const passwordValidation = (value) => {
    if (value.length < 6) {
      setError({...error, password: {hasError: true, helperText: 'password should contain at least 6 characters'}})
    } else {
      setError({...error, password: noError})
    }
  }

  const rePasswordChangeHandler = (e) => {
    setRePassword(e?.target?.value)
    rePasswordValidation(e?.target?.value)
  }

  const passwordChangeHandler = (e) => {
    setPassword(e?.target?.value)
    passwordValidation(e?.target?.value)
  }

  const registrationClickHandler = () => {
    if (password !== rePassword) {
      setMessage("passwords doesnt match")
      setOpen(true)
      return
    }

    passwordValidation(password)
    rePasswordValidation(rePassword)
    if (error.password.hasError) return

    const user = {username, password}
    dispatch(registrationAction(user)).then((res) => {
      if (res.error) {
        setMessage(res.error.message || defaultErrorMessage)
        setOpen(true)
      } else {
        history.push('/')
      }
    })
  }

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const [showRePassword, setShowRePassword] = useState(false);
  const handleShowRePassword = () => setShowRePassword(!showRePassword);

  return (
    <div style={STYLES.mainBlock}>
      <TextField
        id="userName"
        label="Логін або емейл"
        variant="outlined"
        error={error.userName.hasError}
        helperText={error.userName.helperText}
        fullWidth
        margin="normal"
        value={username}
        onChange={usernameChangeHandler}
        styles={STYLES.textField}/>
      <TextField
        id="password"
        label="Пароль"
        variant="outlined"
        error={error.password.hasError}
        helperText={error.password.helperText}
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
      <TextField
        id="re-password"
        label="Повторіть пароль"
        variant="outlined"
        error={error.rePassword.hasError}
        helperText={error.rePassword.helperText}
        fullWidth
        margin="normal"
        value={rePassword}
        styles={STYLES.textField}
        onChange={rePasswordChangeHandler}
        type={showRePassword ? "text" : "password"}
        InputProps={{ // <-- This is where the toggle button is added.
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleShowRePassword}
                onMouseDown={handleShowRePassword}
              >
                {showRePassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <div style={STYLES.btnBlock}>
        <Button variant="contained" style={STYLES.btn} onClick={registrationClickHandler} color={"secondary"}>
          Реєстрація
        </Button>
        <Button color={"secondary"} onClick={() => history.push('/login')}>Вхід</Button>
      </div>
      <Toast message={message} open={open} setOpen={setOpen}/>
    </div>
  )
}
