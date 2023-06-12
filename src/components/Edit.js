import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import { NoItems } from './NoItems';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAuth } from '../store/auth/auth.selector';
import { updateUserConfiguration } from '../store/auth/auth.slice';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

const STYLES = {
  btn: {margin: '0 1px'},
  form: {display: 'flex', height: '45px', marginBottom: '7px'},
  textField: {  margin: '0 0 0 5px' },
  addBtn: { margin: '0 8px' },
  title: {fontWeight: 'bold', fontSize: '30px'}
}

export const Edit = () => {
  const [categoryName, setCategoryName] = useState(localStorage.getItem('activeCategory') || '')
  const [item, setItem] = useState('')
  const [itemToRename, setItemToRename] = useState(null)
  const [categoryToRename, setCategoryToRename] = useState(false)
  const [rename, setRename] = useState('')

  const activeCategory = localStorage.getItem('activeCategory') || ''
  const dispatch = useDispatch();

  const currentUser = useSelector(getAuth)
  const items = currentUser?.data?.configuration?.checkList?.[activeCategory]

  const handleRename = () => {
    dispatch(updateUserConfiguration({
      configuration: {
        ...currentUser?.data?.configuration,
        checkList: {
          ...currentUser?.data?.configuration?.checkList,
          [activeCategory]: undefined,
          [categoryName]: currentUser?.data?.configuration?.checkList?.[activeCategory] || [],
        }
      }
    }))
    setItem('')
    localStorage.setItem('activeCategory', categoryName)
    setCategoryToRename(false)
  }

  const handleRenameItem = () => {
    const data = currentUser?.data?.configuration?.checkList?.[activeCategory]?.map((item) => item === itemToRename ? rename : item)

    dispatch(updateUserConfiguration({
      configuration: {
        ...currentUser?.data?.configuration,
        checkList: {
          ...currentUser?.data?.configuration?.checkList,
          [activeCategory]: data || [],
        }
      }
    }))
    setRename('')
    setItemToRename('')
  }

  const handleDelete = (item) => {
    dispatch(updateUserConfiguration({
      configuration: {
        ...currentUser?.data?.configuration,
        checkList: {
          ...currentUser?.data?.configuration?.checkList,
          [activeCategory]: currentUser?.data?.configuration?.checkList?.[activeCategory]?.filter(name => name !== item)
        }
      }
    }))
  }

  const handleCreateItem = () => {
      dispatch(updateUserConfiguration({
        configuration: {
          ...currentUser?.data?.configuration,
          checkList: {
            ...currentUser?.data?.configuration?.checkList,
            [activeCategory]: [...currentUser?.data?.configuration?.checkList?.[activeCategory] || [], item]
          }
        }
      }))
      setItem('')
  }

  return (
    <>
      <div style={STYLES.form}>
        { categoryToRename ?
          <>
            <TextField
            id="catagory"
            label="Категорія"
            variant="outlined"
            color={"secondary"}
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
              endIcon={<DriveFileRenameOutlineOutlinedIcon />}
              onClick={handleRename}
            >
              Зберегти
            </Button>
          </>
          :
          <ListItem
            divider={true}
            key={item}
            secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="Edit"
                  style={STYLES.btn}
                  color={"secondary"}
                  title="Редагувати"
                  onClick={() => setCategoryToRename(true)}
                >
                  <EditIcon />
                </IconButton>
            }
          >
            <ListItemText primary={categoryName} className={"title"}/>
          </ListItem>
          }
      </div>

      <List style={{overflow: 'scroll', height: '375px'}}>
        {
          items?.length ? items.map((item) => {
            return (
              item === itemToRename ?
                <div style={STYLES.form} key={item}>
                  <TextField
                    id="rename"
                    label="Перейменувати"
                    variant="outlined"
                    value={rename}
                    color={"secondary"}
                    onChange={(e) => setRename(e.target.value)}
                    fullWidth
                    margin="normal"
                    style={STYLES.textField}
                  />
                  <Button
                    variant="contained"
                    color={"secondary"}
                    style={STYLES.addBtn}
                    endIcon={<DriveFileRenameOutlineOutlinedIcon />}
                    onClick={handleRenameItem}
                  >
                    Зберегти
                  </Button>
                </div> :
                <ListItem
                  key={item}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="Edit"
                        style={STYLES.btn}
                        title="Редагувати"
                        color={"secondary"}
                        onClick={() => {
                          setItemToRename(item)
                          setRename(item)
                        }}
                      >
                        <EditIcon />
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
          label="Name"
          color={"secondary"}
          variant="outlined"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          fullWidth
          margin="normal"
          style={STYLES.textField}
        />
        <Button
          variant="contained"
          style={STYLES.addBtn}
          color={"secondary"}
          endIcon={<AddCircleIcon />}
          onClick={handleCreateItem}
        >
          Створити запис
        </Button>
      </div>
    </>
  )
}
