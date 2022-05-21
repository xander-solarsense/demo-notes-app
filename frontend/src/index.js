import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./containers/home";
import Login from "./containers/login";
import Signup from "./containers/signup";
import TopNavbar from "./containers/TopNavbar";
import NotFound from "./containers/NotFound";


const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <div>
  <BrowserRouter>
  <TopNavbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="*" element={<NotFound />}/>
      
    
    </Routes>
  </BrowserRouter>
  </div>
);