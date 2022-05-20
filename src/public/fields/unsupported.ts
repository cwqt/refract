import * as Types from '../../types';

export const Unsupported = <M extends Types.Modifiers<'Unsupported'>>(
  name: string,
  ...modifiers: Types.Modifier<'Unsupported', M>[]
) => ({
  type: 'Unsupported' as const,
  modifiers: [{ type: 'unsupported' as const, value: name }, ...modifiers],
});
