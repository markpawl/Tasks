import { useState } from 'react'

import './App.css'

function ToDoApp() {
  return (
    <div>
      <ToDoList />
    </div>
  )
}

function ToDoForm(props) {

  function onChange(e) {
    let objectToUpdate = { ...props.formItem, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value };
    props.setFormItem(objectToUpdate);
  }


  return (
    <form className={"boxed"}>
      Content:
      <input onChange={onChange} value={props.formItem.content} name="content" />
      <br />
      Completed:
      <input onChange={onChange} type="checkbox" name="completed" checked={props.formItem.completed} />
      <br />
      <button onClick={(e) => { e.preventDefault(); props.onSave(props.formItem); }}>Save</button>
    </form>
  )
}

function ToDoList() {

  const [todoitems, setTodoitems] = useState([
    { content: "Learn React", completed: false },
    { content: "Build a To-Do App", completed: false },
    { content: "Master Vite", completed: false }
  ]);

  const [formItem, setFormItem] = useState({ content: "", completed: false });

  const onDelete = (idx) => {
    let scratchpad = [...todoitems];
    scratchpad.splice(idx, 1);
    setTodoitems(scratchpad);
  };

  const onEdit = (idx) => {
    let itemToEdit = { "idx": idx, content: todoitems[idx].content, completed: todoitems[idx].completed }
    setFormItem(itemToEdit);
  };

  const onSave = (item) => {
    if (item.idx !== undefined) {
      setTodoitems(todoitems.map((i, index) => (index === item.idx ? { ...i, content: item.content, completed: item.completed } : i)));
    } else {
      setTodoitems([...todoitems, item]);
    }
    setFormItem({ content: "", completed: false });
  };

  return (
    <div className={'app'}>
      <h2>My To-Do List</h2>
      <ul className={'boxed'}>
        {todoitems.map((item, idx) => (
          <ToDoItem key={idx} item={item} idx={idx} onDelete={onDelete} onEdit={() => onEdit(idx)} />
        ))}
      </ul>
      <br/>
      <ToDoForm formItem={formItem} setFormItem={setFormItem} onSave={onSave} />
    </div>
  )
}

function ToDoItem(props) {
  return (
    <li className={props.item.completed ? "completed" : ""}>{props.item.content}
      &nbsp;
      <button onClick={() => props.onDelete(props.item)}>Delete</button>
      <button onClick={() => props.onEdit(props.idx)}>Edit</button>
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
