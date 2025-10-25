import { User, Project, Activity } from '@/types';
import { 
  canViewProject, 
  canEditProject, 
  canCreateProject,
  canReviewProject,
  canApproveProject 
} from '@/lib/permissions';

/**
 * Database Service Layer
 * Handles all database operations with permission checking and caching
 */

// Simulate database with localStorage
const DB_KEYS = {
  USERS: 'designflow_users',
  PROJECTS: 'designflow_projects',
  ACTIVITIES: 'designflow_activities',
  INSTITUTIONS: 'designflow_institutions',
  PROOFS: 'designflow_proofs',
  REVIEWS: 'designflow_reviews',
};

/**
 * USERS SERVICE
 */
export const usersService = {
  // Get all users (only admin can see all)
  getAll: (currentUser: User): User[] => {
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admin can view all users');
    }
    return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
  },

  // Get user by ID
  getById: (id: string, currentUser: User): User | null => {
    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    const user = users.find((u: User) => u.id === id);
    
    // Can view yourself or if admin
    if (user && (user.id === currentUser.id || currentUser.role === 'admin')) {
      return user;
    }
    
    throw new Error('Unauthorized: Cannot view this user');
  },

  // Create user
  create: (userData: Partial<User>): User => {
    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'requester',
      status: 'active',
      institutions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData,
    };
    
    users.push(newUser);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  // Update user
  update: (id: string, updates: Partial<User>, currentUser: User): User => {
    // Can only update yourself unless admin
    if (id !== currentUser.id && currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Cannot update other users');
    }

    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    const index = users.findIndex((u: User) => u.id === id);
    
    if (index === -1) throw new Error('User not found');
    
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return users[index];
  },
};

/**
 * PROJECTS SERVICE
 */
export const projectsService = {
  // Get all projects user has access to
  getAll: (currentUser: User): Project[] => {
    const projects = JSON.parse(localStorage.getItem(DB_KEYS.PROJECTS) || '[]');
    
    // Filter based on permissions
    return projects.filter((project: Project) => {
      try {
        return canViewProject(project, currentUser);
      } catch {
        return false;
      }
    });
  },

  // Get project by ID with permission check
  getById: (id: string, currentUser: User): Project | null => {
    const projects = JSON.parse(localStorage.getItem(DB_KEYS.PROJECTS) || '[]');
    const project = projects.find((p: Project) => p.id === id);
    
    if (!project) return null;
    
    if (canViewProject(project, currentUser)) {
      return project;
    }
    
    throw new Error('Unauthorized: Cannot view this project');
  },

  // Create project
  create: (projectData: Partial<Project>, currentUser: User): Project => {
    if (!canCreateProject(currentUser)) {
      throw new Error('Unauthorized: Cannot create projects');
    }

    const projects = JSON.parse(localStorage.getItem(DB_KEYS.PROJECTS) || '[]');
    const newProject: Project = {
      id: Math.random().toString(36).substring(7),
      title: projectData.title || 'Untitled',
      type: projectData.type || 'poster',
      size: projectData.size || 'A4',
      quantity: projectData.quantity || 1,
      deadline: projectData.deadline || new Date(),
      status: 'draft' as const,
      version: 1,
      createdBy: currentUser,
      institution: projectData.institution || { id: '', name: '', type: 'lainnya' },
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...projectData,
    };
    
    projects.push(newProject);
    localStorage.setItem(DB_KEYS.PROJECTS, JSON.stringify(projects));
    
    // Log activity
    activitiesService.log(
      {
        type: 'project_created',
        description: `Created project "${newProject.title}"`,
        userId: currentUser.id,
        projectId: newProject.id,
      },
      currentUser
    );

    return newProject;
  },

  // Update project
  update: (id: string, updates: Partial<Project>, currentUser: User): Project => {
    const project = projectsService.getById(id, currentUser);
    if (!project) throw new Error('Project not found');
    
    if (!canEditProject(project, currentUser)) {
      throw new Error('Unauthorized: Cannot edit this project');
    }

    const projects = JSON.parse(localStorage.getItem(DB_KEYS.PROJECTS) || '[]');
    const index = projects.findIndex((p: Project) => p.id === id);
    
    if (index === -1) throw new Error('Project not found');
    
    projects[index] = { ...projects[index], ...updates, version: (project.version || 0) + 1 };
    localStorage.setItem(DB_KEYS.PROJECTS, JSON.stringify(projects));

    // Log activity
    activitiesService.log(
      {
        type: 'project_updated',
        description: `Updated project "${projects[index].title}"`,
        userId: currentUser.id,
        projectId: id,
      },
      currentUser
    );

    return projects[index];
  },

  // Delete project
  delete: (id: string, currentUser: User): void => {
    const project = projectsService.getById(id, currentUser);
    if (!project) throw new Error('Project not found');

    if (project.createdBy.id !== currentUser.id && currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Cannot delete this project');
    }

    let projects = JSON.parse(localStorage.getItem(DB_KEYS.PROJECTS) || '[]');
    projects = projects.filter((p: Project) => p.id !== id);
    localStorage.setItem(DB_KEYS.PROJECTS, JSON.stringify(projects));

    // Log activity
    activitiesService.log(
      {
        type: 'project_deleted',
        description: `Deleted project "${project.title}"`,
        userId: currentUser.id,
        projectId: id,
      },
      currentUser
    );
  },

  // Assign designer
  assignDesigner: (projectId: string, designerId: string, currentUser: User): Project => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'approver') {
      throw new Error('Unauthorized: Cannot assign projects');
    }

    const project = projectsService.getById(projectId, currentUser);
    if (!project) throw new Error('Project not found');

    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    const designer = users.find((u: User) => u.id === designerId);
    if (!designer) throw new Error('Designer not found');

    return projectsService.update(projectId, { assignee: designer }, currentUser);
  },

  // Assign reviewer
  assignReviewer: (projectId: string, reviewerId: string, currentUser: User): Project => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'approver') {
      throw new Error('Unauthorized: Cannot assign reviewers');
    }

    const project = projectsService.getById(projectId, currentUser);
    if (!project) throw new Error('Project not found');

    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    const reviewer = users.find((u: User) => u.id === reviewerId);
    if (!reviewer) throw new Error('Reviewer not found');

    return projectsService.update(projectId, { reviewer }, currentUser);
  },

  // Change project status
  changeStatus: (projectId: string, newStatus: string, currentUser: User): Project => {
    const project = projectsService.getById(projectId, currentUser);
    if (!project) throw new Error('Project not found');

    // Validate status transitions based on role
    const role = currentUser.role;
    
    if (role === 'designer_internal' || role === 'designer_external') {
      if (newStatus !== 'ready_for_review') {
        throw new Error('Designers can only mark projects as ready_for_review');
      }
    } else if (role === 'reviewer') {
      if (!['changes_requested', 'approved'].includes(newStatus)) {
        throw new Error('Reviewers can only approve or request changes');
      }
    } else if (role === 'approver') {
      if (!['approved_for_print', 'changes_requested'].includes(newStatus)) {
        throw new Error('Approvers can only approve or request changes');
      }
    }

    return projectsService.update(projectId, { status: newStatus as any }, currentUser);
  },
};

/**
 * ACTIVITIES SERVICE
 */
export const activitiesService = {
  // Get recent activities (with permission filtering)
  getRecent: (limit: number = 10, currentUser?: User): Activity[] => {
    const activities = JSON.parse(localStorage.getItem(DB_KEYS.ACTIVITIES) || '[]');
    
    // If no current user, return all
    if (!currentUser) return activities.slice(0, limit);
    
    // Filter activities based on permissions
    return activities
      .filter((activity: Activity) => {
        // See own activities always
        if (activity.userId === currentUser.id) return true;
        
        // Admin sees all
        if (currentUser.role === 'admin') return true;
        
        // If related to project you have access to
        if (activity.projectId) {
          try {
            const project = projectsService.getById(activity.projectId, currentUser);
            return !!project;
          } catch {
            return false;
          }
        }
        
        return false;
      })
      .slice(0, limit);
  },

  // Log activity
  log: (activityData: Partial<Activity>, currentUser: User): Activity => {
    const activities = JSON.parse(localStorage.getItem(DB_KEYS.ACTIVITIES) || '[]');
    
    const newActivity: Activity = {
      id: Math.random().toString(36).substring(7),
      type: activityData.type || 'system',
      description: activityData.description || '',
      userId: activityData.userId || currentUser.id,
      projectId: activityData.projectId,
      metadata: activityData.metadata,
      createdAt: new Date(),
      user: currentUser,
    };

    activities.unshift(newActivity);
    // Keep only last 1000 activities
    if (activities.length > 1000) activities.pop();
    
    localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify(activities));
    return newActivity;
  },
};

/**
 * STATISTICS SERVICE
 */
export const statsService = {
  getDashboardStats: (currentUser: User) => {
    const projects = projectsService.getAll(currentUser);
    
    const stats = {
      totalProjects: projects.length,
      projectsByStatus: {} as Record<string, number>,
      upcomingDeadlines: projects
        .filter((p: Project) => new Date(p.deadline) > new Date())
        .sort((a: Project, b: Project) => 
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        )
        .slice(0, 5),
      myTasks: {
        pendingReview: 0,
        pendingApproval: 0,
        needsDesign: 0,
        readyToPrint: 0,
      },
    };

    // Count by status
    projects.forEach((p: Project) => {
      stats.projectsByStatus[p.status] = (stats.projectsByStatus[p.status] || 0) + 1;
    });

    // Count tasks based on role
    const role = currentUser.role;
    if (role === 'reviewer') {
      stats.myTasks.pendingReview = projects.filter(
        (p: Project) => p.status === 'ready_for_review'
      ).length;
    } else if (role === 'designer_internal' || role === 'designer_external') {
      stats.myTasks.needsDesign = projects.filter(
        (p: Project) => p.assignee?.id === currentUser.id && p.status === 'designing'
      ).length;
    } else if (role === 'approver') {
      stats.myTasks.pendingApproval = projects.filter(
        (p: Project) => p.status === 'ready_for_review'
      ).length;
    }

    return stats;
  },
};
