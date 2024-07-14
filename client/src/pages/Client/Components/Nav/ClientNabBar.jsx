import React from "react";
import Container from "./Container";
import { Link } from "react-router-dom";

export default function ClientNabBar() {
  return (
    <div className="Sticky top-0 w-full bg-slate-200 z-30 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Link href="/"> E-Com-Innovation-Web-Logo</Link>
            <div className="hidden md:block">search</div>
            <div className="flex items-center gap-8 md-gap-12">
              <div>Cart</div>
              <div>UserMenue</div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
