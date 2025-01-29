import React from "react";
import "./AdminInventory.css"; // Optional: your stylesheet

const AdminInventory = () => {
  return (
    <div className="book-store">
      {/* HEADER */}
      <div className="header">
        <div className="browse">
          <div className="browse-category">
            Browse Category
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-down"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search Book" />
          </div>
        </div>
        <div className="header-title">
          read<span>books</span>
        </div>
        <div className="profile">
          <div className="user-profile">
            <img
              src="https://randomuser.me/api/portraits/women/63.jpg"
              alt=""
              className="user-img"
            />
          </div>
          <div className="profile-menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
            Menu
          </div>
        </div>
      </div>

      {/* BOOK SLIDER SECTION */}
      <div className="book-slide">
        {/* Flickity Container */}
        <div
          className="book js-flickity"
          data-flickity-options='{ "wrapAround": true }'
        >
          {/* BOOK 1 */}
          <div className="book-cell">
            <div className="book-img">
              <img
                src="https://images-na.ssl-images-amazon.com/images/I/81WcnNQ-TBL.jpg"
                alt=""
                className="book-photo"
              />
            </div>
            <div className="book-content">
              <div className="book-title">BIG MAGIC</div>
              <div className="book-author">by Elizabeth Gilbert</div>
              <div className="rate">
                <fieldset className="rating">
                  <input type="checkbox" id="star5" name="rating" value="5" />
                  <label className="full" htmlFor="star5"></label>

                  <input type="checkbox" id="star4" name="rating" value="4" />
                  <label className="full" htmlFor="star4"></label>

                  <input type="checkbox" id="star3" name="rating" value="3" />
                  <label className="full" htmlFor="star3"></label>

                  <input type="checkbox" id="star2" name="rating" value="2" />
                  <label className="full" htmlFor="star2"></label>

                  <input type="checkbox" id="star1" name="rating" value="1" />
                  <label className="full" htmlFor="star1"></label>
                </fieldset>
                <span className="book-voters">1.987 voters</span>
              </div>
              <div className="book-sum">
                Readers of all ages and walks of life have drawn inspiration and
                empowerment from Elizabeth Gilbert’s books for years.
              </div>
              <div className="book-see">See The Book</div>
            </div>
          </div>

          {/* BOOK 2 */}
          <div className="book-cell">
            <div className="book-img">
              <img
                src="https://i.pinimg.com/originals/a8/b9/ff/a8b9ff74ed0f3efd97e09a7a0447f892.jpg"
                alt=""
                className="book-photo"
              />
            </div>
            <div className="book-content">
              <div className="book-title">Ten Thousand Skies Above You</div>
              <div className="book-author">by Claudia Gray</div>
              <div className="rate">
                <fieldset className="rating blue">
                  <input type="checkbox" id="star6" name="rating" value="5" />
                  <label className="full1" htmlFor="star6"></label>

                  <input type="checkbox" id="star7" name="rating" value="4" />
                  <label className="full1" htmlFor="star7"></label>

                  <input type="checkbox" id="star8" name="rating" value="3" />
                  <label className="full1" htmlFor="star8"></label>

                  <input type="checkbox" id="star9" name="rating" value="2" />
                  <label className="full1" htmlFor="star9"></label>

                  <input type="checkbox" id="star10" name="rating" value="1" />
                  <label className="full1" htmlFor="star10"></label>
                </fieldset>
                <span className="book-voters">1.987 voters</span>
              </div>
              <div className="book-sum">
                The hunt for each splinter of Paul's soul sends Marguerite
                racing through a war-torn San Francisco.
              </div>
              <div className="book-see book-blue">See The Book</div>
            </div>
          </div>

          {/* BOOK 3 */}
          <div className="book-cell">
            <div className="book-img">
              <img
                src="https://www.abebooks.com/blog/wp-content/uploads/2016/08/10.jpg"
                alt=""
                className="book-photo"
              />
            </div>
            <div className="book-content">
              <div className="book-title">A Tale For The Time Being</div>
              <div className="book-author">by Ruth Ozeki</div>
              <div className="rate">
                <fieldset className="rating purple">
                  <input type="checkbox" id="star11" name="rating" value="5" />
                  <label className="full" htmlFor="star11"></label>

                  <input type="checkbox" id="star12" name="rating" value="4" />
                  <label className="full" htmlFor="star12"></label>

                  <input type="checkbox" id="star13" name="rating" value="3" />
                  <label className="full" htmlFor="star13"></label>

                  <input type="checkbox" id="star14" name="rating" value="2" />
                  <label className="full" htmlFor="star14"></label>

                  <input type="checkbox" id="star15" name="rating" value="1" />
                  <label className="full" htmlFor="star15"></label>
                </fieldset>
                <span className="book-voters">1.987 voters</span>
              </div>
              <div className="book-sum">
                In Tokyo, sixteen-year-old Nao has decided there’s only one
                escape from her aching loneliness and her classmates’ bullying.
              </div>
              <div className="book-see book-pink">See The Book</div>
            </div>
          </div>

          {/* BOOK 4 */}
          <div className="book-cell">
            <div className="book-img">
              <img
                src="https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg"
                alt=""
                className="book-photo"
              />
            </div>
            <div className="book-content">
              <div className="book-title">The Great Gatsby</div>
              <div className="book-author">by F.Scott Fitzgerald</div>
              <div className="rate">
                <fieldset className="rating yellow">
                  <input type="checkbox" id="star16" name="rating" value="5" />
                  <label className="full" htmlFor="star16"></label>

                  <input type="checkbox" id="star17" name="rating" value="4" />
                  <label className="full" htmlFor="star17"></label>

                  <input type="checkbox" id="star18" name="rating" value="3" />
                  <label className="full" htmlFor="star18"></label>

                  <input type="checkbox" id="star19" name="rating" value="2" />
                  <label className="full" htmlFor="star19"></label>

                  <input type="checkbox" id="star20" name="rating" value="1" />
                  <label className="full" htmlFor="star20"></label>
                </fieldset>
                <span className="book-voters">1.987 voters</span>
              </div>
              <div className="book-sum">
                The Great Gatsby, F. Scott Fitzgerald’s third book, stands as
                the supreme achievement of his career.
              </div>
              <div className="book-see book-yellow">See The Book</div>
            </div>
          </div>

          {/* BOOK 5 */}
          <div className="book-cell">
            <div className="book-img">
              <img
                src="https://images-na.ssl-images-amazon.com/images/I/81UWB7oUZ0L.jpg"
                alt=""
                className="book-photo"
              />
            </div>
            <div className="book-content">
              <div className="book-title">After You</div>
              <div className="book-author">by Jojo Moyes</div>
              <div className="rate">
                <fieldset className="rating dark-purp">
                  <input type="checkbox" id="star21" name="rating" value="5" />
                  <label className="full" htmlFor="star21"></label>

                  <input type="checkbox" id="star22" name="rating" value="4" />
                  <label className="full" htmlFor="star22"></label>

                  <input type="checkbox" id="star23" name="rating" value="3" />
                  <label className="full" htmlFor="star23"></label>

                  <input type="checkbox" id="star24" name="rating" value="2" />
                  <label className="full" htmlFor="star24"></label>

                  <input type="checkbox" id="star25" name="rating" value="1" />
                  <label className="full" htmlFor="star25"></label>
                </fieldset>
                <span className="book-voters">1.987 voters</span>
              </div>
              <div className="book-sum">
                Louisa Clark is no longer just an ordinary girl living an
                ordinary life. After the transformative six months spent.
              </div>
              <div className="book-see book-purple">See The Book</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN WRAPPER */}
      <div className="main-wrapper">
        <div className="books-of">
          <div className="week">
            <div className="author-title">Author of the week</div>
            <div className="author">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80"
                alt=""
                className="author-img"
              />
              <div className="author-name">Sebastian Jeremy</div>
            </div>
            <div className="author">
              <img
                src="https://images.unsplash.com/photo-1586297098710-0382a496c814?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
                alt=""
                className="author-img"
              />
              <div className="author-name">Jonathan Doe</div>
            </div>
            <div className="author">
              <img
                src="https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                alt=""
                className="author-img"
              />
              <div className="author-name">Angeline Summer</div>
            </div>
            <div className="author">
              <img
                src="https://pbs.twimg.com/profile_images/737221709267374081/sdwta9Oh.jpg"
                alt=""
                className="author-img"
              />
              <div className="author-name">Noah Jones</div>
            </div>
            <div className="author">
              <img
                src="https://pbs.twimg.com/profile_images/2452384114/noplz47r59v1uxvyg8ku.png"
                alt=""
                className="author-img"
              />
              <div className="author-name">Tommy Adam</div>
            </div>
            <div className="author">
              <img
                src="https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                alt=""
                className="author-img"
              />
              <div className="author-name">Ian Cassandra</div>
            </div>
          </div>

          <div className="week year">
            <div className="author-title">Books of the year</div>
            <div className="year-book">
              <img
                src="https://images-na.ssl-images-amazon.com/images/I/A1kNdYXw0GL.jpg"
                alt=""
                className="year-book-img"
              />
              <div className="year-book-content">
                <div className="year-book-name">Disappearing Earth</div>
                <div className="year-book-author">by Julia Phillips</div>
              </div>
            </div>
            <div className="year-book">
              <img
                src="https://images-na.ssl-images-amazon.com/images/I/81eI0ExR+VL.jpg"
                alt=""
                className="year-book-img"
              />
              <div className="year-book-content">
                <div className="year-book-name">Lost Children Archive</div>
                <div className="year-book-author">by Valeria Luiselli</div>
              </div>
            </div>
            <div className="year-book">
              <img
                src="https://images-na.ssl-images-amazon.com/images/I/81OF9eJDA4L.jpg"
                alt=""
                className="year-book-img"
              />
              <div className="year-book-content">
                <div className="year-book-name">Phantoms: A Thriller</div>
                <div className="year-book-author">by Dean Koontz</div>
              </div>
            </div>
            <div className="year-book">
              <img
                src="https://m.media-amazon.com/images/I/515FWPyZ-5L.jpg"
                alt=""
                className="year-book-img"
              />
              <div className="year-book-content">
                <div className="year-book-name">Midnight in Chernobyl</div>
                <div className="year-book-author">by Adam Higginbotham</div>
              </div>
            </div>
            <div className="year-book">
              <img
                src="https://images-na.ssl-images-amazon.com/images/I/91dBtgERNUL.jpg"
                alt=""
                className="year-book-img"
              />
              <div className="year-book-content">
                <div className="year-book-name">10 Minutes 38 Seconds</div>
                <div className="year-book-author">by Elif Shafak</div>
              </div>
            </div>
          </div>

          <div className="overlay"></div>
        </div>

        {/* POPULAR BOOKS */}
        <div className="popular-books">
          <div className="main-menu">
            <div className="genre">Popular by Genre</div>
            <div className="book-types">
              <a href="#" className="book-type active">
                All Genres
              </a>
              <a href="#" className="book-type">
                Business
              </a>
              <a href="#" className="book-type">
                Science
              </a>
              <a href="#" className="book-type">
                Fiction
              </a>
              <a href="#" className="book-type">
                Philosophy
              </a>
              <a href="#" className="book-type">
                Biography
              </a>
            </div>
          </div>

          <div className="book-cards">
            {/* BOOK CARD 1 */}
            <div className="book-card">
              <div className="content-wrapper">
                <img
                  src="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F6%2F2019%2F07%2Fchances-are-1-2000.jpg&q=85"
                  alt=""
                  className="book-card-img"
                />
                <div className="card-content">
                  <div className="book-name">Changes Are</div>
                  <div className="book-by">by Richard Russo</div>
                  <div className="rate">
                    <fieldset className="rating book-rate">
                      <input
                        type="checkbox"
                        id="star-c1"
                        name="rating"
                        value="5"
                      />
                      <label className="full" htmlFor="star-c1"></label>

                      <input
                        type="checkbox"
                        id="star-c2"
                        name="rating"
                        value="4"
                      />
                      <label className="full" htmlFor="star-c2"></label>

                      <input
                        type="checkbox"
                        id="star-c3"
                        name="rating"
                        value="3"
                      />
                      <label className="full" htmlFor="star-c3"></label>

                      <input
                        type="checkbox"
                        id="star-c4"
                        name="rating"
                        value="2"
                      />
                      <label className="full" htmlFor="star-c4"></label>

                      <input
                        type="checkbox"
                        id="star-c5"
                        name="rating"
                        value="1"
                      />
                      <label className="full" htmlFor="star-c5"></label>
                    </fieldset>
                    <span className="book-voters card-vote">1.987 voters</span>
                  </div>
                  <div className="book-sum card-sum">
                    Readers of all ages and walks of life have drawn inspiration
                    and empowerment from Elizabeth Gilbert’s books for years.
                  </div>
                </div>
              </div>
              <div className="likes">
                <div className="like-profile">
                  <img
                    src="https://randomuser.me/api/portraits/women/63.jpg"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-profile">
                  <img
                    src="https://pbs.twimg.com/profile_images/2452384114/noplz47r59v1uxvyg8ku.png"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-profile">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-name">
                  <span>Samantha William</span> and
                  <span> 2 other friends</span> like this
                </div>
              </div>
            </div>

            {/* BOOK CARD 2 */}
            <div className="book-card">
              <div className="content-wrapper">
                <img
                  src="https://images-na.ssl-images-amazon.com/images/I/7167iiDUeAL.jpg"
                  alt=""
                  className="book-card-img"
                />
                <div className="card-content">
                  <div className="book-name">Dominicana</div>
                  <div className="book-by">by Angie Cruz</div>
                  <div className="rate">
                    <fieldset className="rating book-rate">
                      <input
                        type="checkbox"
                        id="star-c6"
                        name="rating"
                        value="5"
                      />
                      <label className="full" htmlFor="star-c6"></label>

                      <input
                        type="checkbox"
                        id="star-c7"
                        name="rating"
                        value="4"
                      />
                      <label className="full" htmlFor="star-c7"></label>

                      <input
                        type="checkbox"
                        id="star-c8"
                        name="rating"
                        value="3"
                      />
                      <label className="full" htmlFor="star-c8"></label>

                      <input
                        type="checkbox"
                        id="star-c9"
                        name="rating"
                        value="2"
                      />
                      <label className="full" htmlFor="star-c9"></label>

                      <input
                        type="checkbox"
                        id="star-c10"
                        name="rating"
                        value="1"
                      />
                      <label className="full" htmlFor="star-c10"></label>
                    </fieldset>
                    <span className="book-voters card-vote">1.987 voters</span>
                  </div>
                  <div className="book-sum card-sum">
                    Readers of all ages and walks of life have drawn inspiration
                    and empowerment from Elizabeth Gilbert’s books for years.
                  </div>
                </div>
              </div>
              <div className="likes">
                <div className="like-profile">
                  <img
                    src="https://randomuser.me/api/portraits/women/63.jpg"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-name">
                  <span>Kimberly Jones</span> like this
                </div>
              </div>
            </div>

            {/* BOOK CARD 3 */}
            <div className="book-card">
              <div className="content-wrapper">
                <img
                  src="https://assets.fontsinuse.com/static/use-media-items/95/94294/full-2000x3056/5d56c6b1/cg%201.jpeg?resolution=0"
                  alt=""
                  className="book-card-img"
                />
                <div className="card-content">
                  <div className="book-name">The Travellers</div>
                  <div className="book-by">by Regina Porter</div>
                  <div className="rate">
                    <fieldset className="rating book-rate">
                      <input
                        type="checkbox"
                        id="star-c11"
                        name="rating"
                        value="5"
                      />
                      <label className="full" htmlFor="star-c11"></label>

                      <input
                        type="checkbox"
                        id="star-c12"
                        name="rating"
                        value="4"
                      />
                      <label className="full" htmlFor="star-c12"></label>

                      <input
                        type="checkbox"
                        id="star-c13"
                        name="rating"
                        value="3"
                      />
                      <label className="full" htmlFor="star-c13"></label>

                      <input
                        type="checkbox"
                        id="star-c14"
                        name="rating"
                        value="2"
                      />
                      <label className="full" htmlFor="star-c14"></label>

                      <input
                        type="checkbox"
                        id="star-c15"
                        name="rating"
                        value="1"
                      />
                      <label className="full" htmlFor="star-c15"></label>
                    </fieldset>
                    <span className="book-voters card-vote">1.987 voters</span>
                  </div>
                  <div className="book-sum card-sum">
                    Readers of all ages and walks of life have drawn inspiration
                    and empowerment from Elizabeth Gilbert’s books for years.
                  </div>
                </div>
              </div>
              <div className="likes">
                <div className="like-profile">
                  <img
                    src="https://randomuser.me/api/portraits/women/63.jpg"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-profile">
                  <img
                    src="https://pbs.twimg.com/profile_images/2452384114/noplz47r59v1uxvyg8ku.png"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-name">
                  <span>Adam</span> and<span> Kimberly</span> like this
                </div>
              </div>
            </div>

            {/* BOOK CARD 4 */}
            <div className="book-card">
              <div className="content-wrapper">
                <img
                  src="https://images-na.ssl-images-amazon.com/images/I/91M4E+SURUL.jpg"
                  alt=""
                  className="book-card-img"
                />
                <div className="card-content">
                  <div className="book-name">Afternoon Of A Faun</div>
                  <div className="book-by">by James Lasdun</div>
                  <div className="rate">
                    <fieldset className="rating book-rate">
                      <input
                        type="checkbox"
                        id="star-c16"
                        name="rating"
                        value="5"
                      />
                      <label className="full" htmlFor="star-c16"></label>

                      <input
                        type="checkbox"
                        id="star-c17"
                        name="rating"
                        value="4"
                      />
                      <label className="full" htmlFor="star-c17"></label>

                      <input
                        type="checkbox"
                        id="star-c18"
                        name="rating"
                        value="3"
                      />
                      <label className="full" htmlFor="star-c18"></label>

                      <input
                        type="checkbox"
                        id="star-c19"
                        name="rating"
                        value="2"
                      />
                      <label className="full" htmlFor="star-c19"></label>

                      <input
                        type="checkbox"
                        id="star-c20"
                        name="rating"
                        value="1"
                      />
                      <label className="full" htmlFor="star-c20"></label>
                    </fieldset>
                    <span className="book-voters card-vote">1.987 voters</span>
                  </div>
                  <div className="book-sum card-sum">
                    Readers of all ages and walks of life have drawn inspiration
                    and empowerment from Elizabeth Gilbert’s books for years.
                  </div>
                </div>
              </div>
              <div className="likes">
                <div className="like-profile">
                  <img
                    src="https://randomuser.me/api/portraits/women/63.jpg"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-profile">
                  <img
                    src="https://pbs.twimg.com/profile_images/2452384114/noplz47r59v1uxvyg8ku.png"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-profile">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-name">
                  <span>Samantha William</span> and
                  <span> 2 other friends</span> like this
                </div>
              </div>
            </div>

            {/* BOOK CARD 5 */}
            <div className="book-card">
              <div className="content-wrapper">
                <img
                  src="https://images-na.ssl-images-amazon.com/images/I/61OTY2-4anL.jpg"
                  alt=""
                  className="book-card-img"
                />
                <div className="card-content">
                  <div className="book-name">Flash Count Diary</div>
                  <div className="book-by">by Darcey Steinke</div>
                  <div className="rate">
                    <fieldset className="rating book-rate">
                      <input
                        type="checkbox"
                        id="star-c21"
                        name="rating"
                        value="5"
                      />
                      <label className="full" htmlFor="star-c21"></label>

                      <input
                        type="checkbox"
                        id="star-c22"
                        name="rating"
                        value="4"
                      />
                      <label className="full" htmlFor="star-c22"></label>

                      <input
                        type="checkbox"
                        id="star-c23"
                        name="rating"
                        value="3"
                      />
                      <label className="full" htmlFor="star-c23"></label>

                      <input
                        type="checkbox"
                        id="star-c24"
                        name="rating"
                        value="2"
                      />
                      <label className="full" htmlFor="star-c24"></label>

                      <input
                        type="checkbox"
                        id="star-c25"
                        name="rating"
                        value="1"
                      />
                      <label className="full" htmlFor="star-c25"></label>
                    </fieldset>
                    <span className="book-voters card-vote">1.987 voters</span>
                  </div>
                  <div className="book-sum card-sum">
                    Readers of all ages and walks of life have drawn inspiration
                    and empowerment from Elizabeth Gilbert’s books for years.
                  </div>
                </div>
              </div>
              <div className="likes">
                <div className="like-profile">
                  <img
                    src="https://randomuser.me/api/portraits/women/63.jpg"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-profile">
                  <img
                    src="https://pbs.twimg.com/profile_images/2452384114/noplz47r59v1uxvyg8ku.png"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-profile">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-name">
                  <span>Angelina Stone</span> and
                  <span> 2 other friends</span> like this
                </div>
              </div>
            </div>

            {/* BOOK CARD 6 */}
            <div className="book-card">
              <div className="content-wrapper">
                <img
                  src="https://images-na.ssl-images-amazon.com/images/I/61Vc+xM23GL.jpg"
                  alt=""
                  className="book-card-img"
                />
                <div className="card-content">
                  <div className="book-name">Picnic Comma Lightning</div>
                  <div className="book-by">by Lucy Parker</div>
                  <div className="rate">
                    <fieldset className="rating book-rate">
                      <input
                        type="checkbox"
                        id="star-c26"
                        name="rating"
                        value="5"
                      />
                      <label className="full" htmlFor="star-c26"></label>

                      <input
                        type="checkbox"
                        id="star-c27"
                        name="rating"
                        value="4"
                      />
                      <label className="full" htmlFor="star-c27"></label>

                      <input
                        type="checkbox"
                        id="star-c28"
                        name="rating"
                        value="3"
                      />
                      <label className="full" htmlFor="star-c28"></label>

                      <input
                        type="checkbox"
                        id="star-c29"
                        name="rating"
                        value="2"
                      />
                      <label className="full" htmlFor="star-c29"></label>

                      <input
                        type="checkbox"
                        id="star-c30"
                        name="rating"
                        value="1"
                      />
                      <label className="full" htmlFor="star-c30"></label>
                    </fieldset>
                    <span className="book-voters card-vote">1.987 voters</span>
                  </div>
                  <div className="book-sum card-sum">
                    Readers of all ages and walks of life have drawn inspiration
                    and empowerment from Elizabeth Gilbert’s books for years.
                  </div>
                </div>
              </div>
              <div className="likes">
                <div className="like-profile">
                  <img
                    src="https://pbs.twimg.com/profile_images/2452384114/noplz47r59v1uxvyg8ku.png"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-profile">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-name">
                  <span>George</span> and<span> Mike</span> like this
                </div>
              </div>
            </div>

            {/* BOOK CARD 7 */}
            <div className="book-card">
              <div className="content-wrapper">
                <img
                  src="https://prodimage.images-bn.com/pimages/9780525655633_p0_v5_s1200x630.jpg"
                  alt=""
                  className="book-card-img"
                />
                <div className="card-content">
                  <div className="book-name">Very Nica</div>
                  <div className="book-by">by Lucy Parker</div>
                  <div className="rate">
                    <fieldset className="rating book-rate">
                      <input
                        type="checkbox"
                        id="star-c31"
                        name="rating"
                        value="5"
                      />
                      <label className="full" htmlFor="star-c31"></label>

                      <input
                        type="checkbox"
                        id="star-c32"
                        name="rating"
                        value="4"
                      />
                      <label className="full" htmlFor="star-c32"></label>

                      <input
                        type="checkbox"
                        id="star-c33"
                        name="rating"
                        value="3"
                      />
                      <label className="full" htmlFor="star-c33"></label>

                      <input
                        type="checkbox"
                        id="star-c34"
                        name="rating"
                        value="2"
                      />
                      <label className="full" htmlFor="star-c34"></label>

                      <input
                        type="checkbox"
                        id="star-c35"
                        name="rating"
                        value="1"
                      />
                      <label className="full" htmlFor="star-c35"></label>
                    </fieldset>
                    <span className="book-voters card-vote">1.987 voters</span>
                  </div>
                  <div className="book-sum card-sum">
                    Readers of all ages and walks of life have drawn inspiration
                    and empowerment from Elizabeth Gilbert’s books for years.
                  </div>
                </div>
              </div>
              <div className="likes">
                <div className="like-profile">
                  <img
                    src="https://randomuser.me/api/portraits/women/63.jpg"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-profile">
                  <img
                    src="https://pbs.twimg.com/profile_images/2452384114/noplz47r59v1uxvyg8ku.png"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-profile">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-name">
                  <span>Samantha William</span> and
                  <span> 2 other friends</span> like this
                </div>
              </div>
            </div>

            {/* BOOK CARD 8 */}
            <div className="book-card">
              <div className="content-wrapper">
                <img
                  src="https://images-na.ssl-images-amazon.com/images/I/71PL7BiZ5NL.jpg"
                  alt=""
                  className="book-card-img"
                />
                <div className="card-content">
                  <div className="book-name">Stay And Fight</div>
                  <div className="book-by">by Lucy Parker</div>
                  <div className="rate">
                    <fieldset className="rating book-rate">
                      <input
                        type="checkbox"
                        id="star-c36"
                        name="rating"
                        value="5"
                      />
                      <label className="full" htmlFor="star-c36"></label>

                      <input
                        type="checkbox"
                        id="star-c37"
                        name="rating"
                        value="4"
                      />
                      <label className="full" htmlFor="star-c37"></label>

                      <input
                        type="checkbox"
                        id="star-c38"
                        name="rating"
                        value="3"
                      />
                      <label className="full" htmlFor="star-c38"></label>

                      <input
                        type="checkbox"
                        id="star-c39"
                        name="rating"
                        value="2"
                      />
                      <label className="full" htmlFor="star-c39"></label>

                      <input
                        type="checkbox"
                        id="star-c40"
                        name="rating"
                        value="1"
                      />
                      <label className="full" htmlFor="star-c40"></label>
                    </fieldset>
                    <span className="book-voters card-vote">1.987 voters</span>
                  </div>
                  <div className="book-sum card-sum">
                    Readers of all ages and walks of life have drawn inspiration
                    and empowerment from Elizabeth Gilbert’s books for years.
                  </div>
                </div>
              </div>
              <div className="likes">
                <div className="like-profile">
                  <img
                    src="https://randomuser.me/api/portraits/women/63.jpg"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-profile">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80"
                    alt=""
                    className="like-img"
                  />
                </div>
                <div className="like-name">
                  <span>Samantha William</span> and<span> Jonathan</span> like
                  this
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
