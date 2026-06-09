import {
  LayoutDashboard,
  Bug,
  BarChart3,
  BrainCircuit,
  GitBranch,
  FileText,
  Bell,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";

export const sidebarLinks = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bug Management",
    path: "/bugs",
    icon: Bug,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    title: "AI Analysis",
    path: "/ai-analysis",
    icon: BrainCircuit,
  },
  {
    title: "Workflow",
    path: "/workflow",
    icon: GitBranch,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    title: "Team Management",
    path: "/team-management",
    icon: Users,
  },
  {
    title: "Team Chat",
    path: "/team-chat",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];