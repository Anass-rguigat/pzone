

import React from "react"
import { usePage } from "@inertiajs/react"
import { SidebarTrigger } from "./ui/sidebar"
import { NavUser } from "./nav-user"
import { User } from "@/types"

export const Navbar = () => {
  const { props } = usePage() // ✅ Get page props from Inertia.js
  const user: User = props.auth.user // ✅ Get the authenticated user

  return (
    <header className="stocky z-10 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur top-0 flex shrink-0 items-center gap-2 border-b h-16 px-3">
      <SidebarTrigger />
      <div className="ml-auto">
        {user ? <NavUser isNavbar btnClassName="hover:bg-transaparent focus-visible:ring-0" user={user} /> : <p>Loading...</p>}
      </div>
    </header>
  )
}
