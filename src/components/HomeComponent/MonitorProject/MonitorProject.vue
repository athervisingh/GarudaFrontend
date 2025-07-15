<template>
  <div class="manage-container">
    <!-- Full-width Heading -->
    <div class="heading">Monitor Projects</div>

    <!-- Search Box -->
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search Project"
        class="search-input"
      />
      <img
        src="/images/search_icon.png"
        alt="Search"
        class="search-icon"
      />
    </div>

    <!-- Project List (Scrollable) -->
    <div class="project-list">
      <div
        v-for="(project, index) in filteredProjects"
        :key="project.projectID"
        @click="handleProjectClick(project)"
        class="project-item"
      >
        <div class="project-left">
          <span class="project-index">{{ index + 1 }}</span>
          <div>
            <div class="project-name">{{ project.projectName }}</div>
            <div class="project-role">Role: {{ project.role }}</div>
          </div>
        </div>

        <!-- Circular button with PNG arrow -->
        <div class="arrow-circle">
          <img
            src="/images/arrow-right.png"
            alt="Go"
            class="arrow-img"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { projectListService } from "../../../services/ProjectListService";
import type { UserProject } from "../../../models/UserProjectsList";
import { Subscription } from "rxjs";

const searchQuery = ref("");
const monitoredProjects = ref<UserProject[]>([]);

let sub: Subscription;

onMounted(() => {
  sub = projectListService.monitoredProjects$.subscribe((projects) => {
    monitoredProjects.value = projects;
  });
});

onBeforeUnmount(() => {
  sub?.unsubscribe();
});

const filteredProjects = computed(() =>
  monitoredProjects.value.filter((project) => {
    const query = searchQuery.value.trim().toLowerCase();
    return (
      project.projectName.toLowerCase().includes(query) ||
      project.role.toLowerCase().includes(query)
    );
  })
);

function handleProjectClick(project: UserProject) {
  console.log("🔍 Selected Project:", project.projectID);
  // Future: navigationService.goToProject(project.projectID)
}
</script>


<style scoped>
.manage-container {
  min-height: 100vh;
  background-color: #f2f3f8;
  padding-top: 4rem;
  padding-bottom: 1rem;
}

/* Full-width heading */
.heading {
  width: 100%;
  text-align: center;
  font-weight: bold;
  font-size: 1.25rem;
  background-color: #c09201;
  color: white;
  padding: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Search Box */
.search-box {
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  background: white;
  padding: 0.5rem 0.75rem;
  border: 2px solid #2563eb;
  border-radius: 6px;
  max-width: 700px;
  width: calc(100% - 40px); /* responsive padding */
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.9rem;
  border: none;
  outline: none;
}

.search-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* List scrollable */
.project-list {
  margin-top: 0.5rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 700px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 4px;
  width: calc(100% - 40px); /* responsive */
}

/* Scrollbar */
.project-list::-webkit-scrollbar {
  width: 6px;
}
.project-list::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
.project-list::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Project item */
.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: 0.2s ease;
  cursor: pointer;
  margin-bottom: 0.75rem;
}

.project-item:hover {
  background-color: #e0f2fe;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
}

.project-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.project-index {
  font-weight: bold;
  font-size: 1rem;
  color: #01b0ef;
}

.project-name {
  color: #394a7e;
  font-weight: 700;
  font-size: 0.95rem;
}

.project-role {
  font-size: 0.75rem;
  color: gray;
}

/* Arrow icon circle */
.arrow-circle {
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;
}

.arrow-circle:hover {
  background-color: #e0f2fe;
}

.arrow-img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}
</style>
