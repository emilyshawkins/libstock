import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./Navbar/Navbar"; // Import Navbar
import Sidebar from "./Navbar/Sidebar"; // Import Sidebar
import Topbar from "./Navbar/Topbar"; // Import Topbar
import AdminSidebar from "./Navbar/AdminSidebar"; // Import AdminSidebar
import SignInPage from "./SignInPage/SignInPage"; // Import SignInPage
import SignUpPage from "./SignUpPage/SignUpPage"; // Import SignUpPage
import UserHomePage from "./UserHomePage/UserHomePage"; // Import UserHomePage
import AdminHomePage from "./AdminHomePage/AdminHomePage"; // Import AdminHomePage
import AdminInventory from "./AdminInventory/AdminInventory"; // Import AdminInventory
import AddBook from "./AdminInventory/AddBook"; // Import AdminInventory
import AccountSettings from "./AccountSetting/AccountSettings"; // Import AccountSettings

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
  
  // Show AdminSidebar ONLY on "/admin/*" routes
  const isAdminSidebar = location.pathname.startsWith("/admin");

  // Show Sidebar on all pages except "/", "/signin", "/signup", and path start with "/admin" 
  const isTopbarVisible = !isNavbarVisible;

  // Show Sidebar on all pages except "/", "/signin", "/signup", and path start with "/admin" 
  const isSidebarVisible = !isNavbarVisible && !isAdminSidebar;

  return (
    <>
      {/* Display Navbar only on specific pages */}
      {isNavbarVisible && <Navbar />}

      {/* Display Sidebar and Topbar except on specific pages */}
      {isSidebarVisible && <Sidebar />}

      {/* Display Topbar except on specific pages */}
      {isTopbarVisible && <Topbar />}

      {/* Display Admin Sidebar for admin related pages */}
      {isAdminSidebar && <AdminSidebar />}

      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page */}
        <Route path="/signin" element={<SignInPage />} /> {/* Sign In page */}
        <Route path="/signup" element={<SignUpPage />} /> {/* Sign Up page */}
        <Route path="/user/home" element={<UserHomePage />} /> {/* User Home page */}
        <Route path="/admin/home" element={<AdminHomePage />} /> {/* Admin Home page */}
        <Route path="/admin/inventory" element={<AdminInventory />} /> {/* Admin Inventory */}
        <Route path="/admin/add-book" element={<AddBook />} /> {/* Admin Add Book */}
        <Route path="/user/settings" element={<AccountSettings />} /> {/* Account Settings */}
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
