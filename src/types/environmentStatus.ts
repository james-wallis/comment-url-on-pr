export enum EnvironmentStatus {
  // success, failure and cancelled are valid GitHub Action job.status
  Success = 'success',
  Failure = 'failure',
  Cancelled = 'cancelled',
  Building = 'building',
  Deleted = 'deleted'
}
