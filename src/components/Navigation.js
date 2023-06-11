import {BottomNavigation, BottomNavigationAction, useTheme} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import React, {useEffect, useState} from 'react'
import {useHistory} from "react-router-dom";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SourceIcon from '@mui/icons-material/Source';

const TAB_ID_BY_PATH = {
  review: 0,
  list: 1,
  configuration: 2,
  settings: 3,
  'index.html': 4,
}

export const Navigation = () => {
  const path = window.location.pathname.replace('/', '')

  const [value, setValue] = useState(TAB_ID_BY_PATH[path] || 0)

  const history = useHistory()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const navigationHandle = (url) => history.push(url)

  useEffect(() => {
    const tabId = TAB_ID_BY_PATH[path]
    if (tabId !== undefined) {
      setValue(tabId)
    }
  }, [path])

  return (
      <BottomNavigation
        showLabels
        value={value}
        style={{backgroundColor: isDarkMode ? '#1c1b1b' : '#e0e0e0'}}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Чекліст" icon={<FactCheckIcon />} onClick={() => navigationHandle('/review')}/>
        <BottomNavigationAction label="Список" icon={<SourceIcon />} onClick={() => navigationHandle('/list')}/>
        <BottomNavigationAction label="Конфігурація" icon={<MenuBookIcon />} onClick={() => navigationHandle('/configuration')}/>
        <BottomNavigationAction label="Налаштування" icon={<SettingsIcon />} onClick={() => navigationHandle('/settings')}/>
      </BottomNavigation>
  );
}
