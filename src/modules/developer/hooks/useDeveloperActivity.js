// useDeveloperActivity.js
import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, getDeveloperActivities, initializeDemoData } from '../services/developerService';

export const useDeveloperActivity = () => {
  const [activities, setActivities] = useState([]);
  const [user, setUser]             = useState(null);
  const [loading, setLoading]       = useState(true);

  const refresh = useCallback(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setActivities(getDeveloperActivities(currentUser.id));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeDemoData();
    refresh();
  }, [refresh]);

  return { activities, user, loading, refresh };
};
