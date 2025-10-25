import { useState, useEffect } from 'react';
import { User, Project, Activity } from '@/types';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function createUser(userData: Partial<User>): User {
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: userData.name || '',
    email: userData.email || '',
    phone: userData.phone || '',
    avatar: userData.avatar || '',
    institutions: userData.institutions || [],
    role: userData.role || 'designer_internal',
    status: userData.status || 'active',
    createdAt: userData.createdAt || new Date(),
    updatedAt: userData.updatedAt || new Date(),
  };
  return user;
}

export function createProject(projectData: Partial<Project>): Project {
  const project: Project = {
    id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: projectData.title || '',
    type: projectData.type || 'poster',
    size: projectData.size || '',
    quantity: projectData.quantity || 1,
    deadline: projectData.deadline || new Date(),
    institution: projectData.institution || { id: '', name: '', type: 'pondok' },
    status: projectData.status || 'draft',
    assignee: projectData.assignee,
    reviewer: projectData.reviewer,
    approver: projectData.approver,
    createdBy: projectData.createdBy || {
      id: '',
      name: '',
      email: '',
      institutions: [],
      role: 'requester',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: projectData.createdAt || new Date(),
    updatedAt: projectData.updatedAt || new Date(),
    version: projectData.version || 1,
    description: projectData.description,
    brief: projectData.brief,
    attachments: projectData.attachments || [],
    finalProof: projectData.finalProof,
    currentProof: projectData.currentProof,
  };
  return project;
}

export function useUsers() {
  const [users, setUsers] = useLocalStorage<User[]>('designflow_users', []);
  return { users, setUsers };
}

export function useProjects() {
  const [projects, setProjects] = useLocalStorage<Project[]>('designflow_projects', []);
  return { projects, setProjects };
}

export function useActivities() {
  const [activities, setActivities] = useLocalStorage<Activity[]>('designflow_activities', []);
  return { activities, setActivities };
}

export function useDesignRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  return { requests, setRequests };
}

export function useDesignItems() {
  const [items, setItems] = useState<any[]>([]);
  return { items, setItems };
}
