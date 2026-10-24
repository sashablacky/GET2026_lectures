import { useState } from 'react'
import './App.css'
import { nanoid } from 'nanoid'

function App() {
  const [todo, addTodo] = useState("");
  const [todoList, addTodoList] = useState([]);

  const handleTodoChange = (e) => {
    addTodo(e.target.value)
  }

  const handleButtonClick = (e) => {
    const currentTodoList = [...todoList]
    currentTodoList.push({
      id: nanoid(),
      title: todo,
      isCompleted: false
    });
    addTodoList(currentTodoList);
    addTodo("")
  }

  console.log(todo)
  console.table(todoList)

  const markCompletedClick = (itemId) =>{
    const newList = todoList.map((todoItem) => {
      if(todoItem.id == itemId){
        return { ...todoItem, isCompleted: true }
      }
      return todoItem
    })
    addTodoList(newList)
  }

  const handleDelete = (itemId) => {
    addTodoList(todoList.filter((item) => item.id != itemId))
  }

  return (
    <>
      <input type='text' value={todo} onChange={handleTodoChange} />
      <button disabled={todo == ""} onClick={handleButtonClick} style={{ marginLeft: 10 }} >Add Todo</button>
      <br />
      <br />
      <table border={1}>
        <tr>
          <th>Sl no</th>
          <th>Todo Title</th>
          <th>Is Completed</th>
          <th>Action</th>
        </tr>
        {todoList.map((todoItem, index) => {
          return <tr>
            <td>{index + 1}</td>
            <td>{todoItem.title}</td>
            <td>{todoItem.isCompleted ? "Completed": "Not completed"}</td>
            <td>
              {!todoItem.isCompleted &&
              <button onClick={() => {
                markCompletedClick(todoItem.id)
              }}>Mrak as completed</button>}
            </td>
          </tr>
        })}

      </table>
    </>
  )
}

export default App