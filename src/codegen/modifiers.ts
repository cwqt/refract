import { Modifier } from '../types/modifiers';
import { Type } from '../types/types';
import { transform } from './transform';

// TODO: less shitty way of doing this
export const modifier = (type: Type, modifier: Modifier): string => {
  switch (modifier.type as any) {
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
  }
};
