import { createSlice } from '@reduxjs/toolkit'


export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
      backgroundColor: '#ffffff',
    },
    reducers: {
        setBackgroundColor: (state, action) => {
        state.backgroundColor = action.payload
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setBackgroundColor } = themeSlice.actions
  
  export default themeSlice.reducer