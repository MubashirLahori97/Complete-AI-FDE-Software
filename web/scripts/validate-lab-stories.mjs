const record = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
export function validateLabStories(labs, stories) {
  if (!Array.isArray(stories) || stories.length !== 30)
    throw new Error('Every core mission needs a story and comparisons.');
  for (const [index, story] of stories.entries()) {
    const lab = labs[index];
    if (
      !record(story) ||
      story.id !== lab.id ||
      typeof story.scene !== 'string' ||
      story.scene.trim().length < 20 ||
      !Array.isArray(story.comparisons) ||
      story.comparisons.length !== 2
    )
      throw new Error(`Incomplete guided story ${lab.id}`);
    for (const comparison of story.comparisons) {
      if (!record(comparison) || !record(comparison.before) || !record(comparison.change))
        throw new Error(`Invalid comparison structure ${lab.id}`);
      for (const key of ['title', 'notice', 'takeaway'])
        if (typeof comparison[key] !== 'string' || !comparison[key].trim())
          throw new Error(`Missing comparison ${key} in mission ${lab.id}`);
      if (Object.keys(comparison.change).length !== 1)
        throw new Error(`Comparison ${lab.id} must change one control`);
      for (const [key, value] of [
        ...Object.entries(comparison.before),
        ...Object.entries(comparison.change),
      ]) {
        const control = lab.controls.find((control) => control.id === key);
        if (!control) throw new Error(`Unknown comparison control ${lab.id}:${key}`);
        const valid =
          control.type === 'text'
            ? typeof value === 'string' && value.length <= (control.id === 'heading' ? 70 : 500)
            : control.type === 'toggle'
              ? typeof value === 'boolean'
              : control.type === 'select'
                ? control.options.some(([option]) => option === value)
                : Number.isFinite(value) &&
                  value >= control.min &&
                  value <= control.max &&
                  Math.abs(
                    (value - control.min) / control.step -
                      Math.round((value - control.min) / control.step),
                  ) < 1e-8;
        if (!valid) throw new Error(`Invalid comparison value ${lab.id}:${key}`);
      }
      const [key, value] = Object.entries(comparison.change)[0];
      const initial =
        key in comparison.before
          ? comparison.before[key]
          : lab.controls.find((control) => control.id === key).default;
      if (initial === value) throw new Error(`Comparison ${lab.id} changes nothing`);
    }
  }
}
