import { create } from 'zustand';
import { Project } from '@/types/project';

interface ProjectStore {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  removeProject: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  removeProject: (id) => 
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id)
    })),
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project]
    })),
  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) => 
        p.id === project.id ? project : p
      )
    }))
}));