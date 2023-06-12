/*global chrome*/
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GlobalHotKeys } from 'react-hotkeys';

import Form from './components/Form';
import FilterButton from './components/FilterButton';
import Todo from './components/Todo';
import { CHECK_STATE_ARR } from './constants';
import { Counter } from './components/Counter';
import { ThemeToggle } from './components/ThemeToggle';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import { Login } from './components/Login';
import { Registration } from './components/Registration';
import { NoopComponent } from './components/Noop';
import { Navigation } from './components/Navigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material';
import { themes } from './contexts/ThemeContext';
import { Settings } from './components/Settings';
import { UpdateUserInfo } from './components/UpdateUserInfo';
import { Configuration } from './components/Configuration';
import { Edit } from './components/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { whoAmIAction } from './store/auth/auth.slice';
import { getAuth } from './store/auth/auth.selector';
import { createReview, fetchReviews, updateReview } from './store/reviews/reviews.slice';
import { selectReviews } from './store/reviews/review.selector';
import { ReviewsList } from './components/ReviewsList';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const STYLES = {
  DARK_THEME: {
    backgroundColor: '#1e1e1e',
    color: '#eeeeee'
  }
}

const keyMap = {
  CLEAR_REVIEW: ["del", "backspace"],
  DELETE_REVIEW: ["shift+del", "shift+backspace"],
  RIGHT: ["right", "d", "l"],
  LEFT: ["left", "a", "h"],
  CHECK_ITEM: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
}

const getPullRequestID = (tabUrl) => {
  if (!tabUrl) return null

  const url = new URL(tabUrl)
  const [,account,repo,pull,prKey] = url?.pathname.split('/')

  if (!repo || !prKey) return null
  return `${url.origin}/${account}/${repo}/${pull}/${prKey}`
}

const mapConfigurationToReview = (configuration) => {
  return Object.entries(configuration).flatMap(([type, items]) => {
    return items?.flatMap((name) => ({ id: name, name, type, completedId: 0 }))
  })
}

function App() {
  const [tab, setTab] = useState( '');
  const [categories, setCategories] = useState([]);
  const [tabUrl, setTabUrl] = useState('')
  const [review, setReview] = useState([]);
  const [checkList, setCheckList] = useState(null);

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!tab && categories.length) {
      setTab(categories?.[0])
    }
  }, [categories, tab]);

  useEffect(() => {
    dispatch(fetchReviews()).then((action) => {
      if(action?.payload?.response?.status === 401 || action.error) {
        history && history.push('/login')
      }
    })
    dispatch(whoAmIAction()).then((action) => {
      if(action?.payload?.response?.status === 401 || action.error) {
        history && history.push('/login')
      }
    })
  }, [dispatch, history])

  const currentUser = useSelector(getAuth)
  const reviews = useSelector(selectReviews)

  useEffect(() => {
    const prId = getPullRequestID(tabUrl)
    const currentReview = reviews.find((review) => {
      return review.prId === prId
    })

    if (!currentReview && prId && checkList !== null && Object.keys(checkList).length) {
      dispatch(createReview({ prId, configuration: mapConfigurationToReview(checkList), userId: currentUser?.data?.id }))
        .then((res) => {
          if (res?.payload?.response?.status === 403) {
            dispatch(updateReview({ prId, configuration: mapConfigurationToReview(checkList), userId: currentUser?.data?.id }))
          }
        })
    } else {
      setReview(currentReview?.configuration || [])
    }

  }, [checkList, currentUser, dispatch, reviews, tabUrl])

  useEffect(() => {
    if (checkList === null && Object.values(currentUser?.data || {})?.length) {
      setCheckList(currentUser?.data?.configuration?.checkList || {})
      setCategories(Object.keys(currentUser?.data?.configuration?.checkList || {}) || [])
    }
  }, [checkList, currentUser])

  const setReviewByUrl = useCallback((tabUrl, configuration) => {
    const prId = getPullRequestID(tabUrl)
    if (!prId) return null

    dispatch(updateReview({prId, configuration }))
  }, [dispatch])


  const App = () => {
    useEffect(() => {
      if(!tabUrl) {
        chrome.tabs.query({currentWindow: true, active: true}, async function (tabs) {
          const url = new URL(tabs[0].url)
          if (url?.origin.includes("github") || url?.origin.includes("gitlab")) {
            setTabUrl(tabs[0].url)
          }
        });
      }
    }, [])

    const toggleTaskCompleted = useCallback((id, e) => {
      const updatedTasks = review.map(task => {
        if (id === task.id) {
          return {...task, completedId: (task.completedId + 1) % CHECK_STATE_ARR.length}
        }
        return task;
      });

      setReview(updatedTasks);
      setReviewByUrl(tabUrl, updatedTasks)

      if (e && e.target) {
        e.target.blur()
      }
    }, [])

    const taskList = useMemo(() => {
      return review?.filter?.((item) => item?.type === tab)
        .map(task => (
          <Todo
            id={task.id}
            name={task.name}
            completed={task.completedId}
            key={`${task.id}`}
            toggleTaskCompleted={toggleTaskCompleted}
          />
        ));
    }, [toggleTaskCompleted])


    const filterList = useMemo(() => {
      return categories?.map(name => (
        <FilterButton
          key={name}
          name={name}
          isPressed={name === tab}
          setFilter={setTab}
        />
      ));
    }, [])

    const inProgressItems = taskList?.filter(task => !task.props.completed) || []
    const headingText = `Залишилось пунктів: ${inProgressItems?.length}`;

    const clearHandler = () => {
      if (!getPullRequestID(tabUrl)) return
      setReviewByUrl(tabUrl, mapConfigurationToReview(checkList || {}))
    }

    const handlers = {
      CLEAR_REVIEW: clearHandler,
      RIGHT: () => {
        const activeTabIndex = categories.indexOf(tab)
        const newTab = categories[(activeTabIndex + 1) % categories.length]

        setTab(newTab)
      },
      LEFT: () => {
        const activeTabIndex = categories.indexOf(tab)
        const newTab = categories[activeTabIndex - 1 < 0 ? categories.length - 1 : activeTabIndex - 1]

        setTab(newTab)
      },
      CHECK_ITEM: (e) => {
        const num = +e.code.match(/\d+/g)
        if (isNaN(num)) return null

        const checkbox = document.querySelectorAll('.todo')?.[num - 1]?.querySelector('input[type="checkbox"]')
        checkbox && checkbox.click()
      }
    };

    //

    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'dark'
    const styles = isDarkMode ? STYLES.DARK_THEME : {}

    return (
      <div style={styles} className="todoapp stack-large" key={window.location.href}>
        <GlobalHotKeys handlers={handlers} keyMap={keyMap}/>
        <Form/>
        <div className="filters btn-group stack-exception">
          {filterList}
        </div>
        <h2 id="list-heading" tabIndex="-1">
          {headingText}
        </h2>
        <ul
          className="todo-list stack-large stack-exception"
          aria-labelledby="list-heading"
        >
          {taskList}
        </ul>
        <Counter tasks={review} onClear={clearHandler}/>
      </div>
    )
  }

  return (
    <div id="content">
      <BrowserRouter>
        <ThemeToggle/>
        <Switch>
          <Route exact path="/" component={App}/>
          <Route exact path="/review" component={App}/>
          <Route exact path="/index.html" component={App}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/registration" component={Registration}/>
          <Route exact path="/settings" component={Settings}/>
          <Route exact path="/edit" component={Edit}/>
          <Route exact path="/list" component={ReviewsList}/>
          <Route exact path="/configuration" component={Configuration}/>
          <Route exact path="/update-user-info" component={UpdateUserInfo}/>
        </Switch>

        <Switch>
          <Route exact path="/login" component={NoopComponent}/>
          <Route exact path="/registration" component={NoopComponent}/>
          <Route path="/" component={Navigation}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState(window.localStorage.getItem('theme') || themes.light);
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === themes.light ? themes.dark : themes.light));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <App/>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
