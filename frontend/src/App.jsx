import LoginPage from "./pages/LoginPage";
import "./App.css";
// Add Toastify Tag
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <div className="App">
      <LoginPage />
      <ToastContainer />
    </div>
  );
}

export default App;
