import { Modifier } from '../../types/modifiers';

// export type Db<T> = Modifier<T>
//
//
export type Db<T extends string, K> = {
  type: `@db.${T}`;
  modifiers: [{ type: 'value'; value: K }];
};

export const db = <T extends string, K = void>(
  type: T,
  value?: K,
): Db<T, K> => ({
  type: `@db.${type}`,
  modifiers: [{ type: 'value', value }],
});
