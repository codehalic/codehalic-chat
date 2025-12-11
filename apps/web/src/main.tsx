import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { useTheme } from './store/theme'

const rootEl = document.getElementById("root")!;
function Root() {
  const init = useTheme((s) => s.init)
  React.useEffect(() => { init() }, [init])
  return <App />
}
createRoot(rootEl).render(<Root />);
