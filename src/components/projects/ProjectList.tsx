import { Project } from '@/types/project';
import { useProjects } from '@/hooks/useProjects';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectListProps {
  userId: string;
  selectedProject: string | null;
  onSelectProject: (projectId: string) => void;
}

export function ProjectList({ userId, selectedProject, onSelectProject }: ProjectListProps) {
  const { projects } = useProjects(userId);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Projects</h2>
      
      <Select value={selectedProject || undefined} onValueChange={onSelectProject}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project: Project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}