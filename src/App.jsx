import { useState, useEffect, useRef } from 'react'

import './App.css'

function ToDoApp() {
  return (
    <div>
      <ToDoList />
    </div>
  )
}


function ToDoForm(props) {
  const inputRef = useRef(null);

  function onChange(e) {
    let objectToUpdate = { ...props.formItem, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value };
    props.setFormItem(objectToUpdate);
  }

  const isIdle = props.formItem === null;

  useEffect(() => {
    if (!isIdle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, 0);
    }
  }, [isIdle, props.formItem?.idx]); // Re-run when idle state changes or switching items

  return (
    <form className={"boxed"}>
      Content:
      <input
        ref={inputRef}
        onChange={onChange}
        value={isIdle ? "" : props.formItem.content}
        name="content"
        disabled={isIdle}
        style={{ backgroundColor: isIdle ? 'lightgrey' : 'white' }}
      />
      <br />
      Completed:
      <input
        onChange={onChange}
        type="checkbox"
        name="completed"
        checked={isIdle ? false : props.formItem.completed}
        disabled={isIdle}
      />
      <br />
      <div className="form-buttons">
        <button
          onClick={(e) => { e.preventDefault(); props.onSave(props.formItem); }}
          disabled={isIdle}
        >
          Save
        </button>
        {!isIdle && (
          props.formItem.idx !== undefined ?
            <button onClick={(e) => { e.preventDefault(); props.onDelete(props.formItem.idx); }}>Delete</button>
            :
            <button onClick={(e) => { e.preventDefault(); props.onReset(); }}>Reset</button>
        )}
      </div>
    </form>
  )
}

function ToDoList() {

  const [todoitems, setTodoitems] = useState([
    { content: "Learn React", completed: false },
    { content: "Build a To-Do App", completed: false },
    { content: "Master Vite", completed: false }
  ]);

  const [formItem, setFormItem] = useState(null);

  const onDelete = (idx) => {
    if (formItem && formItem.idx === idx) {
      setFormItem(null);
    }
    let scratchpad = [...todoitems];
    scratchpad.splice(idx, 1);
    setTodoitems(scratchpad);
    if (formItem && formItem.idx === idx) {
      setFormItem(null); // Ensure form clears if we delete the selected item
    } else if (formItem && formItem.idx > idx) {
      // Adjust selected index if an item above it was deleted
      setFormItem({ ...formItem, idx: formItem.idx - 1 });
    }
  };

  const onEdit = (idx) => {
    if (formItem && formItem.idx === idx) {
      setFormItem(null);
    } else {
      let itemToEdit = { "idx": idx, content: todoitems[idx].content, completed: todoitems[idx].completed }
      setFormItem(itemToEdit);
    }
  };

  const onSave = (item) => {
    if (item.idx !== undefined) {
      setTodoitems(todoitems.map((i, index) => (index === item.idx ? { ...i, content: item.content, completed: item.completed } : i)));
    } else {
      setTodoitems([...todoitems, item]);
    }
    setFormItem(null);
  };

  const onAdd = () => {
    setFormItem({ content: "", completed: false });
  };

  const onReset = () => {
    setFormItem({ content: "", completed: false });
  }

  // Visual Sort: Uncompleted first, then Completed. Preserve original index for logic.
  const sortedItems = todoitems
    .map((item, idx) => ({ ...item, originalIdx: idx }))
    .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  return (
    <div className={'app'}>
      <h2>My To-Do List</h2>
      <ul className={'boxed'}>
        {sortedItems.map((item) => (
          <ToDoItem
            key={item.originalIdx}
            item={item}
            idx={item.originalIdx}
            onEdit={() => onEdit(item.originalIdx)}
            isSelected={formItem && formItem.idx === item.originalIdx}
          />
        ))}
        <li className="add-item">
          <button onClick={onAdd} className="add-button" style={{ width: '100%' }}>Add</button>
        </li>
      </ul>
      <br />
      <ToDoForm formItem={formItem} setFormItem={setFormItem} onSave={onSave} onDelete={onDelete} onReset={onReset} />
    </div>
  )
}


function ToDoItem(props) {
  return (
    <li
      className={props.item.completed ? "completed" : ""}
      onClick={() => props.onEdit(props.idx)}
      style={{ cursor: 'pointer', fontWeight: props.isSelected ? 'bold' : 'normal' }}
    >
      {props.item.content}
    </li>
  )
}


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ToDoApp />
    </>
  )
}

export default App
