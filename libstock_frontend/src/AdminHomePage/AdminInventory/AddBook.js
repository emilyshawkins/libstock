// import React, { useState } from "react";
// import axios from "axios";

// const AddBook = () => {
//   const [book, setBook] = useState({
//     ISBN: "",
//     title: "",
//     summary: "",
//     publicationDate: "",
//     price: "",
//     purchaseable: true,
//     count: "",
//     numCheckedOut: "",
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setBook({
//       ...book,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   //   const handleSubmit = async (e) => {
//   //     e.preventDefault();
//   //     try {
//   //       const response = await axios.post(
//   //         "http://localhost:8080/book/create",
//   //         book
//   //       );
//   //       alert("Book added successfully!");
//   //       console.log(response.data);
//   //     } catch (error) {
//   //       console.error("Error adding book", error);
//   //       alert("Failed to add book.");
//   //     }
//   //   };

//   return (
//     <div className="p-4 border rounded shadow-lg max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-4">Add a New Book</h2>
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <label>ISBN</label>
//         <input
//           type="text"
//           name="ISBN"
//           value={book.ISBN}
//           onChange={handleChange}
//           required
//         />

//         <label>Title</label>
//         <input
//           type="text"
//           name="title"
//           value={book.title}
//           onChange={handleChange}
//           required
//         />

//         <label>Summary</label>
//         <input
//           type="text"
//           name="summary"
//           value={book.summary}
//           onChange={handleChange}
//           required
//         />

//         <label>Publication Date</label>
//         <input
//           type="date"
//           name="publicationDate"
//           value={book.publicationDate}
//           onChange={handleChange}
//           required
//         />

//         <label>Price</label>
//         <input
//           type="number"
//           name="price"
//           value={book.price}
//           onChange={handleChange}
//           required
//         />

//         <label>Purchaseable</label>
//         <input
//           type="checkbox"
//           name="purchaseable"
//           checked={book.purchaseable}
//           onChange={handleChange}
//         />

//         <label>Count</label>
//         <input
//           type="number"
//           name="count"
//           value={book.count}
//           onChange={handleChange}
//           required
//         />

//         <label>Num Checked Out</label>
//         <input
//           type="number"
//           name="numCheckedOut"
//           value={book.numCheckedOut}
//           onChange={handleChange}
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 rounded"
//         >
//           Add Book
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddBook;
