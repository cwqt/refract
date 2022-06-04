import { Modifier } from '../types/modifiers';
import { Type } from '../types/types';
import { transform } from './transform';

// TODO: less shitty way of doing this
export const modifier = <T extends Type>(
  type: T,
  modifier: Modifier<T>,
): string => {
  // @db.TinyInt etc. modifiers
  if ((modifier.type as string).startsWith('@')) {
    // this is rapidly deteriorating lmao
    const type = (modifier.type as string).split('.').pop();
    return `@db.${type}${
      Array.isArray(modifier.value)
        ? !modifier.value.length ||
          modifier.value.every(item => item == undefined)
          ? ''
          : `(${modifier.value.join(', ')})`
        : (modifier.value as any) == undefined
        ? ''
        : `(${modifier.value})`
    }`;
  }

  // Non @db modifiers
  switch (modifier.type) {
    case 'default':
      return `@default(${
        type == 'Enum' ? modifier.value : transform(modifier.value)
      })`;
    case 'id':
      return `@id`;
    case 'unique':
      return '@unique';
    case 'updatedAt':
      return '@updatedAt';
    case 'ignore':
      return '@ignore';
    case 'map':
      return `@map("${modifier.value}")`;
    case 'unsupported':
      return `("${modifier.value}")`;
    case 'raw':
      return modifier.value as unknown as string;
  }
};
