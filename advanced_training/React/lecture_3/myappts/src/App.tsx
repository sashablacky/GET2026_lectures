import { Alert } from "./Alert";

export function App() {
  return (
    <Alert
      type="information"
      heading="Success"
      closable={true}
      onClose={() => console.log("parent prop method invoked")}
    >
      hello world
    </Alert>
  );
}
