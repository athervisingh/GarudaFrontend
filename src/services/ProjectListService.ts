import { BehaviorSubject } from "rxjs";
import type { UserProject } from "../models/UserProjectsList";
import controller from "../classes/Controller";

const managedProjectsSubject = new BehaviorSubject<UserProject[]>([]);
const monitoredProjectsSubject = new BehaviorSubject<UserProject[]>([]);

export const projectListService = {
  // Expose observable for subscription
  managedProjects$: managedProjectsSubject.asObservable(),
  monitoredProjects$: monitoredProjectsSubject.asObservable(),

  // Call when project is created
  addProjectToUserLists() {
    const project = controller.getCurrentProject();
    if (!project) return;

    const userProject: UserProject = {
      projectID: project.getProjectID(),
      projectName: project.getProjectName(),
      role: "owner",
    };

    controller.addManagedProject(userProject);
    controller.addMonitoredProject(userProject);

    // Push updated arrays
    managedProjectsSubject.next([...controller.getManagedProjects()]);
    monitoredProjectsSubject.next([...controller.getMonitoredProjects()]);
  },
  updateManagedProjectsFromController(projects: UserProject[]) {
    managedProjectsSubject.next([...projects]);
  },
  updateMonitoredProjectsFromController(projects: UserProject[]) {
    monitoredProjectsSubject.next([...projects]);
  },
  reset() {
    managedProjectsSubject.next([]);
    monitoredProjectsSubject.next([]);
  }
};
