import { useEffect } from 'react';
import { storage } from '@/lib/storage';
import { useProjectStore } from './useProjectStore';

export function useProjects() {
  const { projects, setProjects } = useProjectStore();

  useEffect(() => {
    const load = () => setProjects(storage.listFolders());
    load();

    // Pick up changes made in other tabs
    return storage.subscribe(load);
  }, [setProjects]);

  return { projects, loading: false };
}
