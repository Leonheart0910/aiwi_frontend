import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import Home from "./app/page.jsx";
import RootLayout from "./app/layout.jsx";
import Loading from "./app/loading.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootLayout>
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    </RootLayout>
  </StrictMode>
);
