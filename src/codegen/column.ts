import { modifier } from './modifiers';
import * as Types from '../types';
import { isString } from '../types/utils';

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
    .join(' ')}`.trimEnd();
};

const primitive = (column: Types.Column<Types.Fields.Primitive>) => {
  const isNullable = column.modifiers.find(({ type }) => type == 'nullable');

  return `\t${column.name} ${
    column.type == 'Varchar' // "String" is a keyword
      ? 'String'
      : column.type
  }${isNullable ? '?' : ''} ${column.modifiers
    .map(m => modifier(column.type, m))
    .join(' ')}`.trimEnd();
};

const relationship = (column: Types.Column<Types.Fields.Relation>) => {
  if (column.type == 'ManyToOne' || column.type == 'OneToOne') {
    const isNullable = column.modifiers.find(({ type }) => type == 'nullable');

    const [model, fields, references, ...modifiers] =
      column.modifiers as unknown as [
        Types.Modifier<'OneToOne' | 'ManyToOne', 'model'>,
        Types.Modifier<'OneToOne' | 'ManyToOne', 'fields'>,
        Types.Modifier<'OneToOne' | 'ManyToOne', 'references'>,
        Types.Modifier<'OneToOne' | 'ManyToOne'>[],
      ];

    if (column.type == 'OneToOne') {
      // Not FK holder
      if (fields?.type !== 'fields' || references?.type !== 'references') {
        return `\t${column.name} ${
          isString(model.value) ? model.value : model.value.name
        }${isNullable ? '?' : ''}`;
      }
    }

    return `\t${column.name} ${
      isString(model.value) ? model.value : model.value.name
    }${isNullable ? '?' : ''} @relation(fields: [${fields.value.join(
      ', ',
    )}], references: [${references.value.join(', ')}])`.trimEnd();
  }

  if (column.type == 'OneToMany') {
    const [model, ...modifiers] = column.modifiers as unknown as [
      Types.Modifier<'OneToMany', 'model'>,
      Types.Modifier<'OneToMany'>[],
    ];

    return `\t${column.name} ${
      isString(model.value) ? model.value : model.value.name
    }[]`;
  }

  return '';
};
