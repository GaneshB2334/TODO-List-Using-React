import React, { useEffect, useState, useRef } from 'react';
import unchecked from "./assets/unchecked.svg";
import checked from "./assets/checked.svg";
import EditIcon from "./assets/edit.svg"
import DeleteIcon from "./assets/del.svg"
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

      <div className='flex w-[70vw] m-auto flex-wrap font-bold max-h-[75vh] overflow-y-scroll max-md:w-[90vw] overflow-x-hidden overflow-ellipsis'>
        {todos.map((item) => {
          return <div key={item.id} className='w-[70vw] m-auto min-h-[75px] h-auto max-md:h-auto flex gap-3 my-3 items-center bg-purple-500 py-2 px-2 rounded-md max-md:text-lg max-md:w-[90vw]'>
            <img
              className='cursor-pointer'
              src={item.isChecked ? checked : unchecked}
              onClick={() => { handleToggleCheck(item.id) }}
              alt="" />

            <li
              ref={EditingId === item.id ? inputRef : null}
              className='w-[50vw] p-2 max-h-full max-md:w-[70vw] border-2 border-gray-400 rounded-md'
              contentEditable={item.isEditable}
              style={{ color: item.isChecked ? "gray" : "inherit", textDecoration: item.isChecked ? "line-through" : "" }}
              onBlur={() => { handleEdit(item.id) }}
            >{item.todo}
            </li>
            <div className='flex max-md:flex-wrap justify-evenly w-[15vw] max-md:w-[10vw]'>

              {window.innerWidth >= 850 ?
                (<button
                  className="m-2 bg-purple-400 px-5 py-2 rounded-md h-[40px]"
                  onClick={() => { handleEdit(item.id) }}>
                  Edit</button>)
                :
                (<button
                  className="m-2 bg-transparent  rounded-md h-[30px] flex items-center"
                  onClick={() => { handleEdit(item.id) }}>
                  <img src={EditIcon} alt="" /></button>
                )}


              {window.innerWidth >= 850 ?
                (<button
                  className="m-2 bg-purple-400 px-5 py-2 rounded-md h-[40px]"
                  onClick={() => { handleDelete(item.id) }}>
                  Delete</button>)
                :
                (<button
                  className="m-2 bg-transparent rounded-md h-[30px] flex items-center"
                  onClick={() => { handleDelete(item.id) }}>
                  <img src={DeleteIcon} alt="" /></button>
                )}
            </div>

          </div>
        })}
      </div>
    </div>
  </>
}
export default App;