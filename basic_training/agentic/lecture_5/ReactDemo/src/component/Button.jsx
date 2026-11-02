function Button({ label, type = "primary", onClick, disabled = false }) {
  const colors = {
    primary: "blue",
    danger: "red",
    action: "green",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "1px solid transparent",
        borderRadius: 5,
        padding: 5,
        marginLeft: 10,
        backgroundColor: colors[type] ?? colors.primary,
        color: "white",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  )
}

export default Button;