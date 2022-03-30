import { TypeData, Modifier, PrimitiveType, Type, AnyType } from "./models";

export const Default = <
  T extends PrimitiveType,
  K extends TypeData[T]["default"]
>(
  value: K
): Modifier<T, "default"> => ({ type: "default", value });

export const Nullable = <T extends AnyType>(): Modifier<T, "nullable"> => ({
  type: "nullable",
  value: true,
});
