import { useState, useEffect } from 'react';
import { Project, Activity, User } from '@/types';

export function useLocalDatabase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('designflow_projects');
      const storedActivities = localStorage.getItem('designflow_activities');
      const storedUsers = localStorage.getItem('designflow_users');

      if (storedProjects) setProjects(JSON.parse(storedProjects));
      if (storedActivities) setActivities(JSON.parse(storedActivities));
      if (storedUsers) setUsers(JSON.parse(storedUsers));
    } catch (err) {
      setError('Failed to load data from localStorage');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProject = (project: Project) => {
    try {
      const updatedProjects = [...projects.filter(p => p.id !== project.id), project];
      setProjects(updatedProjects);
      localStorage.setItem('designflow_projects', JSON.stringify(updatedProjects));
    } catch (err) {
      setError('Failed to save project');
    }
  };

  const deleteProject = (projectId: string) => {
    try {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem('designflow_projects', JSON.stringify(updatedProjects));
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  const saveActivity = (activity: Activity) => {
    try {
      const updatedActivities = [...activities.filter(a => a.id !== activity.id), activity];
      setActivities(updatedActivities);
      localStorage.setItem('designflow_activities', JSON.stringify(updatedActivities));
    } catch (err) {
      setError('Failed to save activity');
    }
  };

  return {
    projects,
    activities,
    users,
    isLoading,
    error,
    saveProject,
    deleteProject,
    saveActivity,
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('designflow_projects');
      if (storedProjects) setProjects(JSON.parse(storedProjects));
    } catch (err) {
      console.error('Failed to load projects');
    }
  }, []);

  return { projects, setProjects };
}

export function useActivities(limit?: number) {
  const [activities, setActivities] = useState<Activity[]>([]);
  
  useEffect(() => {
    try {
      const storedActivities = localStorage.getItem('designflow_activities');
      if (storedActivities) {
        const allActivities = JSON.parse(storedActivities);
        if (limit) {
          setActivities(allActivities.slice(0, limit));
        } else {
          setActivities(allActivities);
        }
      }
    } catch (err) {
      console.error('Failed to load activities');
    }
  }, [limit]);

  return { activities, setActivities };
}
