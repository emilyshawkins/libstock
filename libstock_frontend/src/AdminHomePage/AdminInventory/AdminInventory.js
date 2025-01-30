import React from "react";
import "./AdminInventory.css";
import AddBook from "./AddBook";

const AdminInventory = () => {
  return (
    <div id="main-container" className="main-container nav-effect-1">
      {/* NAV MENU */}
      <nav className="nav-menu nav-effect-1" id="menu-1">
        <h2 className="">The Library</h2>
        <ul>
          <li>
            <a className="" href="#">
              Checkout
            </a>
          </li>
          <li>
            <a className="" href="#">
              Return
            </a>
          </li>
          <li>
            <a className="" href="#">
              About
            </a>
          </li>
          <li>
            <a className="" href="#">
              Contact
            </a>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT WRAPPER */}
      <div className="main clearfix">
        {/* HEADER */}
        <header id="header" className="page-header">
          <div className="page-header-container row">
            <div className="menu-search">
              {/* Main Navigation */}
              <div className="main-navigation">
                <a href="#">Menu</a>
              </div>
              {/* Search */}
              <div className="catalog-search">
                <input
                  className="shuffle-search input_field"
                  type="search"
                  autoComplete="off"
                  maxLength="128"
                  id="input-search"
                />
                <label className="input_label" htmlFor="input-search">
                  <span className="input_label-content">Search Library</span>
                  <span className="input_label-search"></span>
                </label>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTAINER */}
        <div className="page-container">
          <div className="page-title category-title"></div>

          {/* BOOK LIST SECTION */}
          <section id="book_list">
            {/* Filter + Sort Toolbar */}
            <div className="toolbar row">
              <div className="filter-options small-12 medium-9 columns">
                <a href="#" className="filter-item active" data-group="all">
                  All Categories
                </a>
                <a href="#" className="filter-item" data-group="fantasy">
                  Fantasy
                </a>
                <a href="#" className="filter-item" data-group="sci-fi">
                  Sci-Fi
                </a>
                <a href="#" className="filter-item" data-group="classic">
                  Classics
                </a>
                <a href="#" className="filter-item" data-group="fairy">
                  Fairy Tale
                </a>
                <a href="#" className="filter-item" data-group="young">
                  Young Adult
                </a>
              </div>
              {/* Sort Option */}
              <div className="small-12 medium-3 columns">
                <select className="sort-options">
                  <option value="" disabled defaultValue>
                    Sort by
                  </option>
                  <option value="">Featured</option>
                  <option value="title">Alphabetical</option>
                  <option value="date-created">Published</option>
                </select>
              </div>
            </div>
            {/* Add Book Button */}
            <AddBook />
            {/* Grid Shuffle */}
            <div className="grid-shuffle">
              <ul id="grid" className="row">
                {/* BOOK ITEMS */}
              </ul>
            </div>
          </section>
        </div>
      </div>
      {/* /main */}

      <div className="main-overlay">
        <div className="overlay-full"></div>
      </div>
    </div>
  );
};

export default AdminInventory;
