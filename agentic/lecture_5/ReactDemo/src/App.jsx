import { useState } from 'react'
import './App.css'


function App() {
  const [todo, addTodo] = useState("");
  const [todoList, addTodoList] = useState([]);

  const handleTodoChange = (e) => {
    console.log(e)
    addTodo(e.target.value)
  }

  const handleButtonClick = (e) => {
    console.log(e)
    console.log(todo)

    const currentTodoList = [...todoList]
    currentTodoList.push(todo)
    addTodoList(currentTodoList)
  }

  return (
    <>
      <input type = 'text' value={todo} onChange = {handleTodoChange} />
      <button onClick={handleButtonClick} style={{marginLeft: 10}}>Add Todo</button>
      <div>Current Value of TextBox: {todo}</div>
      <div>Current todoList: {JSON.stringify(todoList)}</div>
      
      <table>
        <tr>
          <th>SL no</th>
          <th>Todo Title</th>
          <th>Is Completed</th>
          <th>Action</th>
        </tr>
        {todoList.map((todoItem, index) =>{
          return <tr>
            <td>{index+1}</td>
            <td>{todoItem}</td>
            <td></td>
            <td></td>
          </tr>
        })}
        
      </table>
    </>
  )
}

export default App
