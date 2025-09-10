import { BehaviorSubject } from 'rxjs'

type ViewKey =
  | 'login'
  | 'home'
  | 'add-project'
  | 'manage-projects'
  | 'monitor-projects'
  | 'project-basic-info-popup'
  | 'define-aoi-map'
  | 'add-users'

const currentView$ = new BehaviorSubject<ViewKey>('login')

// ✅ Add history stack
const historyStack: ViewKey[] = []

const navigationService = {
  currentView$,

  goTo(view: ViewKey) {
    const current = currentView$.value
    if (current && current !== view) {
      historyStack.push(current) // ⬅️ Save current view before switching
    }
    currentView$.next(view)
  },

  goBack() {
    const previous = historyStack.pop()
    if (previous) {
      currentView$.next(previous)
    }
  },

  getCurrentView(): ViewKey {
    return currentView$.value
  },

  canGoBack(): boolean {
    return historyStack.length > 0
  }
}

export default navigationService
export type { ViewKey }
