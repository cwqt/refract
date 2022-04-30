// Align contents of a datasource/generator to that of the longest column
export const alignKv = (value: string): string => {
  const lines = value.split('\n');
  const delimiter = '=';

  const max =
    Math.max(...lines.map(l => l.trim().split(delimiter).shift().length)) + 1;

  return lines
    .map(line => line.split(delimiter))
    .map(([head, ...rest]) =>
      [head.padEnd(max), delimiter, ...rest.map(v => v.trim())].join(' '),
    )
    .join('\n');
};

// Align contents of a model to that of the longest column
export const alignFields = (value: string): string => {
  const lines = value.split('\n');

  let maximumColumnName = 0,
    MaximumColumnType = 0;
  for (const line of lines) {
    const [columnName, columnType] = line.split(' ');
    maximumColumnName = Math.max(maximumColumnName, columnName.length);
    MaximumColumnType = Math.max(MaximumColumnType, (columnType ?? '').length);
  }

  return lines
    .map(line => line.split(' '))
    .map(([columnName, columnType, ...rest]) =>
      [
        columnName.padEnd(maximumColumnName + 1),
        columnType ? columnType.padEnd(MaximumColumnType + 1) : '',
        ...rest.map(v => v.trim()),
      ].join(' '),
    )
    .join('\n');
};
