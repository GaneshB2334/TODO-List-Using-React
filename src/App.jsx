import React, { useEffect, useState, useRef } from 'react';
import unchecked from "./assets/unchecked.svg";
import checked from "./assets/checked.svg";
import './App.css';

function App() {

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [ischeck, setIscheck] = useState(false)
  const [EditingId, setEditingId] = useState(null)
  const inputRef = useRef(null)
  useEffect(() => {
    if (EditingId !== null && inputRef.current) {
      inputRef.current.focus()
    }
  }, [EditingId])

  const SaveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  const handleAdd = (e) => {
    if (todo) {
      const newTodo = {
        id: Date.now(),
        todo: todo,
        isChecked: false,
        isEditable: false
      }
      setTodos([...todos, newTodo])
      setTodo("")
    }
    SaveToLS()
  }

  const handlekeypress = (e) => {
    if (e.key === "Enter") {
      handleAdd()
    }
  }
  const handleToggleCheck = (id) => {
    setTodos(todos.map(todo => {
      if (todo.id == id) {
        return { ...todo, isChecked: !todo.isChecked };
      }
      return todo;
    }))
    SaveToLS()
  }

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    SaveToLS()
  }

  const handleEdit = (id) => {
    setTodos(todos.map(todo => {
      if (todo.id == id) {
        setEditingId(EditingId ? null : id)
        return { ...todo, isEditable: !todo.isEditable };
      }
      return todo;
    }))
    SaveToLS()
  }

  useEffect(() => {
    let tostring = localStorage.getItem("todos")
    if (tostring) {
      let todos = JSON.parse(tostring)
      setTodos(todos)
    }
  }, [])

  return <>
    <div className='main h-[100vh]'>
      <div className='w-[70vw] m-auto text-xl '>
        <label className='text-2xl font-bold' htmlFor="inp">To-Do : </label>
        <input className='w-[70vw] p-2 bg-purple-200' value={todo} onKeyDown={handlekeypress} onChange={(e) => { setTodo(e.target.value) }} type="text" id='inp' autoFocus />
        <button disabled={todo.length == 0} className="m-2 bg-purple-400 px-5 py-2 rounded-md disabled:bg-purple-200" onClick={handleAdd}>Add</button>
      </div>

      <div className='flex items-center w-[70vw] m-auto flex-wrap font-bold h-[75vh] overflow-y-scroll'>
        {todos.map((item) => {
          return <div key={item.id} className='w-[70vw] m-auto flex gap-3 my-3 items-center bg-purple-500 py-2 px-2 rounded-md'>
            <img
              className='cursor-pointer'
              src={item.isChecked ? checked : unchecked}
              onClick={() => { handleToggleCheck(item.id) }}
              alt="" />

            <li
              ref={EditingId === item.id ? inputRef : null}
              className='w-[50vw]'
              contentEditable={item.isEditable}
              style={{ color: item.isChecked ? "gray" : "inherit", textDecoration: item.isChecked ? "line-through" : "" }}
              onBlur={() => { handleEdit(item.id) }}
            >{item.todo}
            </li>

            <button
              className="m-2 bg-purple-400 px-5 py-2 rounded-md h-[40px]"
              onClick={() => { handleEdit(item.id) }}>
              Edit</button>

            <button
              className="m-2 bg-purple-400 px-5 py-2 rounded-md h-[40px]"
              onClick={() => { handleDelete(item.id) }}>
              Delete</button>

          </div>
        })}
      </div>
    </div>
  </>
}
export default App;