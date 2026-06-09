
import { motion } from "framer-motion";
import { Activity, Bug, ShieldCheck, Users } from "lucide-react";
import StatCard from "./StatCard";
import { dashboardStats } from "../../data/adminEnterpriseData";

const icons = {
  bugs: Bug,
  active: Activity,
  quality: ShieldCheck,
  users: Users,
};

export default function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {dashboardStats.map((item, index) => {
        const Icon = icons[item.icon];
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <StatCard {...item} Icon={Icon} />
          </motion.div>
        );
      })}
    </div>
  );
}
