import { $Model } from '../public/model';
import { isRelation, Relation } from '../types/fields';
import * as Types from '../types';

export const validateModel = (model: $Model): $Model => {
  for (const relation of model.columns.filter(isRelation)) {
    const modifiers = relation.modifiers as Types.Modifier<Relation>[];
    const otherSideModel = (modifiers[0] as Types.Modifier<Relation, 'model'>)
      .value;

    const relationName = modifiers.find(
      ({ type }) => type === 'name',
    ) as Types.Modifier<Relation, 'name'>;

    if (relationName) {
      const otherSideRelation = otherSideModel.columns
        .filter(isRelation)
        .find(r =>
          r.modifiers.some(
            ({ type, value }) =>
              type === 'name' && value === relationName.value,
          ),
        );

      if (!otherSideRelation)
        throw new Error(
          `RelationshipErr: The other side of the relation '${relation.name}' with name '${relationName.value}' don't exist in model '${model.name}'`,
        );
    }

    if (model.name === otherSideModel.name && !relationName)
      throw new Error(
        `RelationshipErr: The model '${model.name}' have an ambiguous self relation. The fields '${relation.name}' and '${otherSideModel.name}' both refer to '${model.name}'. If they are part of the same relation add the same relation name for them with RelationName(<name>) modifier`,
      );

    if (relation.type !== 'OneToOne' && relation.type !== 'ManyToOne') continue;

    const castedModifiers = modifiers as Types.Modifier<
      'OneToOne' | 'ManyToOne'
    >[];

    const fields = castedModifiers.find(
      ({ type }) => type === 'fields',
    ) as Types.Modifier<'OneToOne' | 'ManyToOne', 'fields'>;

    if (fields) {
      const missingFields = fields.value.filter(
        f => !model.columns.some(c => c.name === f),
      );

      if (missingFields.length)
        throw new Error(
          `RelationshipErr: Columns in 'fields' don't exist in model '${
            model.name
          }': ${missingFields.map(m => `'${m}'`).join(', ')}`,
        );
    }

    const references = castedModifiers.find(
      ({ type }) => type === 'references',
    ) as Types.Modifier<'OneToOne' | 'ManyToOne', 'references'>;

    if (references) {
      const missingReferences = references.value.filter(
        f => !otherSideModel.columns.some(c => c.name === f),
      );

      if (missingReferences.length)
        throw new Error(
          `RelationshipErr: Referenced columns in 'references' don't exist in model '${
            otherSideModel.name
          }': ${missingReferences.map(m => `'${m}'`).join(', ')}`,
        );
    }

    if (fields && references) {
      if (fields.value.length !== references.value.length)
        throw new Error(
          `RelationshipErr: You must specify the same number of fields in 'fields' and 'references' for relation '${relation.name}' in model '${model.name}'`,
        );

      for (let index = 0; index < fields.value.length; index++) {
        const field = fields.value[index];
        const reference = references.value[index];

        const column = model.columns.find(c => c.name === field)!;
        const otherSideColumn = otherSideModel.columns.find(
          c => c.name === reference,
        )!;

        if (column.type !== otherSideColumn.type)
          throw new Error(
            `RelationshipErr: The type of the field '${field}' in the model '${model.name}' does not match the type of the referenced field '${reference}' in model '${otherSideModel.name}'`,
          );
      }
    }

    const missingAttribute =
      fields && !references
        ? 'references'
        : !fields && references
        ? 'fields'
        : '';

    if (missingAttribute)
      throw new Error(
        `RelationshipErr: Relation '${relation.name}' is missing the '${missingAttribute}' attribute`,
      );

    if (relation.type === 'ManyToOne' && !fields && !references)
      throw new Error(
        `RelationshipErr: Relation many-to-one '${relation.name}' is missing the 'fields' and 'references' attributes`,
      );

    const isNullable = castedModifiers.find(
      ({ type }) => type === 'nullable',
    ) as Types.Modifier<'OneToOne' | 'ManyToOne', 'nullable'>;

    if (relation.type === 'OneToOne' && !isNullable && !fields && !references)
      throw new Error(
        `RelationshipErr: The side of the one-to-one relation without a relation scalar must be optional\n(Model '${otherSideModel.name}', relation '${relation.name}')`,
      );
  }

  return model;
};
