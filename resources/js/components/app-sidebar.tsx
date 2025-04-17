import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, LogOut, Settings } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: route('dashboard.home'),
        icon: LayoutGrid,
    },
    {
        title: 'Questions',
        href: route('dashboard.questions.index'),
        icon: Folder,
    },
    {
        title: 'Assessments',
        href: route('dashboard.assessments'),
        icon: BookOpen,
    },
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
    {
        title: 'Logout',
        href: route('dashboard.logout'),
        icon: LogOut,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <div className="text-muted-foreground text-xs">
                    <p>
                        &copy; {new Date().getFullYear()} Built by{' '}
                        <a href="https://github.com/osamfrimpong" className="hover:underline">
                            Osam-Frimpong
                        </a>
                    </p>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
