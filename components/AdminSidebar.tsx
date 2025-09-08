import * as React from "react";

import { Shirt, Plus, ChartArea, UserRound, Hexagon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Metrics",
      items: [
        {
          title: "Overview",
          url: "/admin/overview",
        },
      ],
    },
    {
      title: "Users",
      items: [
        {
          title: "View users",
          url: "/admin/users",
        },
      ],
    },
    {
      title: "Products",
      items: [
        {
          title: "Products",
          url: "/admin/products",
        },
        {
          title: "Add product",
          url: "/admin/product/add",
        },
      ],
    },
    {
      title: "Warehouses",
      items: [
        {
          title: "Warehouses",
          url: "/admin/warehouse",
        },
        {
          title: "Add warehouse",
          url: "/admin/warehouse/add",
        },
      ],
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="mx-2 p-1 flex center-items font-semibold text-2xl">
          <Hexagon className="mr-2 mt-1 h-auto"></Hexagon>
          <h2>Vexo shop</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a className="font-medium font-base" href={item.url}>
                        {item.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
