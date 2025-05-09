/*src/AddBook/ManualAdd.js*/

import React, { useEffect, useState } from "react";
import "./ManualAdd.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import defaultBookCover from "../Image/book.png"; // Import default book cover

function AddBook() {
  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    summary: "",
    publicationDate: "",
    price: "",
    purchasable: false,
    count: "",
  });
  const [authors, setAuthors] = useState([{ firstName: "", lastName: "" }]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [useDefaultCover, setUseDefaultCover] = useState(true);
  const [previewImageUrl, setPreviewImageUrl] = useState(defaultBookCover);
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get("http://localhost:8080/genre/get_all");
      setGenres(response.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAuthorChange = (index, field, value) => {
    setAuthors((prev) =>
      prev.map((author, i) =>
        i === index ? { ...author, [field]: value } : author
      )
    );
  };

  const addAuthor = () => {
    setAuthors((prev) => [...prev, { firstName: "", lastName: "" }]);
  };

  const removeAuthor = (index) => {
    if (authors.length > 1) {
      setAuthors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleGenreChange = (e) => {
    const genreId = e.target.value;
    if (!genreId) return;

    const genre = genres.find((g) => g.id === genreId);
    if (genre && !selectedGenres.some((g) => g.id === genreId)) {
      setSelectedGenres((prev) => [...prev, genre]);
    }
  };

  const removeGenre = (genreId) => {
    setSelectedGenres((prev) => prev.filter((g) => g.id !== genreId));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setUseDefaultCover(false);
      setPreviewImageUrl(URL.createObjectURL(file));
    }
  };

  const handleCustomFieldChange = (index, field, value) => {
    setCustomFields((prev) =>
      prev.map((fieldData, i) =>
        i === index ? { ...fieldData, [field]: value } : fieldData
      )
    );
  };

  const getOrCreateAuthor = async (firstName, lastName) => {
    try {
      const response = await axios.get("http://localhost:8080/author/get_all");
      const existingAuthor = response.data.find(
        (author) =>
          author.firstName.toLowerCase() === firstName.toLowerCase() &&
          author.lastName.toLowerCase() === lastName.toLowerCase()
      );

      if (existingAuthor) return existingAuthor.id;

      const newAuthorResponse = await axios.post(
        "http://localhost:8080/author/create",
        { firstName, lastName },
        { headers: { "Content-Type": "application/json" } }
      );

      return newAuthorResponse.data.id;
    } catch (error) {
      console.error("Error checking/creating author:", error);
      return null;
    }
  };

  const uploadCoverImage = async (bookId) => {
    try {
      const formData = new FormData();
      if (useDefaultCover) {
        const response = await fetch(defaultBookCover);
        const blob = await response.blob();
        formData.append(
          "cover",
          new File([blob], "default-cover.png", { type: "image/png" })
        );
      } else if (coverImage) {
        formData.append("cover", coverImage);
      }

      await axios.post(
        `http://localhost:8080/book/set_cover?id=${bookId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } catch (error) {
      console.error("Error uploading cover image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !formData.isbn ||
      !formData.title ||
      !formData.summary ||
      !formData.publicationDate ||
      !formData.price ||
      formData.count === "" ||
      selectedGenres.length === 0
    ) {
      setErrorMessage("All fields are required, including at least one genre.");
      setLoading(false);
      return;
    }

    try {
      const authorIds = await Promise.all(
        authors
          .filter((author) => author.firstName && author.lastName)
          .map((author) => getOrCreateAuthor(author.firstName, author.lastName))
      );

      const bookData = {
        ...formData,
        addedData: customFields.reduce((acc, field) => {
          if (field.key && field.value) acc[field.key] = field.value;
          return acc;
        }, {}),
      };

      const bookResponse = await axios.post(
        "http://localhost:8080/book/create",
        bookData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (bookResponse.status === 200) {
        const bookId = bookResponse.data.id;
        await uploadCoverImage(bookId);

        await Promise.all([
          ...authorIds.map((authorId) =>
            axios.post(
              "http://localhost:8080/bookauthor/create",
              { authorId, bookId },
              { headers: { "Content-Type": "application/json" } }
            )
          ),
          ...selectedGenres.map((genre) =>
            axios.post(
              "http://localhost:8080/bookgenre/create",
              { genreId: genre.id, bookId },
              { headers: { "Content-Type": "application/json" } }
            )
          ),
        ]);

        setSuccessMessage("Book added successfully!");
        navigate("/admin/home");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      setErrorMessage(error.response?.data?.message || "Failed to add book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add a New Book</h2>

      {/* Display error or success messages */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="add-book-form">
        {Object.entries(formData).map(([key, value]) =>
          key !== "purchasable" ? (
            <div key={key} className="input-group">
              <label htmlFor={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type={
                  key === "publicationDate"
                    ? "date"
                    : key === "price" || key === "count"
                    ? "number"
                    : "text"
                }
                id={key}
                name={key}
                value={value}
                onChange={handleInputChange}
                placeholder={`Enter book ${key}`}
                required
              />
            </div>
          ) : (
            <div key={key} className="input-group">
              <label htmlFor={key}>Purchasable</label>
              <input
                type="checkbox"
                id={key}
                name={key}
                checked={value}
                onChange={handleInputChange}
              />
            </div>
          )
        )}

        <div className="input-group">
          <label>Authors</label>
          {authors.map((author, index) => (
            <div key={index} className="author-input-group">
              <input
                type="text"
                placeholder="First Name"
                value={author.firstName}
                onChange={(e) =>
                  handleAuthorChange(index, "firstName", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                value={author.lastName}
                onChange={(e) =>
                  handleAuthorChange(index, "lastName", e.target.value)
                }
              />
              {authors.length > 1 && (
                <button type="button" onClick={() => removeAuthor(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addAuthor}>
            Add Another Author
          </button>
        </div>

        <div className="input-group">
          <label>Genres</label>
          <select onChange={handleGenreChange}>
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          <div className="selected-genres">
            {selectedGenres.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
                <button type="button" onClick={() => removeGenre(genre.id)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
          />
          <button
            type="button"
            onClick={() => {
              setUseDefaultCover(true);
              setCoverImage(null);
              setPreviewImageUrl(defaultBookCover);
            }}
          >
            Use Default Cover
          </button>
          <img src={previewImageUrl} alt="Preview" className="preview-image" />
        </div>

        <div className="input-group">
          <label>Custom Fields</label>
          {customFields.map((field, index) => (
            <div key={index} className="custom-field-group">
              <input
                type="text"
                placeholder="Key"
                value={field.key}
                onChange={(e) =>
                  handleCustomFieldChange(index, "key", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Value"
                value={field.value}
                onChange={(e) =>
                  handleCustomFieldChange(index, "value", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() =>
                  setCustomFields((prev) => prev.filter((_, i) => i !== index))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setCustomFields((prev) => [...prev, { key: "", value: "" }])
            }
          >
            Add Custom Field
          </button>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Adding Book..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}

export default AddBook;
