export enum BatchStatus {
  DRAFT = "draft", // Created but not published
  OPEN = "open", // Enrollment allowed
  CLOSED = "closed", // Enrollment closed
  ONGOING = "ongoing", // Class started
  COMPLETED = "completed", // Batch finished
  CANCELLED = "cancelled", // Batch cancelled
}
