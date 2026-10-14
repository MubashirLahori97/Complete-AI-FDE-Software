import { Children, isValidElement, useEffect, useMemo, useState, type ReactNode } from 'react';
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
const projectDocuments = import.meta.glob<string>('../../*/PROJECT.md', {
  query: '?raw',
  import: 'default',
});
const loaders = { ...documents, ...rootDocuments, ...projectDocuments };
const headingText = (children: ReactNode): string =>
  Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return headingText(child.props.children);
      return '';
    })
    .join('');
const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

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
    const projectLesson = lessons.find((item) => path === `${item.folder}/PROJECT.md`);
    if (projectLesson) return `#/lesson/${projectLesson.day}?tab=project`;
    const phase = phases.find((item) => path.startsWith(item.folder));
    if (phase) return `#/phase/${phase.id}`;
    if (['ROADMAP.md', 'CURRICULUM.md', 'VISION.md', 'PROJECTS.md'].includes(path))
      return `#/document/${path}`;
    return url.href;
  } catch {
    return undefined;
  }
}

export default function Markdown({
  folder = '',
  filename = 'README.md',
  contents = false,
}: {
  folder?: string;
  filename?: string;
  contents?: boolean;
}) {
  const [content, setContent] = useState('');
  const [failed, setFailed] = useState(false);
  const prefix = `guide-${folder || filename}-${filename}`;
  const headings = useMemo(() => {
    let fenced = false;
    const result: string[] = [];
    for (const line of content.split('<!-- original-workshop:begin -->')[0].split('\n')) {
      if (line.startsWith('```')) {
        fenced = !fenced;
        continue;
      }
      if (!fenced && line.startsWith('## ')) result.push(line.slice(3).trim());
    }
    return result;
  }, [content]);
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
      {contents && headings.length > 0 && (
        <nav className="article-contents" aria-label="On this page">
          <p className="eyebrow">ON THIS PAGE</p>
          {headings.map((heading) => (
            <button
              key={heading}
              onClick={() =>
                document.getElementById(`${prefix}-${slug(heading)}`)?.scrollIntoView({
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth',
                  block: 'start',
                })
              }
            >
              {heading}
            </button>
          ))}
        </nav>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          h2: ({ children }) => <h2 id={`${prefix}-${slug(headingText(children))}`}>{children}</h2>,
          a: ({ href, children }) => {
            const destination = documentHref(href, folder);
            const external = destination?.startsWith('http');
            return (
              <a
                href={destination}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                onClick={
                  destination?.startsWith('#') && !destination.startsWith('#/')
                    ? (event) => {
                        event.preventDefault();
                        document
                          .getElementById(`${prefix}-${destination.slice(1)}`)
                          ?.scrollIntoView({ behavior: 'auto' });
                      }
                    : undefined
                }
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
