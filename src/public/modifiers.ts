import * as Types from "../types";

export const Default = <
  T extends Types.Fields.Primitive,
  K extends Types.TypeData[T]["default"]
>(
  value: K
): Types.Modifier<T, "default"> => ({ type: "default", value });

export const Unique = {
  type: "unique",
  value: true,
} as const;

export const UpdatedAt = {
  type: "updatedAt",
  value: true,
} as const;

export const Nullable = {
  type: "nullable",
  value: true,
} as const;

export const Index = {
  type: "index",
  value: true,
} as const;

export const Limit = <K extends Types.TypeData["Varchar"]["limit"]>(
  value: K
): Types.Modifier<"Varchar", "limit"> => ({ type: "limit", value });
