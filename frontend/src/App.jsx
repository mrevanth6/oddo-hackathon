import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Layout />} />
        </Routes>
      
        
      </Router>

      <ToastContainer />
    </div>
  );
}

export default App;
