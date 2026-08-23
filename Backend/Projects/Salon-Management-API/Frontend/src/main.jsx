import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!rounded-xl !text-sm !font-medium",
            success: { iconTheme: { primary: "#be185d", secondary: "#fff" } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
