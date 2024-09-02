import './App.css';
import ClientStepper from './components/ClientStepper';
import SuccessPage from './components/SuccessPage'; 
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
const theme = createTheme(); // Create a default theme

function App() {
  return (
    
    <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<ClientStepper />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  </ThemeProvider>
  );
}

export default App;
