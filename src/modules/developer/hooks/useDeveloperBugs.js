// useDeveloperBugs.js
import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, getDeveloperBugs, initializeDemoData } from '../services/developerService';

export const useDeveloperBugs = () => {
  const [bugs, setBugs]   = useState([]);
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setBugs(getDeveloperBugs(currentUser.id));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeDemoData();
    refresh();
  }, [refresh]);

  return { bugs, user, loading, refresh };
};
