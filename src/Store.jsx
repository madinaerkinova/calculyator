import { configureStore } from '@reduxjs/toolkit';
import AgeReducer from './components/ageSlice';

export default configureStore({
  reducer: {
    age: AgeReducer,
  },
});
