import * as React from "react"
import {
  AudioWaveform,
  Bookmark,
  BookOpen,
  Bot,
  Command,
  Cpu,
  Frame,
  GalleryVerticalEnd,
  Map,
  Package,
  PieChart,
  Server,
  Settings2,
  SquareTerminal,
  Tag,
  Warehouse,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ScrollArea } from "./ui/scroll-area"

// This is sample data.
const data = {
  user: {
    id:1,
    name: "XZONE",
    email: "xzone@example.com",
    avatar: "/user.png",
  },
  teams: [
    {
      name: "XZONE ",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    
  ],
  navMain: [
    {
      title: "Brands",
      url: "#",
      icon: Bookmark,
      items: [
        {
          title: "Affichage Brands",
          url: "/brands/",
        },
        {
          title: "Ajoute Brand",
          url: "/brands/create",
        },
      ],
    },
    {
      title: "Composants", 
      url: "#",
      icon: Cpu,
      isActive: true,
      items: [
        {
          title: "Rams",
          url: "#",
          items: [
            {
              title: "Affichage Rams",
              url: "/rams/", 
            },
            {
              title: "Ajouter Ram", 
              url: "/rams/create/", 
            },
            
          ],
        },
        {
          title: "Disque Dur", 
          url: "#",
          items: [
            {
              title: "Affichage Disque Dur", 
              url: "/hard-drives/", 
            },
            {
              title: "Ajouter Disque Dur", 
              url: "/hard-drives/create/", 
            },
            
          ],
        },
        {
          title: "Processor", 
          url: "#",
          items: [
            {
              title: "Affichage Processors", 
              url: "/processors/", 
            },
            {
              title: "Ajouter Processor",
              url: "/processors/create", 
            },
            
          ],
        },
        {
          title: "Power-supplies", 
          url: "#",
          items: [
            {
              title: "Affichage Power supplies", 
              url: "/power-supplies/", 
            },
            {
              title: "Ajouter Power supplie", 
              url: "/power-supplies/create", 
            },
            
          ],
        },
        {
          title: "Motherboards", 
          url: "#",
          items: [
            {
              title: "Affichage Power motherboards", 
              url: "/motherboards/", 
            },
            {
              title: "Ajouter Power motherboard", 
              url: "/motherboards/create", 
            },
            
          ],
        },
        {
          title: "Network Cards", 
          url: "#",
          items: [
            {
              title: "Affichage Network Cards", 
              url: "/network-cards/", 
            },
            {
              title: "Ajouter Network Card", 
              url: "/network-cards/create", 
            },
            
          ],
        },
        {
          title: "Raid Controllers", 
          url: "#",
          items: [
            {
              title: "Affichage Raid Controllers", 
              url: "/raid-controllers/", 
            },
            {
              title: "Ajouter Raid Controller", 
              url: "/raid-controllers/create", 
            },
            
          ],
        },
        {
          title: "Cooling Solutions", 
          url: "#",
          items: [
            {
              title: "Affichage Cooling Solutions", 
              url: "/cooling-solutions/", 
            },
            {
              title: "Ajouter Cooling Solution", 
              url: "/cooling-solutions/create", 
            },
            
          ],
        },
        {
          title: "Chassis", 
          url: "#",
          items: [
            {
              title: "Affichage Chassis", 
              url: "/chassis/", 
            },
            {
              title: "Ajouter Chassis", 
              url: "/chassis/create", 
            },
            
          ],
        },
        {
          title: "Graphic Cards", 
          url: "#",
          items: [
            {
              title: "Affichage Graphic Cards", 
              url: "/graphic-cards/", 
            },
            {
              title: "Ajouter Graphic Card", 
              url: "/graphic-cards/create", 
            },
            
          ],
        },
        {
          title: "Fiber Optic Cards", 
          url: "#",
          items: [
            {
              title: "Affichage Fiber Optic Cards", 
              url: "/fiber-optic-cards/", 
            },
            {
              title: "Ajouter Fiber Optic Card", 
              url: "/fiber-optic-cards/create", 
            },
            
          ],
        },
        {
          title: "Expansion Cards", 
          url: "#",
          items: [
            {
              title: "Affichage Fiber Expansion Cards", 
              url: "/expansion-cards/", 
            },
            {
              title: "Ajouter Fiber Expansion Card", 
              url: "/expansion-cards/create", 
            },
            
          ],
        },
        {
          title: "Batteries", // Changed from "History" to "Battery"
          url: "#",
          items: [
            {
              title: "Affichage Batteries", // New item for displaying the batteries
              url: "/batteries/", // Update the URL for the battery display page
            },
            {
              title: "Ajouter Battery", // New item for adding a battery
              url: "/batteries/create", // Update the URL for the battery addition page
            },
            
          ],
        },
        {
          title: "cables", // Changed from "History" to "Battery"
          url: "#",
          items: [
            {
              title: "Affichage cables", // New item for displaying the batteries
              url: "/cable-connectors/", // Update the URL for the battery display page
            },
            {
              title: "Ajouter cable", // New item for adding a battery
              url: "/cable-connectors/create", // Update the URL for the battery addition page
            },
            
          ],
        },
      ],
      
    },
    {
      title: "Servers",
      url: "#",
      icon: Server,
      items: [
        {
          title: "Affichage servers", // Changed from "History" to "Battery"
          url: "/servers/",
          
        },
        {
          title: "Ajouter servers", // Changed from "History" to "Battery"
          url: "/servers/create",
          
        },
      ]
    },
    {
      title: "Discount", 
      url: "#",
      icon: Tag,
      isActive: true,
      items: [
        {
          title: "Servers",
          url: "#",
          items: [
            {
              title: "Affichage Servers",
              url: "/discounts/", 
            },
            {
              title: "Ajouter Servers", 
              url: "/discounts/create/", 
            },
            
          ],
        },
        {
          title: "Composants", 
          url: "#",
          items: [
            {
              title: "Affichage Composants", 
              url: "/discountComponents/", 
            },
            {
              title: "Ajouter Composants", 
              url: "/discountComponents/create/", 
            },
            
          ],
        },
        
      ],
      
    },
    {
      title: "Fournisseurs",
      url: "#",
      icon: Package,
      items: [
        {
          title: "Affichage Fournisseurs",
          url: "/suppliers/",
        },
        {
          title: "Ajoute Fournisseurs",
          url: "/suppliers/create",
        },
      ],
    },
    {
      title: "Stock", 
      url: "#",
      icon: Warehouse,
      isActive: true,
      items: [
        {
          title: "Mouvement",
          url: "#",
          items: [
            {
              title: "Affichage ",
              url: "/stock-movements/", 
            },
            {
              title: "Ajouter", 
              url: "/stock-movements/create/", 
            },
            
          ],
        },
        {
          title: "Levels", 
          url: "/stock-levels/",
        },
        
      ],
      
    },
  ],
  projects: [
    {
      name: "Sales & Marketing",
      url: "/dashboard",
      icon: PieChart,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
      <ScrollArea>
          <NavProjects projects={data.projects} />
          <NavMain items={data.navMain} />
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
