import React from 'react'
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {updatePasswordAction} from "../store/auth/auth.slice";
import {Toast} from "./Toast";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";

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
  oldPassword: noError,
  password: noError,
  rePassword: noError
}

const defaultErrorMessage = 'something went wrong';

export const UpdateUserInfo = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [error, setError] = useState(defaultError)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState(defaultErrorMessage)

  const dispatch = useDispatch()
  const history = useHistory()

  const oldPasswordChangeHandler = (e) => {
    setOldPassword(e?.target?.value)
  }

  const passwordValidation = (value) => {
    if (value.length < 6) {
      setError({...error, password: {hasError: true, helperText: 'Пароль має містити мінімум 6 символів'}})
    } else {
      setError({...error, password: noError})
    }
  }

  const passwordChangeHandler = (e) => {
    setPassword(e?.target?.value)
    passwordValidation(e?.target?.value)
  }

  const rePasswordValidation = (value) => {
    if (value.length < 6) {
      setError({...error, rePassword: {hasError: true, helperText: 'Пароль має містити мінімум 6 символів'}})
    } else {
      setError({...error, rePassword: noError})
    }
  }

  const rePasswordChangeHandler = (e) => {
    setRePassword(e?.target?.value)
    rePasswordValidation(e?.target?.value)
  }

  const updatePasswordClickHandler = () => {
    if (password !== rePassword) {
      setMessage("Паролі не співпадають")
      setOpen(true)
      return
    }

    passwordValidation(password)
    rePasswordValidation(rePassword)
    if (error.password.hasError) return

    const data = {oldPassword, newPassword: password}
    dispatch(updatePasswordAction(data)).then((res) => {
      if (res.error) {
        setMessage(res.payload?.response?.data?.title || defaultErrorMessage)
        setOpen(true)
      } else {
        setMessage('Пароль змінено успішно')
        setOpen(true)
        history.push('/settings')
      }
    })
  }

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowRePassword = () => setShowRePassword(!showRePassword);

  return (
    <div style={STYLES.mainBlock}>
      <TextField
        id="old-password"
        label="Старий пароль"
        color={"secondary"}
        variant="outlined"
        error={error.oldPassword.hasError}
        helperText={error.oldPassword.helperText}
        fullWidth
        margin="normal"
        value={oldPassword}
        styles={STYLES.textField}
        onChange={oldPasswordChangeHandler}
        type={showOldPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleShowOldPassword}
                onMouseDown={handleShowOldPassword}
              >
                {showOldPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <TextField
        id="password"
        label="Новий пароль"
        color={"secondary"}
        variant="outlined"
        error={error.password.hasError}
        helperText={error.password.helperText}
        fullWidth
        margin="normal"
        value={password}
        styles={STYLES.textField}
        onChange={passwordChangeHandler}
        type={showPassword ? "text" : "password"}
        InputProps={{
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
        label="Повторіть новий пароль"
        color={"secondary"}
        variant="outlined"
        error={error.rePassword.hasError}
        helperText={error.rePassword.helperText}
        fullWidth
        margin="normal"
        value={rePassword}
        styles={STYLES.textField}
        onChange={rePasswordChangeHandler}
        type={showRePassword ? "text" : "password"}
        InputProps={{
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
        <Button variant="contained" color={"secondary"} style={STYLES.btn}  endIcon={<SaveIcon/>} onClick={updatePasswordClickHandler}>
          Змінити пароль
        </Button>
        <Button color={"error"} endIcon={<CancelIcon/>} onClick={() => history.push('/settings')}>Скасувати</Button>
      </div>
      <Toast message={message} open={open} setOpen={setOpen}/>
    </div>
  )
}
