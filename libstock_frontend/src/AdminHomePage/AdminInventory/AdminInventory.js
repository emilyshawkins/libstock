import React from "react";
import "./AdminInventory.css";

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
          <div className="page-title category-title">
            {/* <h1>Book Viewer</h1> */}
          </div>

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
            {/* Create Button */}
            <button
              onClick={() => {
                alert("Create Button Clicked");
              }}
            >
              Create a Book
            </button>
            {/* Grid Shuffle */}
            <div className="grid-shuffle">
              <ul id="grid" className="row">
                {/* BOOK ITEM #1 */}
                <li
                  className="book-item small-12 medium-6 columns"
                  data-groups='["classic"]'
                  data-date-created="1937"
                  data-title="Of Mice and Men"
                  data-color="#fcc278"
                >
                  <div className="bk-img">
                    <div className="bk-wrapper">
                      <div className="bk-book bk-bookdefault">
                        <div className="bk-front">
                          <div
                            className="bk-cover"
                            style={{
                              backgroundImage:
                                "url('http://interactivejoe.com/book-viewer/assets/images/bk_1-small.jpg')",
                            }}
                          ></div>
                        </div>
                        <div className="bk-back"></div>
                        <div className="bk-left"></div>
                      </div>
                    </div>
                  </div>
                  <div className="item-details">
                    <h3 className="book-item_title">Of Mice and Men</h3>
                    <p className="author">by John Steinbeck &bull; 1937</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Etiam tellus nisi, eget pulvinar in, molestie et arcu.
                    </p>
                    <a href="#" className="button ">
                      Details
                    </a>
                  </div>
                </li>
                {/* BOOK ITEM #2 */}
                <li
                  className="book-item small-12 medium-6 columns"
                  data-groups='["classic"]'
                  data-date-created="1937"
                  data-title="Of Mice and Men"
                  data-color="#fcc278"
                >
                  <div className="bk-img">
                    <div className="bk-wrapper">
                      <div className="bk-book bk-bookdefault">
                        <div className="bk-front">
                          <div
                            className="bk-cover"
                            style={{
                              backgroundImage:
                                "url('http://interactivejoe.com/book-viewer/assets/images/bk_1-small.jpg')",
                            }}
                          ></div>
                        </div>
                        <div className="bk-back"></div>
                        <div className="bk-left"></div>
                      </div>
                    </div>
                  </div>
                  <div className="item-details">
                    <h3 className="book-item_title">Of Mice and Men</h3>
                    <p className="author">by John Steinbeck &bull; 1937</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Etiam tellus nisi, eget pulvinar in, molestie et arcu.
                    </p>
                    <a href="#" className="button ">
                      Details
                    </a>
                  </div>
                </li>
                {/* BOOK ITEM #3 */}
                <li
                  className="book-item small-12 medium-6 columns"
                  data-groups='["classic"]'
                  data-date-created="1937"
                  data-title="Of Mice and Men"
                  data-color="#fcc278"
                >
                  <div className="bk-img">
                    <div className="bk-wrapper">
                      <div className="bk-book bk-bookdefault">
                        <div className="bk-front">
                          <div
                            className="bk-cover"
                            style={{
                              backgroundImage:
                                "url('http://interactivejoe.com/book-viewer/assets/images/bk_1-small.jpg')",
                            }}
                          ></div>
                        </div>
                        <div className="bk-back"></div>
                        <div className="bk-left"></div>
                      </div>
                    </div>
                  </div>
                  <div className="item-details">
                    <h3 className="book-item_title">Of Mice and Men</h3>
                    <p className="author">by John Steinbeck &bull; 1937</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Etiam tellus nisi, eget pulvinar in, molestie et arcu.
                    </p>
                    <a href="#" className="button ">
                      Details
                    </a>
                  </div>
                </li>
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
