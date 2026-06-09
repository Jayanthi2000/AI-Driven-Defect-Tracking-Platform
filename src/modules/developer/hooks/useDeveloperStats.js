// useDeveloperStats.js
import { useState, useEffect } from 'react';
import { getCurrentUser, getDeveloperStats, initializeDemoData } from '../services/developerService';

export const useDeveloperStats = () => {
  const [stats, setStats] = useState({
    assigned: 0, open: 0, inProgress: 0,
    fixed: 0, readyForTesting: 0, completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDemoData();
    const user = getCurrentUser();
    if (user) setStats(getDeveloperStats(user.id));
    setLoading(false);
  }, []);

  return { stats, loading };
};
