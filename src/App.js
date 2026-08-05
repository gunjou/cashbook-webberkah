import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { isAuthenticated } from "./modules/auth/auth.service";

import LoginPage from "./modules/auth/LoginPage";

import DashboardPage from "./modules/dashboard/DashboardPage";
import TransactionsPage from "./modules/transactions/TransactionsPage";
import AccountsPage from "./modules/accounts/AccountsPage";
import CategoriesPage from "./modules/categories/CategoriesPage";
import OpeningBalancesPage from "./modules/opening-balances/OpeningBalancesPage";

import NotFoundPage from "./modules/not-found/NotFoundPage";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <AccountsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/opening-balances"
          element={
            <ProtectedRoute>
              <OpeningBalancesPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
