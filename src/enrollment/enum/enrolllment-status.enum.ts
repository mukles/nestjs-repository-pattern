export enum EnrollmentStatus {
  ACTIVE = 'active', // currently enrolled
  COMPLETED = 'completed', // successfully finished the course
  DROPPED = 'dropped', // left the course before completion
  SUSPENDED = 'suspended', // temporarily not attending
  WITHDRAWN = 'withdrawn', // formally left the course
}
