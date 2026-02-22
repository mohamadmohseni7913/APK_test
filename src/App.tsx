import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TicketList from './pages/TicketList';
import CreateTicket from './pages/CreateTicket';
import Layout from './components/layout/Layout';
import { getToken } from './utils/cookies';
import TicketDetails from './pages/TicketDetail';
import NotFoundPage from './pages/notFound';
const useAuth = () => {
  const token = getToken();
  return !!token;
};
const ProtectedRoute = () => {
  const isAuthenticated = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <Layout >
                <Outlet />
              </Layout>
            }
          >
            <Route path="/" element={<TicketList />} />
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/tickets/create" element={<CreateTicket />} />
            <Route path="/tickets/:id" element={<TicketDetails />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;