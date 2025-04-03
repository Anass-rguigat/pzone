import { AppSidebar } from '@/components/app-sidebar'
import { Navbar } from '@/Components/navbar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

export const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
            <Navbar />
            <main className='p-5'>
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  )
}
