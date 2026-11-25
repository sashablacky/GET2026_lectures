import { RouterProvider } from "react-router-dom";
import router from "./app/routes";
import ThemeProvider from "./shared/theme/ThemeProvider";
import ToastProvider from "./shared/components/feedback/ToastProvider";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ThemeProvider>
  );
}
export default App;
