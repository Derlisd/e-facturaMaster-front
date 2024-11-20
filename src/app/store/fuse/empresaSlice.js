import { createSlice } from '@reduxjs/toolkit';

const empresaSlice = createSlice({
  name: 'empresa',
  initialState: {
    id: null,
  },
  reducers: {
    setEmpresaId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setEmpresaId } = empresaSlice.actions;
export default empresaSlice.reducer;