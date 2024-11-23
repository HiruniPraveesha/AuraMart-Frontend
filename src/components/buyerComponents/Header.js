import React, { useState } from "react";
import { Link } from 'react-router-dom';

import {
    AppBar,
    Box,
    Tooltip,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Tab,
    Tabs,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
    Button,
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DrawerComp from "./Drawer";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";

const Header = () => {
    const { user } = useAuthContext();
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const isMatch = useMediaQuery(theme.breakpoints.down("md"));

    const { logout } = useLogout();

    const handleLogoutClick = () => {
        logout();
    };


    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <>

            <AppBar sx={{ background: "#7B1FA2", padding: "15px" }}>
                <Toolbar>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <img
                            src="/logo.png"
                            alt="Auramart Logo"
                            style={{ height: "50px", width: "auto", display: "block" }}
                        />
                    </Link>
                    <Typography
                        sx={{
                            fontSize: "2rem",
                            paddingLeft: "2%",
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'unset',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                        component={Link}
                        to="/"
                    >
                        AURAMART
                    </Typography>
                    {isMatch ? (
                        <>
                            <Tooltip title="Open Cart">
                                <Link to="/cart" style={{ marginLeft: "auto", textDecoration: "none", color: "white" }}>
                                    <ShoppingCartIcon sx={{ transform: "scale(1.5)" }} />
                                </Link>
                            </Tooltip>
                            <Box sx={{ flexGrow: 0, marginLeft: "40px" }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography
                                            textAlign="center"
                                            sx={{ textDecoration: "none", color: "black" }}
                                            component={Link}
                                            to="/user-profile"
                                        >
                                            Profile
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogoutClick}>
                                        <Typography
                                            textAlign="center"
                                            sx={{ textDecoration: "none", color: "black" }}
                                            component={Link}
                                            to="/"
                                        >
                                            Logout
                                        </Typography>

                                    </MenuItem>
                                </Menu>
                            </Box>
                            <DrawerComp />
                        </>
                    ) : (
                        <>
                            <Tabs

                                sx={{
                                    marginLeft: "auto",
                                    fontFamily: "monospace",
                                    fontSize: "24px",
                                    ".MuiTab-root": {
                                        textTransform: "none",
                                    },
                                    ".Mui-selected": {
                                        color: "yellow", // Change the active tab color
                                        fontWeight: "bold", // Highlight the active tab with bold font
                                        backgroundColor: "#ffffff1a", // Add a subtle background
                                        borderRadius: "8px",
                                    },
                                    ".MuiTabs-indicator": {
                                        backgroundColor: "yellow", // Customize the underline indicator
                                        height: "4px",
                                    },
                                }}
                                indicatorColor="secondary"
                                textColor="inherit"
                                value={value}
                                onChange={(e, newValue) => setValue(newValue)}
                            >
                                <Tab label="Home" LinkComponent={Link} to="/" value={0} />
                                <Tab label="About Us" LinkComponent={Link} to="/about" value={1} />
                                <Tab label="Contact" LinkComponent={Link} to="/contact" value={2} />

                            </Tabs>

                            {user ? (
                                <>
                                    <Tooltip title="Open Cart">

                                        <Link
                                            to="/cart"
                                            style={{ marginLeft: "auto", textDecoration: "none", color: "white" }}
                                        >

                                            <ShoppingCartIcon sx={{ transform: "scale(1.5)" }} />
                                        </Link>
                                    </Tooltip>
                                    <Box sx={{ flexGrow: 0, marginLeft: "40px" }}>
                                        <Tooltip title="Open settings">
                                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            sx={{ mt: '45px' }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenu}
                                        >

                                            <MenuItem onClick={handleCloseUserMenu}>
                                                <Typography
                                                    textAlign="center"
                                                    sx={{ textDecoration: "none", color: "black" }}
                                                    component={Link}
                                                    to={user.role === "admin" ? "/admin-dashboard" : "/user-profile"}
                                                >
                                                    {user.role === "admin" ? "Admin Dashboard" : "Profile"}
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem onClick={handleLogoutClick}>
                                                <Typography
                                                    textAlign="center"
                                                    sx={{ textDecoration: "none", color: "black" }}
                                                    component={Link}
                                                    to="/"
                                                >
                                                    Logout
                                                </Typography>
                                            </MenuItem>

                                        </Menu>
                                    </Box>
                                </>
                            ) : (
                                <>

                                    <Box sx={{ flexGrow: 0, marginLeft: "auto" }}>

                                        <Button LinkComponent={Link} to="/login" sx={{ textDecoration: "none", color: "white" }}>Login</Button>
                                        <Button LinkComponent={Link} to="/signup" sx={{ textDecoration: "none", color: "white" }}>Register</Button>
                                    </Box>
                                </>
                            )}
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Header;

