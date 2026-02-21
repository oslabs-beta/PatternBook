import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css"; // eventually update
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
