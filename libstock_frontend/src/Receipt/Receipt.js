import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import axios from "axios";

const monoStyle = {
  fontFamily: "monospace",
  fontSize: "1.1em",
  whiteSpace: "pre-line",
};

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookDetails, setBookDetails] = useState({});
  const purchaseData = location.state?.purchaseData;

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (purchaseData) {
          setReceipt(purchaseData);
          try {
            const bookResponse = await axios.get(
              `http://localhost:8080/book/read?id=${purchaseData.bookId}`
            );
            setBookDetails({ [purchaseData.bookId]: bookResponse.data });
          } catch (error) {
            console.error(`Error fetching book details:`, error);
          }
          setLoading(false);
          return;
        }
        if (id) {
          // Fetch individual receipt
          const response = await axios.get(
            `http://localhost:8080/history/get_receipt?id=${id}`
          );
          setReceipt(response.data);
          try {
            const bookResponse = await axios.get(
              `http://localhost:8080/book/read?id=${response.data.bookId}`
            );
            setBookDetails({ [response.data.bookId]: bookResponse.data });
          } catch (error) {
            console.error(`Error fetching book details:`, error);
          }
        } else {
          // Fetch all receipts for user
          const response = await axios.get(
            `http://localhost:8080/history/get?userId=${userId}`
          );
          setReceipt(response.data);
          // Fetch book details for each purchase
          const bookDetailsMap = {};
          await Promise.all(
            response.data.map(async (purchase) => {
              try {
                const bookResponse = await axios.get(
                  `http://localhost:8080/book/read?id=${purchase.bookId}`
                );
                bookDetailsMap[purchase.bookId] = bookResponse.data;
              } catch (error) {
                console.error(
                  `Error fetching book details for book ID ${purchase.bookId}:`,
                  error
                );
              }
            })
          );
          setBookDetails(bookDetailsMap);
        }
      } catch (err) {
        setError("Failed to fetch receipt data");
        console.error("Error fetching receipt:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [id, purchaseData]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Button
          onClick={() => navigate("/user/renting")}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Return to Renting
        </Button>
      </Container>
    );
  }

  if (!receipt) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          No receipt data available
        </Typography>
        <Button
          onClick={() => navigate("/user/renting")}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Return to Renting
        </Button>
      </Container>
    );
  }

  // If we're viewing all receipts
  if (Array.isArray(receipt)) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Purchase History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Purchase Date</TableCell>
                <TableCell>Book Title</TableCell>
                <TableCell>ISBN</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receipt.map((purchase) => {
                const book = bookDetails[purchase.bookId] || {};
                return (
                  <TableRow key={`${purchase.bookId}-${purchase.purchaseDate}`}>
                    <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                    <TableCell>{book.title || "Loading..."}</TableCell>
                    <TableCell>{book.isbn || "Loading..."}</TableCell>
                    <TableCell>{purchase.quantity}</TableCell>
                    <TableCell>${(purchase.cost / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/receipt/${purchase.id}`)}
                      >
                        Show Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button variant="contained" onClick={() => navigate("/user/renting")}>
            Return to Renting
          </Button>
        </Box>
      </Container>
    );
  }

  // Individual receipt (plain, print-friendly)
  const book = bookDetails[receipt.bookId] || {};
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={1}
        sx={{ p: 3, "@media print": { boxShadow: "none", border: "none" } }}
      >
        <Box sx={{ ...monoStyle, mb: 2 }}>
          {formatDate(receipt.purchaseDate)}
        </Box>
        <Divider sx={{ mb: 2, "@media print": { display: "none" } }} />
        <Box sx={monoStyle}>
          {`Item: ${book.isbn || ""}\nTitle: ${
            book.title || ""
          }\nMaterial: Book\n`}
        </Box>
        <Box sx={monoStyle}>
          {`Quantity: ${receipt.quantity}\n`}
          {`Total: $${(receipt.cost / 100).toFixed(2)}`}
        </Box>
        <Divider sx={{ my: 2, "@media print": { display: "none" } }} />
        <Box sx={monoStyle}>
          {`Thank you for your purchase!\nNO REFUNDS or REPLACEMENTS ON LOST ITEMS`}
        </Box>
        <Box
          sx={{
            textAlign: "center",
            mt: 3,
            "@media print": { display: "none" },
          }}
        >
          <Button variant="contained" onClick={handlePrint} sx={{ mr: 2 }}>
            Print Receipt
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/user/renting")}
          >
            Return to Renting
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Receipt;
