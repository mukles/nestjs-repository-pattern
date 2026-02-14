export enum ClassStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
  INACTIVE = "inactive",
}

export const ClassStatus_VALUES = Object.values(ClassStatus) as [
  ClassStatus,
  ...ClassStatus[],
];
