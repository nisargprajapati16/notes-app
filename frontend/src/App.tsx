import AppRoutes from './routes';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from './store';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { hideSnackbar } from './store/uiSlice';
import "./App.css";

function App() {
  const snackbar = useSelector((state: RootState) => state.ui.snackbar);
  const dispatch = useDispatch();
  return (
    <>
      <AppRoutes />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => dispatch(hideSnackbar())}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" severity={snackbar.severity} onClose={() => dispatch(hideSnackbar())}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default App;
