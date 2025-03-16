import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from './store';

interface LoginPayload {
    email: string;
    password: string;
}

export const loginAsync = createAsyncThunk<User, LoginPayload>(
    'user/login',
    async (payload: LoginPayload, { rejectWithValue, dispatch }) => {
      try {
        dispatch(login(
            {
              full_name: "John Doe",
              email_address: "johndoe@example.com",
              phone_number: "+1-555-123-4567",
              national_id: "A1234567890",  // Optional
              photo_url: "https://example.com/photo.jpg",  // Optional
              refresh_token: "refresh-token-12345",
              access_token: "access-token-67890"
            }// Simulate login
          )
        )
        return  {
          full_name: "John Doe",
          email_address: "johndoe@example.com",
          phone_number: "+1-555-123-4567",
          national_id: "A1234567890",  // Optional
          photo_url: "https://example.com/photo.jpg",  // Optional
          refresh_token: "refresh-token-12345",
          access_token: "access-token-67890"
        }//;
        // const response = await fetch('/api/login', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(credentials),
        // });
  
        // if (!response.ok) {
        //   const errorData = await response.json();
        //   return rejectWithValue(errorData.message || 'Login failed'); // Extract error message
        // }
  
        // const data: User = await response.json();
        // return data;
      } catch (error: any) {
        return rejectWithValue(error.message || 'Network error');
      }
    }
);