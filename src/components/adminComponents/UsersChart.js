import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UsersChart = () => {
  const { user } = useAuthContext();
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
      const response = await fetch("http://localhost:7006/api/order/allorders");
      const json = await response.json();
      if (response.ok) {
        setOrders(json);
      }
    };

    if (user) {
      fetchUsers();
      fetchOrders();
    }
  }, [user]);

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
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.dark,
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
        backgroundColor: theme.palette.success.main,
        borderColor: theme.palette.success.dark,
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
    <Box sx={{ padding: "24px", backgroundColor: theme.palette.background.paper }}>
      <Grid container spacing={4}>
        {/* Total Users Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            textAlign: "center", boxShadow: 6, borderRadius: 2, "&:hover": { transform: "scale(1.03)" },
            transition: "transform 0.3s ease-in-out", backgroundColor: theme.palette.primary.light }}>
            <CardContent>
              <IconButton>
                <PersonOutlineOutlinedIcon color="primary" fontSize="large" />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: theme.palette.primary.dark }}>
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
            transition: "transform 0.3s ease-in-out", backgroundColor: theme.palette.success.light }}>
            <CardContent>
              <IconButton>
                <InboxIcon color="success" fontSize="large" />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: theme.palette.success.dark }}>
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
  );
};

export default UsersChart;