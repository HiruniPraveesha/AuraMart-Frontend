import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/buyerComponents/Header";
import Home from "./components/buyerComponents/Home";
import Footer from "./components/buyerComponents/Footer";
import Product from "./components/buyerComponents/Product";
import Cart from "./components/buyerComponents/Cart";
import Contact from "./components/buyerComponents/Contact";
import About from "./components/buyerComponents/About";
import { useAuthContext } from './hooks/useAuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import HomeLogin from './pages/Home';
import ForgetPassword from "./pages/ForgetPassowrd";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./components/buyerComponents/UserProfile";
import CheckoutSuccess from "./components/buyerComponents/CheckoutSuccess";
import NotFound from "./components/buyerComponents/NotFound";
import AdminDashboard from "./components/adminComponents/AdminDashboard";
import AddProductForm from "./components/adminComponents/AddProductForm";
import Payment from "./components/buyerComponents/Payment";
import AdminSignup from "./pages/AdminSignup";
import AdminLogin from "./pages/AdminLogin";
import { useAdminAuthContext } from "./hooks/useAdminAuthContext";
import Users from "./components/adminComponents/Users";
import UsersChart from "./components/adminComponents/UsersChart";
import AllOrders from "./components/adminComponents/AllOrders";

function App() {
    const { user } = useAuthContext();
    const { admin } = useAdminAuthContext();
    const location = useLocation();

    
    const noHeaderFooterRoutes = [
        "/Users",
        "/UsersChart",  
        "/AllOrders",      
        "/admin-dashboard",    
        "/addproduct"   
    ];

    return (
        <React.Fragment>
            
            {!noHeaderFooterRoutes.includes(location.pathname) && <Header />}

            <main style={{ marginBottom: "50px" }}>
                <Routes>
                    <Route path="/" element={<Home />} exact></Route>
                    <Route path="/product/:id" element={<Product />} exact></Route>
                    <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} exact></Route>
                    <Route path="/" element={user ? <HomeLogin /> : <Navigate to="/login" />} />
                    <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/login" />} />
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route path="/reset-password" element={!user ? <ForgetPassword /> : <Navigate to="/" />} />
                    <Route path="/api/user/reset-password/:token" element={<ResetPassword />} exact></Route>
                    <Route path="/user-profile" element={user ? <UserProfile /> : <Navigate to="/" />} exact></Route>
                    <Route path="/contact" element={<Contact />} exact></Route>
                    <Route path="/users" element={<Users />} exact></Route>
                    <Route path="/AllOrders" element={<AllOrders />} exact></Route>
                    <Route path="/UsersChart" element={<UsersChart />} exact></Route>
                    <Route path="/about" element={<About />} exact></Route>
                    <Route path="/payment/:cart" element={<Payment />} exact></Route>
                    <Route path="/checkout-success" element={<CheckoutSuccess />} exact></Route>
                    <Route path="*" element={<NotFound />} exact></Route>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} exact></Route>
                    <Route path="/addProduct" element={<AddProductForm />} exact></Route>
                    <Route path="/adminSignup" element={!admin ? <AdminSignup /> : <Navigate to="/admin-dashboard" />} exact></Route>
                    <Route path="/adminLogin" element={!admin ? <AdminLogin /> : <Navigate to="/admin-dashboard" />} exact></Route>
                </Routes>
            </main>

            {/* Conditionally render Footer */}
            {!noHeaderFooterRoutes.includes(location.pathname) && <Footer />}
        </React.Fragment>
    );
}

export default App;
