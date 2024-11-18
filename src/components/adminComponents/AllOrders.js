import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import axios from "axios";
import InboxIcon from "@mui/icons-material/Inbox";
import Grid from "@mui/material/Grid";
import { FormControl } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";

const AllOrders = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState([]);

  const approveOrder = (id, newStatus) => {
    axios
      .put("http://localhost:7006/api/order/update-order/" + id, { status: newStatus })
      .then((response) => {
        if (response.status === 200) {
          const updatedOrders = orders.map((order) => {
            if (order._id === id) {
              return { ...order, orderStatus: newStatus };
            }
            return order;
          });
          setOrders(updatedOrders);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch("http://localhost:7006/api/order/allorders");
      const json = await response.json();
      if (response.ok) {
        setOrders(json);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <Box
      sx={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* Orders Header */}
      <Grid container wrap="nowrap" spacing={2} alignContent="left">
        <Grid item>
          <InboxIcon color="primary" fontSize="large" />
        </Grid>
        <Grid item xs>
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Total Orders
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "#666" }}>{orders.length}</Typography>
        </Grid>
      </Grid>

      

      {/* Orders Table */}
      <TableContainer
        component={Paper}
        sx={{
          margin: "auto",
          maxWidth: "800px",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Order ID</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Date
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders &&
              orders.map((order, index) => (
                <TableRow
                  key={order._id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                    "&:hover": { backgroundColor: "#f1f1f1" },
                  }}
                >
                  <TableCell sx={{ fontSize: "0.9rem", color: "#333" }}>
                    {order._id.slice(0, 10)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.9rem", color: "#666" }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <FormControl>
                      <Select
                        value={order.orderStatus}
                        onChange={(e) => approveOrder(order._id, e.target.value)}
                        sx={{
                          fontSize: "0.9rem",
                          minWidth: 120,
                          "& .MuiSelect-select": { padding: "8px 14px" },
                        }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Confirm">Confirm</MenuItem>
                        <MenuItem value="Dispatched">Dispatched</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllOrders;
