import { Modifier } from '../types/modifiers';
import { Type } from '../types/types';
import { transform } from './transform';

// TODO: less shitty way of doing this
export const modifier = <T extends Type>(
  type: T,
  modifier: Modifier<T>,
): string => {
  switch (modifier.type) {
    case 'default':
      return `@default(${
        type == 'Enum' ? modifier.value : transform(modifier.value)
      })`;
    case 'index':
      return `@id`;
    case 'unique':
      return '@unique';
    case 'updatedAt':
      return '@updatedAt';
    case 'ignore':
      return '@ignore';
    case 'map':
      return `@map("${modifier.value}")`;
  }
};
