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
} from "@mui/material";
import axios from "axios";

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (id) {
          // Fetch individual receipt
          const response = await axios.get(`/history/get_receipt?id=${id}`);
          setReceipt(response.data);
        } else {
          // Fetch all receipts for user
          const response = await axios.get(
            `/history/get_receipts?userId=${userId}`
          );
          setReceipt(response.data);
        }
      } catch (err) {
        setError("Failed to fetch receipt data");
        console.error("Error fetching receipt:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  const handlePrint = () => {
    window.print();
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
          onClick={() => navigate("/")}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Return to Home
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
          onClick={() => navigate("/")}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Return to Home
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
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Book Title</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receipt.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.purchaseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.title}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/receipt/${order.id}`)}
                    >
                      View Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }

  // If we're viewing a single receipt
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, "@media print": { boxShadow: "none" } }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Purchase Receipt
          </Typography>
          <Typography variant="subtitle1">Order ID: {receipt.id}</Typography>
          <Typography variant="subtitle2">
            Date: {new Date(receipt.purchaseDate).toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Customer Information
          </Typography>
          <Typography>
            Name: {receipt.firstName} {receipt.lastName}
          </Typography>
          <Typography>Email: {receipt.email}</Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Purchase Details
          </Typography>
          <Typography>Book Title: {receipt.title}</Typography>
          <Typography>ISBN: {receipt.isbn}</Typography>
          <Typography>Quantity: {receipt.quantity}</Typography>
          <Typography>Unit Price: ${receipt.price.toFixed(2)}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Amount: ${receipt.amount.toFixed(2)}
          </Typography>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            mt: 4,
            "@media print": { display: "none" },
          }}
        >
          <Button variant="contained" onClick={handlePrint} sx={{ mr: 2 }}>
            Print Receipt
          </Button>
          <Button variant="outlined" onClick={() => navigate("/receipt")}>
            View All Receipts
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Receipt;
