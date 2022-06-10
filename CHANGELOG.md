# Changelog

## [1.2.0]

- Adds ability to add comments to models / enums
- Adds `Comment` modifier

## [1.1.4]

- Refactors and fixes bugs in the postgresql native db modifiers (<https://github.com/cwqt/refract/pull/5>)
- Adds support to CockroachDB native modifiers and scallar array modifier
  (<https://github.com/cwqt/refract/pull/6>)

## [1.1.3]

- Fixes nullable enums

## [1.1.2]

- Allows for direct schema imports into `Refract`
  - e.g. `import schema from './schema'`

## [1.1.1]

Spoke too soon

- Adds all the `@db` attributes for `mysql`, `postgresql` & `mongodb` providers
- Adds `.Block()` for properties like `@@map`, `@@id` etc.
- Adds `Unsupported` type

## [1.1.0]

Should be at parity with Prisma schema now

- Adds `OnUpdate` & `OnDelete` referential action modifiers
- Adds pre-generation checks for relations (assert both sides have Ids etc.)
- Adds support for `name` field to Relation fields for ambigious relations
- Renames `Pk().Fk()` to `Fields` & `References` modifiers

Once again thanks to [bacali95](https://github.com/bacali95) for contributing!

## [1.0.12]

- Fixes `String` type to be able to have `@id` decorator <https://github.com/cwqt/refract/pull/3>
- Improved formatting (decorator alignment) <https://github.com/cwqt/refract/pull/2>
- Fixes transforming function calls as values <https://github.com/cwqt/refract/pull/1>

Big thanks to [bacali95](https://github.com/bacali95) for these changes :)

## [1.0.11]

## [1.0.10]

- Adds `Raw` decorator escape hatch, similar to `.Raw()` model method
  - Can now do `Raw('@db.ObjectId')` etc to use un-supported decorators
- Fixes some out of date documentation

## [1.0.9]

- Adds `Map` decorator (e.g. `@map("foo")`)
- Renames `Varchar` to `String`
- Renames `Index` to `Id`
  - Adds `cuid()`, `uuid()`
- Adds `Ignore` decorator (e.g. `@ignore`)
- Adds `Float`, `BigInt`, `Bytes`, `Decimal` scalars
- Refactors how Enums are created
  - Adds `Key`
  - Enums definitions can now have decorators
- Refactors types on data-types to be more specific

## [1.0.8]

## [1.0.7]

## [1.0.6]

- Fix issue with `Enum` codegen always being nullable when having >=1 modifier
- Improve documentation

## [1.0.5]

- Useage documentation
- Added CI testing

## [1.0.4]

- Removed field checking on relationships because of fails with circular relationships

## [1.0.3]

- Added block alignment
- Added `OneToOne()` relationships

## [1.0.2]

- Added `.Raw()` Prisma escape hatch
- Added `.Mixin()` utility field

## [1.0.1]

- Added enums

## [1.0.0]

- Initial release
