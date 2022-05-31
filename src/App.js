import React, {useState} from "react";
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

function App() {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('defaultState')));
  const [tab, setTab] = useState(window.localStorage.getItem('tab') || CHECK_LIST_TYPES.STYLE);

  function toggleTaskCompleted(id, e) {
    const updatedTasks = tasks.map(task => {
      if (id === task.id) {
        return {...task, completedId: (task.completedId + 1) % CHECK_STATE_ARR.length}
      }
      return task;
    });

    setTasks(updatedTasks);
    localStorage.setItem('defaultState', JSON.stringify(updatedTasks))

    if (e && e.target) {
      e.target.blur()
    }
  }

  const taskList = tasks
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
    localStorage.setItem('defaultState', JSON.stringify(CHECK_LIST))
    setTasks(CHECK_LIST)
  }

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
            { filterList }
          </div>
          <h2 id="list-heading" tabIndex="-1">
            {headingText}
          </h2>
          <ul
            role="list"
            className="todo-list stack-large stack-exception"
            aria-labelledby="list-heading"
          >
            { taskList }
          </ul>
          <Counter tasks={tasks} onClear={clearHandler}/>
          <ThemeToggle/>
        </div>
  );
}

export default App;
