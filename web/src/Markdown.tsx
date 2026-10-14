import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { lessons, phases, REPO } from './data';

const documents = import.meta.glob<string>('../../*/README.md', {
  query: '?raw',
  import: 'default',
});
const rootDocuments = import.meta.glob<string>('../../*.md', { query: '?raw', import: 'default' });
const loaders = { ...documents, ...rootDocuments };

export function documentHref(href: string | undefined, folder: string): string | undefined {
  if (!href) return undefined;
  if (/^(https?:|mailto:)/i.test(href) || href.startsWith('#')) return href;
  try {
    const url = new URL(href, `${REPO}/blob/main/${folder ? `${folder}/` : ''}README.md`);
    const path = decodeURIComponent(url.pathname).replace(
      /^\/MubashirLahori97\/Complete-AI-FDE-Software\/blob\/main\//,
      '',
    );
    const lesson = lessons.find(
      (item) =>
        path === `${item.folder}/` || path === `${item.folder}/README.md` || path === item.folder,
    );
    if (lesson) return `#/lesson/${lesson.day}`;
    const phase = phases.find((item) => path.startsWith(item.folder));
    if (phase) return `#/phase/${phase.id}`;
    if (['ROADMAP.md', 'CURRICULUM.md', 'VISION.md'].includes(path)) return `#/document/${path}`;
    return url.href;
  } catch {
    return undefined;
  }
}

export default function Markdown({
  folder = '',
  filename = 'README.md',
}: {
  folder?: string;
  filename?: string;
}) {
  const [content, setContent] = useState('');
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setContent('');
    setFailed(false);
    const loader = loaders[`../../${folder ? `${folder}/` : ''}${filename}`];
    if (!loader) {
      setFailed(true);
      return;
    }
    loader()
      .then((value) => {
        if (active)
          setContent(value.replace(/^# .*\r?\n/, '').replace(/^!\[.*?\]\(.*?\).*\r?\n/gm, ''));
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [folder, filename]);
  if (failed)
    return (
      <p role="alert">
        This lesson could not load.{' '}
        <a href={`${REPO}/tree/main/${folder}`}>Read the source on GitHub</a> or reload the page.
      </p>
    );
  if (!content)
    return (
      <p className="muted" role="status">
        Loading the course notes…
      </p>
    );
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          a: ({ href, children }) => {
            const destination = documentHref(href, folder);
            const external = destination?.startsWith('http');
            return (
              <a
                href={destination}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            );
          },
          img: () => null,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
