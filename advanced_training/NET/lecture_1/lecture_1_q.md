# C# and .NET — Lecture 1 Questions

## 1. How does a C# program get executed?

1. Write the source code in `.cs` files.
2. The C# compiler compiles the code into an assembly (`.exe` or `.dll`) containing Intermediate Language (IL) and metadata.
3. The .NET runtime loads the assembly.
4. The Just-In-Time (JIT) compiler converts IL into native machine code for the current processor.
5. The processor executes the machine code.

## 2. What are the CLR and JIT?

- **CLR (Common Language Runtime):** The .NET runtime that manages program execution. It provides services such as memory management and garbage collection, exception handling, and type safety.
- **JIT (Just-In-Time) compiler:** A component of the CLR that compiles IL into native machine code while the program runs. This lets the same IL run on different platforms that have a compatible .NET runtime.

## 3. What are the value limits and memory sizes of C# data types?

| Type | Size | Range |
|---|---:|---|
| `sbyte` | 1 byte | −128 to 127 |
| `byte` | 1 byte | 0 to 255 |
| `short` | 2 bytes | −32,768 to 32,767 |
| `ushort` | 2 bytes | 0 to 65,535 |
| `int` | 4 bytes | −2,147,483,648 to 2,147,483,647 |
| `uint` | 4 bytes | 0 to 4,294,967,295 |
| `long` | 8 bytes | −9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 |
| `ulong` | 8 bytes | 0 to 18,446,744,073,709,551,615 |
| `float` | 4 bytes | Approximately ±3.4 × 10³⁸ |
| `double` | 8 bytes | Approximately ±1.8 × 10³⁰⁸ |
| `decimal` | 16 bytes | Approximately ±7.9 × 10²⁸ |
| `char` | 2 bytes | 0 to 65,535 (a UTF-16 code unit) |
| `bool` | Typically 1 byte in memory | `true` or `false` |

## 4. What is the difference between `while`, `do while`, and `for` loops?

| Loop | How it works |
|---|---|
| `while` | Checks the condition before each iteration. The body may run zero times. |
| `do while` | Checks the condition after each iteration. The body runs at least once. |
| `for` | Combines initialization, condition, and update in one statement. It is often convenient when counting iterations. |
