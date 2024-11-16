import React, { useState } from 'react'
import Button from '@mui/material/Button';
import EditUser from './EditUser';
import UserInfo from './UserInfo';
import Address from './Address';
import EditAddress from './EditAddress';

const UserDashBoard = () => {

    const [isEditing, setIsEditing] = useState(false);

    const [isaddressEditing, setAddressEditing] = useState(false)

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleAddressToggle = () => {
        setAddressEditing(!isaddressEditing);
    }

    return (
        <div>
            {isEditing ? (
                <EditUser onEditToggle={handleEditToggle} />
            ) : (
                <UserInfo />
            )}
            {!isEditing && (
                <Button onClick={handleEditToggle} variant="contained"
                    sx={{ color: 'white', backgroundColor: "#EFA7A7", borderColor: 'green', width: '45ch', padding: 2, margin: 2, fontWeight: "bold",'&:hover': {
      backgroundColor: '#E08F8F', 
    } }}>
                    Edit
                </Button>
            )}

            {isaddressEditing ? (
                <EditAddress onEditToggleAddress={handleAddressToggle} />
            ) : (
                <Address />
            )}

            {!isaddressEditing && (
                <Button onClick={handleAddressToggle} variant="contained"
                    sx={{ color: 'white', backgroundColor: "#EFA7A7", borderColor: 'green', width: '45ch', padding: 2, margin: 2, fontWeight: "bold",'&:hover': {
      backgroundColor: '#E08F8F', 
    } }}>
                    Add Address
                </Button>
            )}
        </div>
    )
}

export default UserDashBoard