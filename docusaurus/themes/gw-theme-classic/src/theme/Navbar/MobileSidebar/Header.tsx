import React from "react";
import InitialNavbarMobileSidebarHeader from "@theme-init/Navbar/MobileSidebar/Header";
import GwSearchForm from "@theme/GwSearchForm";

export default function NavbarMobileSidebarHeader() {
  return (
    <>
      <InitialNavbarMobileSidebarHeader />
      <div style={{ padding: "1rem" }}>
        <GwSearchForm />
      </div>
    </>
  );
}
