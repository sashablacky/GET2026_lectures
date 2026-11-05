import { Alert } from './Alert';

export function App() {
  return (
    <Alert type="information" heading="Success" closable={true} onClose={(x) => console.log(x)}>
      hello world
    </Alert>
  );
}
