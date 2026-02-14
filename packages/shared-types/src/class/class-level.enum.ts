export enum ClassLevel {
  NURSERY = "nursery",
  KINDERGARTEN = "kindergarten",
  PRIMARY = "primary",
  MIDDLE = "middle",
  SECONDARY = "secondary",
  HIGHER_SECONDARY = "higher_secondary",
}

export const ClassLevel_VALUES = Object.values(ClassLevel) as [
  ClassLevel,
  ...ClassLevel[],
];
