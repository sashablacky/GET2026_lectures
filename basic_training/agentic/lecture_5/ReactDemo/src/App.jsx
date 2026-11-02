import { useState } from 'react'
import './App.css'
import { nanoid } from 'nanoid'
import Button from './component/Button'
import InputField from './component/InputField'
import TodoList from './component/TodoList'

function App() {
  const [todo, addTodo] = useState("");
  const [todoList, addTodoList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleTodoChange = (e) => {
    addTodo(e.target.value)
  }

  const handleButtonClick = () => {
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
    if (itemId === editingId) {
      handleCancel()
    }
  }

  const isEditing = editingId !== null

  const incompleteTodos = todoList.filter((item) => !item.isCompleted)
  const completedTodos = todoList.filter((item) => item.isCompleted)

  return (
    <>
      <InputField value={todo} onChange={handleTodoChange} />

      {isEditing ? (
        <>
          <Button label="Save" type="action" disabled={todo.trim() === ""} onClick={handleSave} />
          <Button label="Cancel" type="danger" onClick={handleCancel} />
        </>
      ) : (
        <Button
          label="Add Todo"
          type="primary"
          disabled={todo.trim() === ""}
          onClick={handleButtonClick}
        />
      )}

      <br />
      <br />
      <h3>Incomplete</h3>
        <TodoList
          todoList={incompleteTodos}
          onMarkCompleted={markCompletedClick}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />

        <h3>Completed</h3>
        <TodoList
          todoList={completedTodos}
          onMarkCompleted={markCompletedClick}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />

    </>
  )
}

export default App