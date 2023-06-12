import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserConfiguration, whoAmIAction } from '../store/auth/auth.slice';
import { getAuth } from '../store/auth/auth.selector';
import { useHistory } from 'react-router-dom';
import { Button, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material';
import { NoItems } from './NoItems';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Toast } from './Toast';
import DeleteIcon from '@mui/icons-material/Delete';

const STYLES = {
  btn: {margin: '0 1px'},
  form: {display: 'flex', height: '45px', marginBottom: '7px'},
  textField: { margin: '0 0 0 5px' },
  addBtn: { margin: '0 8px' },
}

export const Configuration = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    dispatch(whoAmIAction()).then((action) => {
      if(action?.payload?.response?.status === 401 || action.error) {
        history.push('/login')
      }
    })
  }, [dispatch, history])

  const currentUser = useSelector(getAuth)
  const categories = Object.keys(currentUser?.data?.configuration?.checkList || {})

  const handleCreate = () => {
    if(currentUser?.data?.configuration?.checkList?.[categoryName] === undefined) {
      dispatch(updateUserConfiguration({
        configuration: {
        ...currentUser?.data?.configuration,
          checkList: {
            ...currentUser?.data?.configuration?.checkList,
            [categoryName]: []
          }
        }
      }))

      setCategoryName('')
    } else {
      setOpen(true)
    }
  }

  const handleEdit = (item) => {
    history.push('/edit')
    localStorage.setItem('activeCategory', item)
  }

  const handleDelete = (item) => {
    dispatch(updateUserConfiguration({
      configuration: {
        ...currentUser?.data?.configuration,
        checkList: {
          ...currentUser?.data?.configuration?.checkList,
          [item]: undefined
        }
      }
    }))
  }

  return (
    <div id="configuration">
    <List style={{overflow: 'scroll', height: '100%'}}>
      {
        categories.length ? categories.map((item) => {
          return (
            <ListItem
              key={item}
              secondaryAction={
              <>
                  <IconButton
                    edge="end"
                    aria-label="Edit"
                    color={"secondary"}
                    style={STYLES.btn}
                    title="Редагувати"
                    onClick={() => handleEdit(item)}
                  >
                    <EditIcon/>
                  </IconButton>

                <IconButton
                  edge="end"
                  aria-label="Delete"
                  color={"secondary"}
                  style={STYLES.btn}
                  title="Видалити"
                  onClick={() => handleDelete(item)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
              }
            >
              <ListItemText primary={item} />
            </ListItem>
          )
        }) : <NoItems/>
      }
    </List>

      <div style={STYLES.form}>
        <TextField
          id="name"
          label="Назва"
          color={"secondary"}
          variant="outlined"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          fullWidth
          margin="normal"
          style={STYLES.textField}
        />
        <Button
          variant="contained"
          color={"secondary"}
          style={STYLES.addBtn}
          endIcon={<AddCircleIcon />}
          onClick={handleCreate}
        >
          Створити категорію
        </Button>
      </div>
      <Toast message={'Назва категорії уже зайнята'} open={open} setOpen={setOpen}/>
  </div>
  )
}
