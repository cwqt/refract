import * as Types from "../types";

export class Enum<K extends readonly string[]>
  extends Function
  implements Types.Blocks.Block<"enum">
{
  type: "enum" = "enum";
  columns: Types.Blocks.Model["columns"];

  constructor(public name: string, keys: K) {
    super();

    this.columns = keys.map(
      (k) =>
        ({
          name: k,
          type: "Enum",
          modifiers: [],
        } as Types.Column<"Enum">)
    );

    return new Proxy(this, {
      apply: (
        target,
        _,
        args: [K[number] | null, ...Types.Modifier<"Enum">[]]
      ) =>
        target._call(
          args[0] as K[number],
          ...(args.slice(1, args.length - 1) as Types.Modifier<"Enum">[])
        ),
    });
  }

  _call(
    initial: K[number] | null,
    ...modifiers: Types.Modifier<"Enum">[]
  ): Types.Fields.Field<"Enum"> {
    return {
      type: "Enum",
      modifiers: [
        { type: "enum", value: this.name },
        initial
          ? { type: "default", value: initial }
          : { type: "nullable", value: true },
        ...modifiers,
      ].filter((v, i, a) => a.findIndex((m) => m.type == v.type) === i),
    } as Types.Fields.Field<"Enum">;
  }
}
