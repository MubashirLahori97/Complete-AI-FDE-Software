const limitLoops = (api: { types: typeof import('@babel/standalone').packages.types }) => {
  const types = api.types;
  const visit = (path: {
    node: { body: unknown };
    get: (name: string) => { isBlockStatement: () => boolean };
  }) => {
    const body = path.get('body');
    if (!body.isBlockStatement()) path.node.body = types.blockStatement([path.node.body]);
    (path.node.body as { body: unknown[] }).body.unshift(
      types.expressionStatement(types.callExpression(types.identifier('__fdeTick'), [])),
    );
  };
  return {
    visitor: {
      WhileStatement: visit,
      DoWhileStatement: visit,
      ForStatement: visit,
      ForOfStatement: visit,
      ForInStatement: visit,
    },
  };
};

export async function compileScript(code: string, react = false): Promise<string> {
  const Babel = await import('@babel/standalone');
  const result = Babel.transform(code, {
    filename: react ? 'exercise.tsx' : 'exercise.js',
    presets: react ? [['react', { runtime: 'classic' }], 'typescript'] : [],
    plugins: react ? [limitLoops, 'transform-modules-commonjs'] : [limitLoops],
    sourceType: react ? 'module' : 'script',
  });
  return result.code || '';
}

export async function instrumentHtml(code: string): Promise<string> {
  const scripts = [...code.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];
  for (const match of scripts) {
    const compiled = await compileScript(match[1]);
    code = code.replace(
      match[0],
      `<script>${compiled.replace(/<\/script/gi, '<\\/script')}</script>`,
    );
  }
  return code;
}
