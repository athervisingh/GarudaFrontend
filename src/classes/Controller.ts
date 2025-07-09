// src/classes/Controller.ts
import User from "../models/User";
import { ProjectBuilder } from "../builder/ProjectBuilder";
import { BackendAPI } from "../services/BackendAPIService";

import type { Project } from "../models/Poject";
class Controller {
  private isLogin: boolean;
  private currentUser: User | null;
  private currentYear: number;
  private projectBuilder: ProjectBuilder | null = null;
  private currentProject: Project | null = null;

  // getCurrentProject(): Project | null {
  //   return this.currentProject;
  // }

  constructor() {
    this.isLogin = false;
    this.currentUser = null;
    this.currentYear = new Date().getFullYear();
  }

  init(): void {
    this.isLogin = true;

    const user = new User(
      "U001",
      "Athervi Singh",
      "athervi@example.com",
      "/images/profile.jpg"
    );
    user.setClaim("owner");

    this.currentUser = user;
  }

  isUserLoggedIn(): boolean {
    return this.isLogin;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // 🎯 Shortcut methods from user object
  getUserName(): string {
    return this.currentUser?.getUserName() ?? "";
  }

  getUserProfilePicture(): string {
    return this.currentUser?.getProfilePicture() ?? "";
  }

  getCurrentYear(): number {
    return this.currentYear;
  }

  // Project Initialization

  initializeProject(): void {
    this.projectBuilder = new ProjectBuilder();
  }

  // project Step Methods

  /**
   * 🔹 Set basic project name and userId
   */
  setBasicInfo(projectName: string): void {
    if (!this.projectBuilder) {
      throw new Error("ProjectBuilder not initialized.");
    }
    if (!this.currentUser) {
      throw new Error("User not logged in.");
    }
    const userId = this.currentUser.getUserID();
    this.projectBuilder.addBasicInfo(projectName, userId);
  }

  /**
   * 🔹 Set auxiliary key-value pair
   */
  setProjectAuxField(key: string, value: string): void {
    if (!this.projectBuilder) {
      throw new Error("ProjectBuilder not initialized.");
    }
    this.projectBuilder.addProjectAuxField(key, value);
  }

  /**
   * 🔹 Submit basic info to backend and receive project ID
   */
  async submitBasicInfoAndGetProjectId(): Promise<void> {
    if (!this.projectBuilder) {
      throw new Error("ProjectBuilder not initialized.");
    }

    const basicInfo = this.projectBuilder.getBasicInfo(); // already returns JSON

    const { projectID } = await BackendAPI.submitBasicInfoAndFetchProjectID(
      basicInfo
    );

    this.projectBuilder.addProjectID(projectID);
  }

  setAOI(name: string, wkt: string): void {
    if (!this.projectBuilder)
      throw new Error("ProjectBuilder not initialized.");
    this.projectBuilder.addAOI(name, wkt);
  }

  setAOIAuxField(key: string, value: string): void {
    if (!this.projectBuilder)
      throw new Error("ProjectBuilder not initialized.");
    this.projectBuilder.addAOIAuxFieldToLastAOI(key, value);
  }

  async submitAOIsAndGetAOIIDs(): Promise<void> {
    if (!this.projectBuilder)
      throw new Error("ProjectBuilder not initialized.");

    const aois = this.projectBuilder.getAOIs();
    const response = await BackendAPI.submitAOIsAndFetchAOIIDs(aois);
    const aoiIDs: string[] = await response.json(); // Adjust this line if the response shape is different
    console.log("Received AOI IDs:", aoiIDs);
    this.projectBuilder.addAOIIds(aoiIDs);
  }

  buildFinalProject(): void {
    if (!this.projectBuilder) {
      throw new Error("ProjectBuilder not initialized.");
    }

    const project = this.projectBuilder.build(); // ✅ call builder's build()
    this.currentProject = project; // ✅ store in currentProject
    console.log("✅ Final Project Built:", project);
  }

  // Inside Controller.ts
async addProjectUsers(users: { userId: string; userName: string; role: string }[]): Promise<void> {
    if (!this.currentProject) {
      throw new Error("Current project not initialized.");
    }
    if(!this.projectBuilder) {
      throw new Error("ProjectBuilder not initialized.");
    }
const projectId = this.projectBuilder.getProjectID();
    users.forEach(user => {
      this.currentProject!.setProjectUsers(user.userId, user.userName, user.role);
    });
     await BackendAPI.submitProjectUsers(users, projectId);

    
  }
}



const controller = new Controller();
controller.init();

export default controller;
