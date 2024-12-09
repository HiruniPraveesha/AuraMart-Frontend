import { useEffect, useState } from "react";
import { useAdminAuthContext } from "../../hooks/useAdminAuthContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  useTheme,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import InboxIcon from "@mui/icons-material/Inbox";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "./Sidebar"; // Import Sidebar

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UsersChart = () => {
  const { admin } = useAdminAuthContext();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const theme = useTheme(); // To access the theme colors for consistency

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:7002/api/user/all-users");
      const json = await response.json();
      if (response.ok) {
        setUsers(json);
      }
    };

    const fetchOrders = async () => {
      const response = await fetch("http://localhost:7003/api/order/allorders");
      const json = await response.json();
      if (response.ok) {
        setOrders(json);
      }
    };

    if (admin) {
      fetchUsers();
      fetchOrders();
    }
  }, [admin]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const userperMonth = Array(12).fill(0);
  const ordersperMonth = Array(12).fill(0);

  users.forEach((user) => {
    const createdDate = new Date(user.createdAt);
    const month = createdDate.getMonth();
    userperMonth[month]++;
  });

  orders.forEach((order) => {
    const createdDate = new Date(order.createdAt);
    const month = createdDate.getMonth();
    ordersperMonth[month]++;
  });

  const data1 = {
    labels: months,
    datasets: [
      {
        label: "Users Per Month",
        data: userperMonth,
        backgroundColor: "#BF0AFF",
        borderColor: "#D9D9D9",
        borderWidth: 2,
      },
    ],
  };

  const data2 = {
    labels: months,
    datasets: [
      {
        label: "Orders Per Month",
        data: ordersperMonth,
        backgroundColor: "#DC92F6",
        borderColor: "#D9D9D9",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
        max: Math.max(...userperMonth, ...ordersperMonth) + 5,
      },
    },
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content Section */}
      <Box sx={{
          flexGrow: 1,
          marginLeft: '300px', // Matches sidebar width
          padding: '20px',
          overflowY: 'auto',
          boxSizing: 'border-box',
          backgroundColor: '#f9f9f9', }}>
        <Grid container spacing={4}>
          {/* Total Users Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              textAlign: "center", boxShadow: 6, borderRadius: 2, "&:hover": { transform: "scale(1.03)" },
              transition: "transform 0.3s ease-in-out", backgroundColor: "#BF0AFF" }}>
              <CardContent>
                <IconButton>
                  <PersonOutlineOutlinedIcon color="#4A148C" fontSize="large" />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#4A148C" }}>
                  Total Users
                </Typography>
                <Typography variant="h4" color="text.secondary">
                  {users.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Orders Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              textAlign: "center", boxShadow: 6, borderRadius: 2, "&:hover": { transform: "scale(1.03)" },
              transition: "transform 0.3s ease-in-out", backgroundColor: "#DC92F6" }}>
              <CardContent>
                <IconButton>
                  <InboxIcon color="#4A148C" fontSize="large" />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#4A148C" }}>
                  Total Orders
                </Typography>
                <Typography variant="h4" color="text.secondary">
                  {orders.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} sx={{ marginTop: "30px" }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ padding: "20px", boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
                Monthly User Registrations
              </Typography>
              <Bar data={data1} options={options} />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ padding: "20px", boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
                Monthly Orders
              </Typography>
              <Bar data={data2} options={options} />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UsersChart;