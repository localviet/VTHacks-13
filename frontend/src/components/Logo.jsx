import React from "react";

// Simple Logo component that loads the image from the public folder.
// Accepts className to control sizing (e.g. "w-7 h-7" or "w-24 h-24").
export default function Logo({ className = "w-8 h-8", alt = "Ignite logo" }) {
  return (
    <img
      src="/Ignite logo.png"
      alt={alt}
      className={"object-contain " + className}
      draggable={false}
    />
  );
}
