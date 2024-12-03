import { useState } from "react";
import { useAdminAuthContext } from "./useAdminAuthContext";

export const useAdminSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAdminAuthContext()
  
    const adminsignup = async (firstName, lastName, email, mobile, address, password) => {
      setIsLoading(true)
      setError(null)
  
      const response = await fetch('http://localhost:7004/api/admin/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ firstName, lastName, email, mobile, address, password })
      })
      const json = await response.json()
  
      if (!response.ok) {
        setIsLoading(false)
        setError(json.error)
      }
      if (response.ok) {
        // save the user to local storage
        localStorage.setItem('admin', JSON.stringify(json))
  
        // update the auth context
        dispatch({type: 'LOGIN', payload: json})
  
        // update loading state
        setIsLoading(false)
      } 
    }
  
    return { adminsignup, isLoading, error }
  }