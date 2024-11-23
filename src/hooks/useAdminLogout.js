import { useAdminAuthContext } from "./useAdminAuthContext"

export const useAdminLogout=()=>{
    const {dispatch} = useAdminAuthContext()

    const adminlogout = () =>{
        localStorage.removeItem('seller')
        dispatch({type:'LOGOUT'})
    }

    return {adminlogout}   
}