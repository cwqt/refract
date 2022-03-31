// Creates a nice header string
export const header = (name: string, len: number = 80): string =>
  `// ${name} ${"-".repeat(len - name.length)}`;

// Creates a Block element string
export const block = (name: string, content: string): string =>
  [`${name} {`, content, `}`].join("\n");

