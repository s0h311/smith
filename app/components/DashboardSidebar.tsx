import { Link } from '@tanstack/react-router'
import { Home, User } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavUser } from '@/components/ui/nav-user'
import { authClient } from '@/libs/Auth/authClient'

export function DashboardSidebar() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to='/dashboard'
                    activeOptions={{ exact: true }}
                    activeProps={{
                      className: 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
                    }}
                  >
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to='/dashboard/profile'
                    activeProps={{
                      className: 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
                    }}
                  >
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.image || '',
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
