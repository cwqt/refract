import { modifier } from './modifiers';
import * as Types from '../types';
import { isArray, isString } from '../types/utils';

// Converts a Column to a Prisma row string
export const column = (column: Types.Column): string => {
  if (Types.Fields.isCompound(column)) return compound(column);
  if (Types.Fields.isRaw(column)) return `\t${column.modifiers[0].value}`;
  if (Types.Fields.isEnum(column)) return enumeration(column);
  if (Types.Fields.isEnumKey(column)) return enumKey(column);
  if (Types.Fields.isPrimitive(column)) return primitive(column);
  if (Types.Fields.isRelation(column)) return relationship(column);

  throw new Error(
    `CodegenError: Couldn't figure out type for column: ${column.name}`,
  );
};

// enum { Foo Bar }
const enumKey = (column: Types.Column<'EnumKey'>) =>
  `\t${column.name} ${column.modifiers
    .map(m => modifier<'EnumKey'>(column.type, m))
    .join(' ')}`.trimEnd();

export const enumeration = (column: Types.Column<'Enum'>) => {
  const [type, ...modifiers] = column.modifiers;
  const isNullable = modifiers.find(({ type }) => type == 'nullable');

  return `\t${column.name} ${type.value}${isNullable ? '?' : ''} ${modifiers
    .map(m => modifier(column.type, m))
    .join(' ')}`.trimEnd();
};

const primitive = (column: Types.Column<Types.Fields.Scalar>) => {
  const isNullable = column.modifiers.find(({ type }) => type == 'nullable');

  return `\t${column.name} ${column.type}${
    isNullable ? '?' : ''
  } ${column.modifiers.map(m => modifier(column.type, m)).join(' ')}`.trimEnd();
};

const compound = (column: Types.Column<Types.Fields.Compound>) =>
  column.type == '@@ignore'
    ? `\t${column.type}`
    : `\t${column.type}(${
        column.type == '@@map'
          ? `"${column.modifiers[0].value[0]}"`
          : column.modifiers[0].value.join(', ')
      })`;

const relationship = (column: Types.Column<Types.Fields.Relation>) => {
  if (column.type == 'OneToOne' || column.type == 'ManyToOne') {
    const modifiers = column.modifiers as Types.Modifier<
      'OneToOne' | 'ManyToOne'
    >[];
    const isNullable = modifiers.find(({ type }) => type === 'nullable');

    const [model, ...restModifiers] = modifiers.filter(
      ({ type }) => type !== 'nullable',
    ) as [
      Types.Modifier<'OneToOne' | 'ManyToOne', 'model'>,
      ...Types.Modifier<
        'OneToOne' | 'ManyToOne',
        'name' | 'fields' | 'references' | 'onUpdate' | 'onDelete'
      >[],
    ];

    const relationModifier = restModifiers.length
      ? `@relation(${restModifiers
          .sort(({ type }) => (type === 'name' ? -1 : 0))
          .map(({ type, value }) =>
            type === 'name'
              ? `"${value}"`
              : `${type}: ${isArray(value) ? `[${value.join(', ')}]` : value}`,
          )
          .join(', ')})`
      : '';

    return `\t${column.name} ${
      isString(model.value) ? model.value : model.value.name
    }${isNullable ? '?' : ''} ${relationModifier}`.trimEnd();
  }

  if (column.type == 'OneToMany') {
    const [model, relationName] = column.modifiers as unknown as [
      Types.Modifier<'OneToMany', 'model'>,
      Types.Modifier<'OneToMany', 'name'>,
    ];

    const relationModifier = relationName
      ? `@relation("${relationName.value}")`
      : '';

    return `\t${column.name} ${
      isString(model.value) ? model.value : model.value.name
    }[] ${relationModifier}`.trimEnd();
  }
};
