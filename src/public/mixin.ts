import { Mixin as TMixin } from '../types';
import { Model } from './model';

// Mixins are simply models that can be composed into other models
// Perhaps it makes sense to just remove these & allow models to be
// arbitrarily extended - but I kind of hate the idea of 'extending'
// & inheritance... this just exposes a couple fields from Models
// to allow for compositional models

export const Mixin = (): TMixin => {
  const model = Model('mixin');

  return {
    Field: model.Field,
    Block: model.Block,
    columns: model.columns,
  };
};
