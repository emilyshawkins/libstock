import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./Navbar/Navbar"; // Import Navbar
import Sidebar from "./Navbar/Sidebar"; // Import Sidebar
import Topbar from "./Navbar/Topbar"; // Import Sidebar
import SignInPage from "./SignInPage/SignInPage"; // Import SignInPage
import SignUpPage from "./SignUpPage/SignUpPage"; // Import SignUpPage
import UserHomePage from "./UserHomePage/UserHomePage"; // Import UserHomePage
import AdminHomePage from "./AdminHomePage/AdminHomePage"; // Import AdminHomePage
import AdminInventory from "./AdminHomePage/AdminInventory/AdminInventory"; // Import AdminInventory
import AccountSettings from "./AccountSetting/AccountSettings"; // Import UserSettings
import AddBook from "./AdminHomePage/AdminInventory/AddBook"; // Import AddBook

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation(); // Get the current route path

  // Show Navbar ONLY on "/", "/signin", and "/signup"
  const isNavbarVisible = ["/", "/signin", "/signup"].includes(location.pathname);

  // Show Topbar and Sidebar on ALL pages EXCEPT "/", "/signin", "/signup"
  const isTopandSidebarVisible = !isNavbarVisible;

  return (
    <>
      {isNavbarVisible && <Navbar />}
      {isTopandSidebarVisible && <Sidebar />}
      {isTopandSidebarVisible && <Topbar />}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page */}
        <Route path="/signin" element={<SignInPage />} /> {/* Sign In page */}
        <Route path="/signup" element={<SignUpPage />} /> {/* Sign Up page */}
        <Route path="/user/home" element={<UserHomePage />} />{" "} {/* User Home page */}
        <Route path="/admin/home" element={<AdminHomePage />} />{" "} {/* Admin Home page */}
        <Route path="/admin/inventory" element={<AdminInventory />} />{" "} {/* Admin Inventory */}
        <Route path="/admin/inventory/add-book" element={<AddBook />} />{" "} {/* Admin Add a Book */}
        <Route path="/user/settings" element={<AccountSettings />} />{" "} {/* Account Settings */}
        <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
      </Routes>
    </>
  );
}

function Home() {
  return <h1>Welcome to LibStock</h1>; // Placeholder home page
}

function NotFound() {
  return <h1>404 - Page Not Found</h1>; // Catch-all page
}

export default App;
