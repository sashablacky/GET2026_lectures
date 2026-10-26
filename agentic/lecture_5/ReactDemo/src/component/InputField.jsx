function InputField({ value, onChange, placeholder = "Enter a todo" }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        border: "1px solid blue",
        borderRadius: 5,
        padding: 5,
      }}
    />
  )
}

export default InputField