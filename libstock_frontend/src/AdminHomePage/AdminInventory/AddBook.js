import React, { useState } from "react";
import axios from "axios";
import { Button, Input, Label } from "@/components/ui";

const AddBook = () => {
  const [book, setBook] = useState({
    ISBN: "",
    title: "",
    summary: "",
    publicationDate: "",
    price: "",
    purchaseable: true,
    count: "",
    numCheckedOut: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook({
      ...book,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/book/create",
        book
      );
      alert("Book added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding book", error);
      alert("Failed to add book.");
    }
  };

  return (
    <div className="p-4 border rounded shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add a New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Label>ISBN</Label>
        <Input
          type="text"
          name="ISBN"
          value={book.ISBN}
          onChange={handleChange}
          required
        />

        <Label>Title</Label>
        <Input
          type="text"
          name="title"
          value={book.title}
          onChange={handleChange}
          required
        />

        <Label>Summary</Label>
        <Input
          type="text"
          name="summary"
          value={book.summary}
          onChange={handleChange}
          required
        />

        <Label>Publication Date</Label>
        <Input
          type="date"
          name="publicationDate"
          value={book.publicationDate}
          onChange={handleChange}
          required
        />

        <Label>Price</Label>
        <Input
          type="number"
          name="price"
          value={book.price}
          onChange={handleChange}
          required
        />

        <Label>Purchaseable</Label>
        <input
          type="checkbox"
          name="purchaseable"
          checked={book.purchaseable}
          onChange={handleChange}
        />

        <Label>Count</Label>
        <Input
          type="number"
          name="count"
          value={book.count}
          onChange={handleChange}
          required
        />

        <Label>Num Checked Out</Label>
        <Input
          type="number"
          name="numCheckedOut"
          value={book.numCheckedOut}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Add Book
        </Button>
      </form>
    </div>
  );
};

export default AddBook;
