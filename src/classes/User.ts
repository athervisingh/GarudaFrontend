// src/classes/User.ts

export default class User {
  private userID: string;
  private userName: string;
  private email: string;
  private profilePicture: string;
  private claim: string = '';

  constructor(userID: string, userName: string, email: string, profilePicture: string) {
    this.userID = userID;
    this.userName = userName;
    this.email = email;
    this.profilePicture = profilePicture;
  }

  // 🎯 Required Methods
  getUserName(): string {
    return this.userName;
  }
  getUserID(): string {
    return this.userID;
  }

  getProfilePicture(): string {
    return this.profilePicture;
  }

  setClaim(claim: string): void {
    this.claim = claim;
  }

  getClaim(): string {
    return this.claim;
  }
  getEmail(): string {
    return this.email;
  }
}
