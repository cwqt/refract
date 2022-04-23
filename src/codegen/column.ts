import { modifier } from './modifiers';
import * as Types from '../types';

// Converts a Column to a Prisma row string
export const column = (column: Types.Column): string => {
  if (Types.Fields.isRaw(column)) return `\t${column.modifiers[0].value}`;
  if (Types.Fields.isEnum(column)) return enumeration(column);
  if (Types.Fields.isPrimitive(column)) return primitive(column);
  if (Types.Fields.isRelation(column)) return relationship(column);

  throw new Error(
    `CodegenError: Couldn't figure out type for column: ${column.name}`,
  );
};

const enumeration = (column: Types.Column<'Enum'>) => {
  const [type, ...modifiers] = column.modifiers;
  const isNullable = modifiers;

  return `\t${column.name} ${type.value}${isNullable ? '?' : ''} ${modifiers
    .map(m => modifier(column.type, m))
    .join(' ')}`;
};

const primitive = (column: Types.Column<Types.Fields.Primitive>) => {
  const isNullable = column.modifiers.find(({ type }) => type == 'nullable');

  return `\t${column.name} ${
    column.type == 'Varchar' // "String" is a keyword
      ? 'String'
      : column.type
  }${isNullable ? '?' : ''} ${column.modifiers
    .map(m => modifier(column.type, m))
    .join(' ')}`;
};

const relationship = (column: Types.Column<Types.Fields.Relation>) => {
  if (column.type == 'ManyToOne') {
    const [model, fields, references, ...modifiers] =
      column.modifiers as unknown as [
        Types.Modifier<'ManyToOne', 'model'>,
        Types.Modifier<'ManyToOne', 'fields'>,
        Types.Modifier<'ManyToOne', 'references'>,
        Types.Modifier<'ManyToOne'>[],
      ];

    const isNullable = column.modifiers.find(({ type }) => type == 'nullable');

    return `\t${column.name} ${model.value.name}${
      isNullable ? '?' : ''
    } @relation(fields: [${fields.value.join(
      ', ',
    )}], references: [${references.value.join(', ')}])`;
  }

  if (column.type == 'OneToMany') {
    const [model, ...modifiers] = column.modifiers as unknown as [
      Types.Modifier<'OneToMany', 'model'>,
      Types.Modifier<'OneToMany'>[],
    ];

    return `\t${column.name} ${model.value.name}[]`;
  }

  if (column.type == 'OneToOne') {
    const isNullable = column.modifiers.find(({ type }) => type == 'nullable');
  }

  return '';
};
