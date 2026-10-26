import Button from './Button'

function TodoList({ todoList, onMarkCompleted, onEdit, onDelete }) {
  return (
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
        {todoList.map((todoItem, index) => (
          <tr key={todoItem.id}>
            <td>{index + 1}</td>
            <td>{todoItem.title}</td>
            <td>{todoItem.isCompleted ? "Completed" : "Not completed"}</td>
            <td>
              {!todoItem.isCompleted && (
                <Button
                  label="Mark as completed"
                  type="action"
                  onClick={() => onMarkCompleted(todoItem.id)}
                />
              )}
              <Button label="Edit" type="primary" onClick={() => onEdit(todoItem)} />
              <Button label="Delete" type="danger" onClick={() => onDelete(todoItem.id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TodoList
