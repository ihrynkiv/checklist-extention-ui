/*global chrome*/
import React, {useEffect, useState} from "react";
import { GlobalHotKeys } from "react-hotkeys";

import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import {CHECK_LIST, CHECK_LIST_TYPES, CHECK_STATE_ARR} from "./constants";
import {Counter} from "./components/Counter";
import {ThemeToggle} from "./components/ThemeToggle";

const TABS_MAP = {
  Style: task => task.type === CHECK_LIST_TYPES.STYLE,
  Solution: task => task.type === CHECK_LIST_TYPES.SOLUTION,
  Tests: task => task.type === CHECK_LIST_TYPES.TESTS,
};

const TABS_NAMES = Object.keys(TABS_MAP);

const keyMap = {
  CLEAR_REVIEW: ["del", "backspace"],
  DELETE_REVIEW: ["shift+del", "shift+backspace"],
  RIGHT: ["right", "d", "l"],
  LEFT: ["left", "a", "h"],
  CHECK_ITEM: ["1", "2", "3", "4", "5"]
}

const increaseActiveId = () => {
  const activeId = +localStorage.getItem('activeId') || 0
  localStorage.setItem('activeId', (activeId + 1).toString())
}

const buildKey = () => {
  const activeId = +localStorage.getItem('activeId') || 0
  return `key${activeId + 1}`
}

const getPullRequestID = (tabUrl) => {
  if (!tabUrl) return null

  const {pathname} = new URL(tabUrl)
  const [,,repo,,prKey] = pathname.split('/')

  if (!repo || !prKey) return null
  return `${repo}-${prKey}`
}

const getReviewForCurrentWebSite = (tabUrl) => {
  const prId = getPullRequestID(tabUrl)
  if (!prId) return []
  const state = JSON.parse(localStorage.getItem('state')) || {}

  const { review } = Object.values(state).find(({id}) => id === prId) || {}
  const key = buildKey()

  if (review) {
    return review
  } else {
    localStorage.setItem('state', JSON.stringify({...state, [key]: {id: prId, review: CHECK_LIST}}))
    increaseActiveId()
    return CHECK_LIST
  }
}

const setReviewByURL = (tabUrl, review) => {
  const prId = getPullRequestID(tabUrl)
  if (!prId) return null

  const state = JSON.parse(localStorage.getItem('state')) || {}
  let [key] = Object.entries(state).find(([key, {id}]) => id === prId) || []

  if (key) {
    localStorage.setItem('state', JSON.stringify({...state, [key]: {id: prId, review}}))
  } else {
    localStorage.setItem('state', JSON.stringify({...state, [buildKey()]: {id: prId, review: review || CHECK_LIST}}))
    increaseActiveId()
  }
}

function App() {
  const [tabUrl, setTabUrl] = useState('')
  useEffect(() => {
    chrome.tabs.query({currentWindow: true, active: true}, async function (tabs) {
      setTabUrl(tabs[0].url)
    });
  }, [])

  const [review, setReview] = useState([]);

  useEffect(() => {
    setReview(getReviewForCurrentWebSite(tabUrl))
  }, [tabUrl, getReviewForCurrentWebSite])

  const [tab, setTab] = useState(window.localStorage.getItem('tab') || CHECK_LIST_TYPES.STYLE);

  function toggleTaskCompleted(id, e) {
    const updatedTasks = review.map(task => {
      if (id === task.id) {
        return {...task, completedId: (task.completedId + 1) % CHECK_STATE_ARR.length}
      }
      return task;
    });

    setReview(updatedTasks);
    setReviewByURL(tabUrl, updatedTasks)

    if (e && e.target) {
      e.target.blur()
    }
  }

  const taskList = review
  .filter(TABS_MAP[tab])
  .map(task => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completedId}
      key={`${task.id}`}
      toggleTaskCompleted={toggleTaskCompleted}
    />
  ));

  const filterList = TABS_NAMES.map(name => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === tab}
      setFilter={setTab}
    />
  ));

  const inProgressItems = taskList.filter(task => !task.props.completed)
  const itemsNoun = inProgressItems.length !== 1 ? 'items' : 'item';
  const headingText = `${inProgressItems.length} ${itemsNoun} remaining`;

  const clearHandler = () => {
    if (!getPullRequestID(tabUrl)) return
    setReviewByURL(tabUrl, CHECK_LIST)
    setReview(CHECK_LIST)
  }

  useEffect(() => {
    const activeId = +localStorage.getItem('activeId') || 0
    if (activeId >= 25) {
      localStorage.setItem('activeId', '1')
    }
  }, [])

  const handlers = {
    CLEAR_REVIEW: () => clearHandler(localStorage.getItem('activeReview') - 1),
    RIGHT: () => {
      const currentTab = localStorage.getItem('tab') || tab
      const activeTabIndex = TABS_NAMES.indexOf(currentTab)
      const newTab = TABS_NAMES[(activeTabIndex + 1) % TABS_NAMES.length]

      localStorage.setItem('tab', newTab)
      setTab(newTab)
    },
    LEFT: () => {
      const currentTab = localStorage.getItem('tab') || tab
      const activeTabIndex = TABS_NAMES.indexOf(currentTab)
      const newTab = TABS_NAMES[activeTabIndex - 1 < 0 ? TABS_NAMES.length - 1 : activeTabIndex - 1]

      localStorage.setItem('tab', newTab)
      setTab(newTab)
    },
    CHECK_ITEM: (e) => {
      const num = +e.code.match(/\d+/g)
      if (isNaN(num)) return null

      const checkbox = document.querySelectorAll('.todo')?.[num - 1]?.querySelector('input[type="checkbox"]')
      checkbox && checkbox.click()
    }
  };

  return (
        <div className="todoapp stack-large" key={window.location.href}>
          <GlobalHotKeys handlers={handlers} keyMap={keyMap}/>
          <Form/>
          <div className="filters btn-group stack-exception">
            {filterList}
          </div>
          <h2 id="list-heading" tabIndex="-1">
            {headingText}
          </h2>
          <ul
              role="list"
              className="todo-list stack-large stack-exception"
              aria-labelledby="list-heading"
          >
            {taskList}
          </ul>
          <Counter tasks={review} onClear={clearHandler}/>
          <ThemeToggle/>
        </div>
  );
}

export default App;
