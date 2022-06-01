import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import ThemeContextWrapper from "./components/ThemeContextWrapper";

import './styles/index.scss';
import './styles/checkbox.scss'
import './styles/buttons.scss'
import './styles/todo.scss'
import './styles/theme-toggle.scss'
import './styles/dark.scss';

if (!localStorage.getItem('state')) {
    localStorage.setItem('state', JSON.stringify({}))
}

ReactDOM.render(
    <ThemeContextWrapper>
      <React.StrictMode>
          <App/>
      </React.StrictMode>
    </ThemeContextWrapper>,
  document.getElementById('root')
);
