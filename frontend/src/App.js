import { Outlet, Link } from "react-router-dom";
import TopNavbar from "./containers/TopNavbar";




export default function App() {
  return (
    <div>
      {/* <TopNavbar /> */}

      <Outlet />
    </div>
  );
}