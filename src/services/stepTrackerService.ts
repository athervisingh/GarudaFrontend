// src/services/stepTrackerService.ts
import { BehaviorSubject } from 'rxjs'

class StepTrackerService {
  private stepSubject = new BehaviorSubject<Set<number>>(new Set())

  // Observable for subscription
  step$ = this.stepSubject.asObservable()

  // Add completed step
  completeStep(stepId: number) {
    const current = new Set(this.stepSubject.value)
    current.add(stepId)
    this.stepSubject.next(current)
  }

  // Reset all steps
  resetSteps() {
    this.stepSubject.next(new Set())
  }

  // Get current step values (sync)
  getCompletedSteps(): Set<number> {
    return this.stepSubject.value
  }
}

export const stepTrackerService = new StepTrackerService()
