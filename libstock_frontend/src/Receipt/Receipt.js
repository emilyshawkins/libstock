import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  Paper,
  Typography,
  Box,
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

        if (!id) {
          setError("No receipt ID provided");
          setLoading(false);
          return;
        }

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
    const date = new Date(timestamp);
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

  const book = bookDetails[receipt.bookId] || {};
  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 4,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "500px",
          "@media print": {
            boxShadow: "none",
            border: "none",
            width: "100%",
            maxWidth: "none",
          },
        }}
      >
        <Box sx={{ ...monoStyle, mb: 3, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Purchase Receipt
          </Typography>
          {formatDate(receipt.purchaseDate)}
        </Box>
        <Divider sx={{ mb: 3, "@media print": { display: "none" } }} />
        <Box sx={{ ...monoStyle, mb: 3 }}>
          {`Item: ${book.isbn || ""}\nTitle: ${
            book.title || ""
          }\nMaterial: Book\n`}
        </Box>
        <Box sx={{ ...monoStyle, mb: 3 }}>
          {`Quantity: ${receipt.quantity}\n`}
          {`Total: $${(receipt.cost / 100).toFixed(2)}`}
        </Box>
        <Divider sx={{ my: 3, "@media print": { display: "none" } }} />
        <Box sx={{ ...monoStyle, textAlign: "center", color: "#666" }}>
          {`Thank you for your purchase!\nNO REFUNDS or REPLACEMENTS ON LOST ITEMS`}
        </Box>
        <Box
          sx={{
            textAlign: "center",
            mt: 4,
            "@media print": { display: "none" },
          }}
        >
          <Button
            variant="contained"
            onClick={handlePrint}
            sx={{
              mr: 2,
              backgroundColor: "#4CAF50",
              "&:hover": {
                backgroundColor: "#45a049",
              },
            }}
          >
            Print Receipt
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/user/renting")}
            sx={{
              borderColor: "#4CAF50",
              color: "#4CAF50",
              "&:hover": {
                borderColor: "#45a049",
                backgroundColor: "rgba(76, 175, 80, 0.04)",
              },
            }}
          >
            Return to Renting
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Receipt;