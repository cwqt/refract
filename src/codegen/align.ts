// Aligns contents of a model/generator to that of the longest column
export const align = (value: string, delimiter: string = ' '): string => {
  const lines = value.split('\n');

  const max =
    Math.max(...lines.map(l => l.trim().split(delimiter).shift().length)) + 1;

  return lines
    .map(line => line.split(delimiter))
    .map(([head, ...rest]) =>
      [head.padEnd(max), delimiter, ...rest.map(v => v.trim())].join(' '),
    )
    .join('\n');
};
