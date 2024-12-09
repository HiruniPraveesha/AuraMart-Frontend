
import React, { useState } from 'react'
import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useAuthContext } from '../../hooks/useAuthContext';
import Typography from '@mui/material/Typography';
import Orders from './Orders';
import UserDashBoard from './UserDashBoard';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const UserProfile = () => {
  const{user} = useAuthContext()
  const[ayurUser,setUser]=useState("")

  const [activeLink, setActiveLink] = useState('link1'); 

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };


  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  useEffect(()=>{

    const fetchUser = async()=>{
        const response = await fetch("http://localhost:7002/api/user/"+ user._id,{
            headers :{ 'Authorization' :`Bearer ${user.token}`}
        })

        const json = await response.json()

        if(response.ok){
            setUser(json)
        }
        
    }

    if(user){
        fetchUser()
    }

  },[user])

  return (
    <div>
      <Box sx={{ overflowX: "hidden", marginTop: "150px",marginBottom:"150px"}}>
      <Box sx={{ width: 1200 ,margin:"auto"}}>
      <Grid  container
      direction="row"
      justifyContent="center"
      alignItems="flex-start" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={4}>
          <Item>
            <Grid container>
            <Box
                    sx={{
                    width:500,
                    height: 100,
                    backgroundColor: '#b257d9'
                  }}
                  
                />
                <Grid textAlign={'left'}>
                  <Typography fontWeight="bold">
                    Hey! {ayurUser.email}
                  </Typography>
                  <Typography textTransform="capitalize">
                    {ayurUser.role} since {new Date(ayurUser.createdAt).getFullYear()}
                  </Typography>
                </Grid>
            </Grid>
          </Item>

          <Item>
          <Box sx={{ width: '100%'}}>
            <List>
              <ListItemButton
                onClick={() => handleLinkClick('link1')}
                className={activeLink === 'link1' ? 'active' : ''}
                sx={{
                    backgroundColor: activeLink === 'link1' ? '#eef08d' : 'transparent', 
                    '&:hover': {
                      backgroundColor: '#eef08d',
                    },
                  }}
              >
                <ListItemText primary="My Profile" />
              </ListItemButton>
            </List>
            <List>
              <ListItemButton
                onClick={() => handleLinkClick('link3')}
                className={activeLink === 'link3' ? 'active' : ''}
                sx={{
                    backgroundColor: activeLink === 'link3' ? '#eef08d' : 'transparent', 
                    fontWeight:"bold",
                    '&:hover': {
                      backgroundColor: '#eef08d'
                      
                    },
                  }}
               
              >
                <ListItemText primary="My Orders" 
                  
                />
              </ListItemButton>
            </List>
          </Box>
          </Item>
        </Grid>
        <Grid item xs={6} md={8}>
          <Item>
          {activeLink === 'link1' && <UserDashBoard />} 
          {activeLink === 'link3' && <Orders />}  
          </Item>
        </Grid>
      </Grid>
    </Box>
    </Box>
      
    </div>
  )
}

export default UserProfile
