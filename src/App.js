import "./App.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./Components/Home";
import About from "./Components/About";
import ResultPage from "./Components/ResultPage";
import MatchingPage from "./Components/MatchingPage";

function App() {
 

 
  return ( 
    <div className="App">
      {/* links system */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Results" element={<ResultPage />} />
          <Route path="/Matching" element={<MatchingPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
