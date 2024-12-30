import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Entities from './pages/Entities';
import Transactions from './pages/Transactions';
import Fees from './pages/Fees';
import Documents from './pages/Documents';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/entities" element={<Entities />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/documents" element={<Documents />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;