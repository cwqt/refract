import { Model } from './blocks';

// Primitive data-types
export type TypeData = {
  Int: {
    unique?: true;
    index?: true;
    default?: 'autoincrement()' | number;
    nullable?: true;
  };
  Varchar: { unique?: true; default?: string; nullable?: true; limit?: number };
  Boolean: { unique?: true; index?: true; default?: boolean; nullable?: true };
  DateTime: { default?: 'now()'; nullable?: true; updatedAt?: true };
  // Escape hatch
  Raw: { value: string };
  //   status           SubscriptionStatus @default(Paused)
  Enum: { nullable?: true; default?: string; enum: string };
  // @relation(fields: [customerId], references: [id])
  OneToMany: { model: Model; nullable?: true };
  OneToOne: { model: Model; nullable?: true };
  ManyToOne: {
    nullable?: true;
    model: Model;
    fields: string[];
    references: string[];
  };
};

// All possible column datatypes & their accepted modifiers/parameters
export type Type = keyof TypeData;
