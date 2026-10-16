import type { Mission } from './mission-types';
import { lessonGuides } from './lesson-guides';
import './lesson-directions.css';

export default function LessonDirections({
  mission,
  step,
  conceptName,
  questionLabel,
}: {
  mission: Mission;
  step: number;
  conceptName: string;
  questionLabel: string;
}) {
  const guide = lessonGuides[mission.id - 1];
  const directions = [
    null,
    {
      purpose: `${guide.why} Here you learn why the example behaves that way.`,
      first: `Begin with “${conceptName}”. Read its explanation and try the example. You can return to the experiment to compare.`,
      next: 'Use the idea buttons to explore the remaining ideas. Then choose “Build my project”.',
    },
    {
      purpose: `Use this lesson’s idea in your own project: “${mission.project.title}”.`,
      first: guide.projectStart,
      next: 'Build in an AI builder or your own editor. Copy the ready-to-use AI brief below into that tool and ask how to open the result. Try the project checks, save what you observed here, then choose “Explain my system”.',
    },
    {
      purpose: guide.explainFocus,
      first: `Answer “${questionLabel}” below about the project you actually made. Ask AI to help inspect it, then explain it in your own words.`,
      next: 'Use “Next explanation” to work through the questions, one at a time. When your drafts are ready, choose “Review my evidence”. You can save your place and return later.',
    },
    {
      purpose: `Check your project, “${mission.project.title}”, and your understanding before recording the practice.`,
      first:
        'Read the evidence summary below. Fill any gaps in “Build with AI” or “Explain your system”. Try the changed situation with a person, self-review or AI-assisted review, and record the method, findings and gaps.',
      next:
        mission.id < 30
          ? `Save your practice record when its requirements are met. Use “Next lesson: ${mission.id + 1}” to keep learning. You can return to unfinished work later.`
          : 'Save your practice record when its requirements are met. Choose “Review my portfolio” to see your projects and remaining gaps.',
    },
  ][step];
  if (!directions) return null;
  return (
    <aside
      className="lesson-directions"
      aria-label="How to do this step"
      data-lesson-guide={mission.id}
      data-guide-step={step}
    >
      <p>
        <strong>Why this step:</strong> {directions.purpose}
      </p>
      <p>
        <strong>Do this first:</strong> {directions.first}
      </p>
      <p>
        <strong>Then:</strong> {directions.next}
      </p>
    </aside>
  );
}
