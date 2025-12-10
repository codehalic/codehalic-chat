import React from "react";
import { Button } from "@repo/ui";
import { greet } from "@repo/utils";

export default function App() {
  return (
    <div>
      <h1>{greet("Turborepo")}</h1>
      <Button onClick={() => alert("clicked")}>Click me</Button>
    </div>
  );
}
