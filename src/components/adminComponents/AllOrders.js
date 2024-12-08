import { useEffect, useState } from "react";
import { useAdminAuthContext } from "../../hooks/useAdminAuthContext";
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
import { FormControl, Select, MenuItem } from "@mui/material";
import Sidebar from "./Sidebar";


const AllOrders = () => {
  const { admin } = useAdminAuthContext();
  const [orders, setOrders] = useState([]);

  const approveOrder = (id, newStatus) => {
    axios
      .put("http://localhost:7003/api/order/update-order/" + id, { status: newStatus })
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
      const response = await fetch("http://localhost:7003/api/order/allorders");
      const json = await response.json();
      if (response.ok) {
        setOrders(json);
      }
    };
    if (admin) {
      fetchOrders();
    }
  }, [admin]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar /> {/* Add the Sidebar component here */}
      
      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: '300px', // Matches sidebar width
          padding: '20px',
          overflowY: 'auto',
          boxSizing: 'border-box',
          backgroundColor: '#f9f9f9',
        }}
      >
        {/* Orders Header */}
        <Grid container spacing={2} alignItems="center">
          <Grid item>
          </Grid>
          <Grid item xs>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Total Orders
            </Typography>
            <Typography sx={{ fontSize: "1.1rem", color: "#888" }}>{orders.length}</Typography>
          </Grid>
        </Grid>

        {/* Orders Table */}
        <TableContainer
          component={Paper}
          sx={{
            marginTop: "30px",
            maxWidth: "100%",
            borderRadius: "12px",
            boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="orders table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#652580",
                  color: "#fff",
                  textTransform: "uppercase",
                  "& th": {
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "#fff",
                    padding: "12px 16px",
                  },
                }}
              >
                <TableCell>Order ID</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders &&
                orders.map((order, index) => (
                  <TableRow
                    key={order._id}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#fafafa",
                      },
                      "&:hover": {
                        backgroundColor: "#f1f1f1",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontSize: "1rem",
                        color: "#333",
                        padding: "12px 16px",
                      }}
                    >
                      {order._id.slice(0, 10)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: "1rem",
                        color: "#555",
                        padding: "12px 16px",
                      }}
                    >
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <FormControl>
                        <Select
                          value={order.orderStatus}
                          onChange={(e) => approveOrder(order._id, e.target.value)}
                          sx={{
                            fontSize: "1rem",
                            minWidth: 120,
                            padding: "8px 14px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            backgroundColor: "#fff",
                            "& .MuiSelect-select": { padding: "8px 14px" },
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                            },
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
    </Box>
  );
};

export default AllOrders;