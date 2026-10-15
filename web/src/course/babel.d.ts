declare module '@babel/standalone' {
  export const packages: {
    types: {
      blockStatement: (nodes: unknown[]) => unknown;
      expressionStatement: (node: unknown) => unknown;
      callExpression: (node: unknown, args: unknown[]) => unknown;
      identifier: (name: string) => unknown;
    };
  };
  export function transform(
    code: string,
    options: Record<string, unknown>,
  ): { code?: string | null };
}
