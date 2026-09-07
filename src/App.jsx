import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import PersonsPage from "./pages/PersonsPage";
import PersonProfilePage from "./pages/PersonProfilePage";
import PositionsPage from "./pages/PositionsPage";
import StatusesPage from "./pages/settings/StatusesPage";
import { OrderTypesPage } from "./pages/settings/OrderTypesPage";
import { LeaveTypesPage } from "./pages/settings/LeaveTypesPage";
import { ContactTypesPage } from "./pages/settings/ContactTypesPage";
import { BonusTypesPage } from "./pages/settings/BonusTypesPage";
import OrdersPage from "./pages/OrdersPage";
import OrderCreatePage from "./pages/OrderCreatePage";
import OrderEditPage from "./pages/OrderEditPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import StaffingPlansPage from "./pages/StaffingPlansPage";
import StructuresPage from "./pages/StructuresPage";
import DeletedPersonsPage from "./pages/DeletedPersonsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* All Protected App Routes wrapped inside MainLayout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/persons" replace />} />

          {/* Core Modules */}
          <Route path="/structures" element={<StructuresPage />} />
          <Route path="/persons" element={<PersonsPage />} />
          <Route path="/persons/:personId" element={<PersonProfilePage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/staffing-plans" element={<StaffingPlansPage />} />

          {/* Orders */}
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/new" element={<OrderCreatePage />} />
          <Route path="/orders/:id/edit" element={<OrderEditPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />

          <Route path="/persons/deleted" element={<DeletedPersonsPage />} />

          {/* Settings */}
          <Route path="/statuses" element={<StatusesPage />} />
          <Route path="/settings/order-types" element={<OrderTypesPage />} />
          <Route path="/settings/bonus-types" element={<BonusTypesPage />} />
          <Route path="/settings/leave-types" element={<LeaveTypesPage />} />
          <Route path="/settings/contact-types" element={<ContactTypesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}