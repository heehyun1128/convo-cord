"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { SignOutButton} from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { User2Icon } from "lucide-react";
import Link from "next/link";
import { NewDirectMessage } from "./new-direct-message";
import { usePathname } from "next/navigation";


export const DashboardSidebar = () => {
  const user = useQuery(api.functions.user.get);
 

  const directMessages = useQuery(api.functions.dm.list)
  const path=usePathname()
  if (user === undefined || user === null) {
    return null;
  }

  if (!user) {
    return <p>No user data available</p>;
  }
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={path==="/"}>
                  <div>
                    <User2Icon />
                    <p className="font-bold text-md">Friends</p>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroup>
            <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
            <NewDirectMessage />
            <SidebarGroupContent>
              <SidebarMenu>
                {directMessages?.map((dm) => (
                  <SidebarMenuItem key={dm._id}>
                    <SidebarMenuButton asChild isActive={path===`dms/${dm._id}`}>
                     <Link href={`dms/${dm._id}`}>
                     <Avatar className="size-6">
                        <AvatarImage src={dm.user.image} />
                        <AvatarFallback>{dm.user.username[0]}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium">{dm.user.username}</p></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className=" bg-zinc-200 border-zinc-300">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="flex items-center ">
                      <Avatar className="size-6">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium">{user.username}</p>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <SignOutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};
