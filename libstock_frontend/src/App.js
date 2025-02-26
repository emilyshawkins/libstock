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
import ForgotPass from "./SignInPage/ForgotPass"; //Import ForgotPass
import ResetPass from "./SignInPage/ResetPass"; //Import ResetPass
import SignUpPage from "./SignUpPage/SignUpPage"; // Import SignUpPage
import UserHomePage from "./UserHomePage/UserHomePage"; // Import UserHomePage
import AdminHomePage from "./AdminHomePage/AdminHomePage"; // Import AdminHomePage
import FavPage from "./FavPage/FavPage"; //Import Favourite Page
import APIAdd from "./AddBook/APIAdd"; // Import AddBook
import ManualAdd from "./AddBook/ManualAdd"; // Import AddBook
import AccountSettings from "./AccountSetting/AccountSettings"; // Import AccountSettings
import UserInventory from "./UserInventory/UserInventory"; // Import UserInventory
import BookDetails from "./BookDetails/BookDetails"; // Import BookDetails

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation(); // Get the current route path

  // Show Navbar ONLY on "/", "/signin", "/signup", and "/forgot-password"
  const isNavbarVisible = [
    "/",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ].includes(location.pathname);

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
        <Route path="/forgot-password" element={<ForgotPass />} />{" "}
        {/* Forgot Password Page*/}
        <Route path="/reset-password" element={<ResetPass />} />{" "}
        {/* Forgot Password Page*/}
        <Route path="/signup" element={<SignUpPage />} /> {/* Sign Up page */}
        <Route path="/user/home" element={<UserHomePage />} />{" "}
        {/* User Home page */}
        <Route path="/admin/home" element={<AdminHomePage />} />{" "}
        {/* Admin Home page */}
        <Route path="/user/favorite" element={<FavPage />} />
        <Route path="/user/settings" element={<AccountSettings />} />{" "}
        {/* Account Settings */}
        <Route path="/user/home" element={<UserHomePage />} />{" "}
        {/* User Home page */}
        <Route path="/admin/home" element={<AdminHomePage />} />{" "}
        {/* Admin Home page */}
        <Route path="/admin/home/book" element={<BookDetails />} />{" "}
        {/* Admin Book Details */}
        <Route path="/admin/add-book" element={<APIAdd />} />{" "}
        {/* Admin Add Book */}
        <Route path="/admin/manual-add" element={<ManualAdd />} />{" "}
        {/* Admin Add Book Manually */}
        <Route path="/user/settings" element={<AccountSettings />} />{" "}
        {/* Account Settings */}
        <Route path="/user/inventory" element={<UserInventory />} />{" "}
        {/* User Inventory */}
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
