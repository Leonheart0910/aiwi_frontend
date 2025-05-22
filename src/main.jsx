import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles.css";
import App from "./App";
import Loading from "./app/loading.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </Router>
  </StrictMode>
);
