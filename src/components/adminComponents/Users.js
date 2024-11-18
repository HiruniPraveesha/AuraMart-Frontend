import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const Users = () => {
    const { user } = useAuthContext();
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [actionType, setActionType] = useState(null); // Track action type (delete, block, unblock)
    const [selectedUserId, setSelectedUserId] = useState(null); // Track the selected user for action

    // Handle delete action
    const handleDelete = (id) => {
        const deleteUsers = async () => {
            const response = await fetch("http://localhost:7002/api/user/" + id, {
                method: "DELETE",
            });
            const json = await response.json();
            if (response.ok) {
                console.log("deleted");
                // Close dialog after delete
                setOpenDialog(false);

                // Refetch users to reflect the change
                const updatedUsersResponse = await fetch("http://localhost:7002/api/user/all-users");
                const updatedUsers = await updatedUsersResponse.json();
                if (updatedUsersResponse.ok) {
                    setUsers(updatedUsers); // Update users list
                }
            }
        };
        deleteUsers();
    };

    // Handle block action
    const blockUser = (id) => {
        const handleBlock = async () => {
            const response = await fetch("http://localhost:7002/api/user/block-user/" + id, {
                method: "PUT",
            });
            const json = await response.json();
            if (response.ok) {
                console.log("User blocked");
                // Close dialog after block
                setOpenDialog(false);

                // Refetch users to reflect the change
                const updatedUsersResponse = await fetch("http://localhost:7002/api/user/all-users");
                const updatedUsers = await updatedUsersResponse.json();
                if (updatedUsersResponse.ok) {
                    setUsers(updatedUsers); // Update users list
                }
            }
        };
        handleBlock();
    };

    // Handle unblock action
    const unblockUser = (id) => {
        const handleUnblock = async () => {
            const response = await fetch("http://localhost:7002/api/user/unblock-user/" + id, {
                method: "PUT",
            });
            const json = await response.json();
            if (response.ok) {
                console.log("User unblocked");
                // Close dialog after unblock
                setOpenDialog(false);

                // Refetch users to reflect the change
                const updatedUsersResponse = await fetch("http://localhost:7002/api/user/all-users");
                const updatedUsers = await updatedUsersResponse.json();
                if (updatedUsersResponse.ok) {
                    setUsers(updatedUsers); // Update users list
                }
            }
        };
        handleUnblock();
    };

    // Open dialog and set action (delete, block, unblock)
    const handleOpenDialog = (action, id) => {
        setActionType(action);
        setSelectedUserId(id);
        setOpenDialog(true);
    };

    // Close dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setActionType(null);
        setSelectedUserId(null);
    };

    // Fetch users once component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch("http://localhost:7002/api/user/all-users");
            const json = await response.json();
            if (response.ok) {
                setUsers(json);
            }
        };
        if (user) {
            fetchUsers();
        }
    }, []); // Fetch users once when component mounts

    return (
        <div>
            <Box sx={{ overflowX: "hidden" }}
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection={"column"}>
                <Grid container wrap="nowrap" spacing={2} alignItems="center">
                    <Grid item>
                        <PersonOutlineOutlinedIcon color="disabled" fontSize="large" />
                    </Grid>
                    <Grid item>
                        <Typography sx={{
                            fontSize: "1.2rem",
                            fontWeight: 'bold',
                        }} textAlign="left" variant="h3">Total Users: </Typography>
                    </Grid>
                    <Grid item>
                        <Typography sx={{
                            fontSize: "1.5rem",
                            fontWeight: 'bold',
                            color: '#4A148C'
                        }} textAlign="left">{users.length}</Typography>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} sx={{ margin: "auto", width: 800, borderRadius: '10px', boxShadow: 3 }} elevation={0}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: '#4A148C', color: '#fff' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Full name</TableCell>
                                <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Mobile</TableCell>
                                <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users && users.map((u) => (
                                <TableRow
                                    key={u._id}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5', // Light hover effect
                                        }
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {u.email}
                                    </TableCell>
                                    <TableCell align="right">
                                        {u.firstName} {u.lastName}
                                    </TableCell>
                                    <TableCell align="right">
                                        {u.mobile}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" color="error" onClick={() => handleOpenDialog('delete', u._id)} sx={{
                                            width: '120px',
                                            fontWeight: "bold"
                                        }}>Delete</Button>
                                        <Button variant="contained" sx={{
                                            backgroundColor: u.isBlocked ? '#d32f2f' : '#4caf50', // Blocked: red, Unblocked: green
                                            color: 'white',
                                            width: '120px',
                                            fontWeight: "bold"
                                        }} onClick={() => handleOpenDialog(u.isBlocked ? 'unblock' : 'block', u._id)}>
                                            {u.isBlocked ? "Unblock" : "Block"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Confirmation Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">
                            Are you sure you want to {actionType} this user?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (actionType === 'delete') {
                                    handleDelete(selectedUserId);
                                } else if (actionType === 'block') {
                                    blockUser(selectedUserId);
                                } else if (actionType === 'unblock') {
                                    unblockUser(selectedUserId);
                                }
                            }}
                            color="secondary"
                        >
                            {actionType === 'delete' ? "Delete" : actionType === 'block' ? "Block" : "Unblock"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    );
};

export default Users;
