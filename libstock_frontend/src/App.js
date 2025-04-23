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
import ChatBot from "./ChatBot/ChatBot"; // Import ChatBot
import AdminSidebar from "./Navbar/AdminSidebar"; // Import AdminSidebar
import SignInPage from "./SignInPage/SignInPage"; // Import SignInPage
import ForgotPass from "./SignInPage/ForgotPass"; //Import ForgotPass
import ResetPass from "./SignInPage/ResetPass"; //Import ResetPass
import SignUpPage from "./SignUpPage/SignUpPage"; // Import SignUpPage

import UserHomePage from "./UserHomePage/UserHomePage"; // Import UserHomePage
import AccountSettings from "./AccountSetting/AccountSettings"; // Import User AccountSettings
import UserInventory from "./UserInventory/UserInventory"; // Import UserInventory
import FavPage from "./FavPage/FavPage"; //Import Favourite Page
import FavPageShare from "./FavPage/FavPageShare";
import WishList from "./WishList/WishList"; //Import Wishlist Page
import WishListShare from "./WishList/WishListShare";
import UserBookDetails from "./BookDetails/UserBookDetails"; // Import BookDetails
import CollectionPage from "./Collection/CollectionPage"; // Import CollectionPage
import AdminHomePage from "./AdminHomePage/AdminHomePage"; // Import AdminHomePage
import APIAdd from "./AddBook/APIAdd"; // Import AddBook
import ManualAdd from "./AddBook/ManualAdd"; // Import AddBook
import BookDetails from "./BookDetails/BookDetails"; // Import BookDetails
import AdminAccountSettings from "./AccountSetting/AdminAccountSettings"; // Import User AccountSettings

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation(); // Get the current route path

  // Show Navbar on all pages EXCEPT "/user/*" and "/admin/*" routes
  const isNavbarVisible =
    !location.pathname.startsWith("/user") &&
    !location.pathname.startsWith("/admin");

  // Show AdminSidebar ONLY on "/admin/*" routes
  const isAdminSidebarVisible = location.pathname.startsWith("/admin");

  // Show Sidebar ONLY on "/user/*" routes
  const isSidebarVisible = location.pathname.startsWith("/user");

  // Show Topbar ONLY on "/user/*" and "/admin/*" routes
  const isTopbarVisible =
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {/* Display Navbar on all pages except user and admin pages */}
      {isNavbarVisible && <Navbar />}
      {/* Display Sidebar only on user pages */}
      {isSidebarVisible && <Sidebar />}
      {/* Display Topbar only on user and admin pages */}
      {isTopbarVisible && <Topbar />}
      {/* Display Admin Sidebar for admin related pages */}
      {isAdminSidebarVisible && <AdminSidebar />}
      {/* ChatBot component for all pages */}
      {<ChatBot />} {/* ChatBot */}
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
        <Route path="/user/favorite" element={<FavPage />} />{" "}
        <Route path="/favorite/share" element={<FavPageShare />} />{" "}
        <Route path="/user/wishlist" element={<WishList />} />{" "}
        <Route path="/wishlist/share" element={<WishListShare />} />{" "}
        <Route path="/user/home/book" element={<UserBookDetails />} />{" "}
        {/* User Book Details */}
        <Route path="/user/inventory" element={<UserInventory />} />{" "}
        {/* User Inventory */}
        <Route path="/user/settings" element={<AccountSettings />} />{" "}
        {/* Account Settings */}
        <Route path="/user/settings" element={<AccountSettings />} />{" "}
        {/* Account Settings */}
        <Route path="/user/home" element={<UserHomePage />} />{" "}
        {/* User Home page */}
        <Route path="/admin/collection" element={<CollectionPage />} />{" "}
        {/* User Collection */}
        <Route path="/admin/home" element={<AdminHomePage />} />{" "}
        {/* Admin Home page */}
        <Route path="/admin/home/book" element={<BookDetails />} />{" "}
        {/* Admin Book Details */}
        <Route path="/admin/add-book" element={<APIAdd />} />{" "}
        {/* Admin Add Book */}
        <Route path="/admin/manual-add" element={<ManualAdd />} />{" "}
        {/* Admin Add Book Manually */}
        <Route path="/admin/settings" element={<AdminAccountSettings />} />{" "}
        {/* Account Settings */}
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
