"use client"

import Link from "next/link";
import { ModeToggle } from "@/components/ThemeSwitcher";
import { Button } from "./ui/button";
import { usePathname  } from "next/navigation";

export default function NavbarTop() {
  const pathname = usePathname();
  return (
    <header className=" flex justify-between items-center gap-2 p-[2em]">
      <div>
        <Link href="/">
          <Button variant="link" className={` ${pathname === "/" ? "underline" : ""}`}>Home</Button>
        </Link>
        <Link href="/product">
          <Button variant="link" className={` ${pathname === "/product" ? "underline" : ""}`}>Product</Button>
        </Link>
        <Link href="/product/addItem">
          <Button variant="link" className={` ${pathname === "/product/addItem" ? "underline" : ""}`}>Add</Button>
        </Link>
        <Link href="/product/upload">
          <Button variant="link" className={` ${pathname === "/product/upload" ? "underline" : ""}`}>Upload</Button>
        </Link>
      </div>
      <div className="flex items-center gap-x-2">
        <h1>You can do it.</h1>
        <ModeToggle />
      </div>
    </header>
  );
}
