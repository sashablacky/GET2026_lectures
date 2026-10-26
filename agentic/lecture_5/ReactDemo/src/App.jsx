import { useState } from 'react'
import './App.css'
import { nanoid } from 'nanoid'

function App() {
  const [todo, addTodo] = useState("");
  const [todoList, addTodoList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleTodoChange = (e) => {
    addTodo(e.target.value)
  }

  const handleButtonClick = (e) => {
    const currentTodoList = [...todoList]
    currentTodoList.push({
      id: nanoid(),
      title: todo.trim(),
      isCompleted: false
    });
    addTodoList(currentTodoList);
    addTodo("")
  }

  const handleEditClick = (todoItem) => {
    setEditingId(todoItem.id)
    addTodo(todoItem.title)
  }

  const handleSave = () => {
    const newList = todoList.map((todoItem) => {
      if (todoItem.id === editingId) {
        return { ...todoItem, title: todo.trim() }
      }
      return todoItem
    })
    addTodoList(newList)
    setEditingId(null)
    addTodo("")
  }

  const handleCancel = () => {
    setEditingId(null)
    addTodo("")
  }

  const markCompletedClick = (itemId) => {
    const newList = todoList.map((todoItem) => {
      if (todoItem.id === itemId) {
        return { ...todoItem, isCompleted: true }
      }
      return todoItem
    })
    addTodoList(newList)
  }

  const handleDelete = (itemId) => {
    addTodoList(todoList.filter((item) => item.id !== itemId))
    if (itemId === editingId) {                        // NEW
      handleCancel()
    }
  }

  const isEditing = editingId !== null

  return (
    <>
      <input type='text' value={todo} onChange={handleTodoChange} />

      {isEditing ? (
        <>
          <button disabled={todo.trim() === ""} onClick={handleSave} style={{ marginLeft: 10 }}>
            Save
          </button>
          <button onClick={handleCancel} style={{ marginLeft: 10 }}>
            Cancel
          </button>
        </>
      ) : (
        <button
          disabled={todo.trim() === ""}
          onClick={handleButtonClick}
          style={{ marginLeft: 10 }}
        >
          Add Todo
        </button>
      )}

      <br />
      <br />
      <table border={1}>
        <thead>
          <tr>
            <th>Sl no</th>
            <th>Todo Title</th>
            <th>Is Completed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {todoList.map((todoItem, index) => {
            return (
              <tr key={todoItem.id}>
                <td>{index + 1}</td>
                <td>{todoItem.title}</td>
                <td>{todoItem.isCompleted ? "Completed" : "Not completed"}</td>
                <td>
                  {!todoItem.isCompleted && (
                    <button onClick={() => markCompletedClick(todoItem.id)}>
                      Mark as completed
                    </button>
                  )}
                  <button onClick={() => handleEditClick(todoItem)}>Edit</button>
                  <button onClick={() => handleDelete(todoItem.id)}>Delete</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default App