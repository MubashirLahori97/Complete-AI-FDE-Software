import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  Download,
  ExternalLink,
  FolderGit2,
  Github,
  LayoutDashboard,
  Menu,
  Search,
  Settings as SettingsIcon,
  Sprout,
  Users,
  X,
} from 'lucide-react';
import { lessons, REPO } from './data';
import { completionCount, loadProgress, STORAGE_KEY, type Progress } from './state';
import { ProgressBar } from './ui';
const Dashboard = lazy(() => import('./Dashboard'));
const AminaLesson = lazy(() => import('./AminaLesson'));
const Curriculum = lazy(() => import('./Curriculum'));
const Lesson = lazy(() => import('./Lesson'));
const Playground = lazy(() => import('./Playground'));
const Scenarios = lazy(() => import('./Scenarios'));
const Portfolio = lazy(() => import('./Portfolio'));
const Document = lazy(() =>
  import('./WorkspacePages').then((module) => ({ default: module.Document })),
);
const Phase = lazy(() => import('./WorkspacePages').then((module) => ({ default: module.Phase })));
const Resources = lazy(() =>
  import('./WorkspacePages').then((module) => ({ default: module.Resources })),
);
const Settings = lazy(() =>
  import('./WorkspacePages').then((module) => ({ default: module.Settings })),
);

const navigation = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/curriculum', label: 'Learning path', icon: BookOpen },
  { path: '/lab', label: 'Practice lab', icon: Code2 },
  { path: '/scenarios', label: 'Field scenarios', icon: Users },
  { path: '/portfolio', label: 'My portfolio', icon: FolderGit2 },
];
const readHash = () => window.location.hash.slice(1) || '/';

export default function App() {
  const [hash, setHash] = useState(readHash);
  const [progress, setProgress] = useState(loadProgress);
  const [storageError, setStorageError] = useState(false);
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const main = useRef<HTMLElement>(null);
  const [path, queryString] = hash.split('?');
  const params = new URLSearchParams(queryString);
  const update = useCallback((next: Progress) => {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, []);
  useEffect(() => {
    const onHash = () => {
      setHash(readHash());
      setMenu(false);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    if (searchOpen && !dialog.current?.open) {
      dialog.current?.showModal();
      requestAnimationFrame(() => searchInput.current?.focus());
    } else if (!searchOpen && dialog.current?.open) dialog.current.close();
  }, [searchOpen]);
  useEffect(() => {
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
    const match = path.match(/^\/lesson\/(\d+)$/);
    const day = match ? Number(match[1]) : 0;
    const title =
      day >= 1 && day <= 30
        ? lessons[day - 1].title
        : navigation.find((item) => item.path === path)?.label ||
          (path === '/settings'
            ? 'Settings'
            : path === '/resources'
              ? 'Resources'
              : path === '/sample/amina'
                ? 'Amina’s shop · Your first variable'
                : 'Learning workspace');
    document.title = `${title} · FDE Academy`;
  }, [hash, path]);
  const completed = completionCount(progress);
  const lessonMatch = path.match(/^\/lesson\/(\d+)$/);
  const phaseMatch = path.match(/^\/phase\/([234])$/);
  const documentMatch = path.match(/^\/document\/(ROADMAP|CURRICULUM|VISION|PROJECTS)\.md$/);
  const lessonDay = lessonMatch ? Number(lessonMatch[1]) : 0;
  const selectedPath =
    lessonMatch || phaseMatch ? '/curriculum' : documentMatch ? '/resources' : path;
  const section =
    navigation.find((item) => item.path === selectedPath)?.label ||
    (selectedPath === '/settings'
      ? 'Settings'
      : selectedPath === '/resources'
        ? 'Resources'
        : 'Workspace');
  const results = lessons
    .filter((lesson) =>
      `${lesson.day} ${lesson.title} ${lesson.summary} ${lesson.track}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .slice(0, 6);
  let page;
  if (path === '/') page = <Dashboard progress={progress} />;
  else if (path === '/curriculum')
    page = (
      <Curriculum
        key={hash}
        progress={progress}
        initialTrack={params.get('track') || ''}
        initialQuery={params.get('q') || ''}
      />
    );
  else if (path === '/lab') page = <Playground progress={progress} update={update} />;
  else if (path === '/scenarios') page = <Scenarios progress={progress} update={update} />;
  else if (path === '/portfolio') page = <Portfolio progress={progress} update={update} />;
  else if (path === '/resources') page = <Resources />;
  else if (path === '/settings') page = <Settings progress={progress} update={update} />;
  else if (lessonDay >= 1 && lessonDay <= 30)
    page = (
      <Lesson
        key={`${lessonDay}:${params.get('tab') || 'learn'}`}
        lesson={lessons[lessonDay - 1]}
        progress={progress}
        update={update}
        initialTab={params.get('tab') || 'learn'}
      />
    );
  else if (phaseMatch)
    page = <Phase id={Number(phaseMatch[1])} progress={progress} update={update} />;
  else if (documentMatch) page = <Document filename={`${documentMatch[1]}.md`} />;
  else
    page = (
      <div className="empty-state">
        <BookOpen size={32} />
        <h1>That page isn’t on the path.</h1>
        <p>Explore the learning path to find your next lesson.</p>
        <a className="button primary" href="#/curriculum">
          Open learning path
          <ArrowRight size={16} />
        </a>
      </div>
    );
  if (path === '/sample/amina')
    return (
      <Suspense
        fallback={
          <p className="muted" role="status">
            Opening Amina’s shop…
          </p>
        }
      >
        <AminaLesson />
      </Suspense>
    );
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to main content
      </a>
      <aside id="workspace-sidebar" className={`sidebar ${menu ? 'is-open' : ''}`}>
        <a href="#/" className="brand" aria-label="FDE Academy home">
          <span className="brand-mark">
            <Code2 size={25} />
          </span>
          <span>
            <strong>
              FDE<span className="brand-word"> academy</span>
            </strong>
            <small>BUILD. EVALUATE. DELIVER.</small>
          </span>
        </a>
        <span className="sidebar-label">WORKSPACE</span>
        <nav aria-label="Main navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={`#${item.path}`}
                aria-current={selectedPath === item.path ? 'page' : undefined}
                className={selectedPath === item.path ? 'active' : ''}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {item.path === '/curriculum' && <span className="nav-count">30</span>}
              </a>
            );
          })}
          <div className="sidebar-divider" />
          <a
            href="#/resources"
            className={selectedPath === '/resources' ? 'active' : ''}
            aria-current={selectedPath === '/resources' ? 'page' : undefined}
          >
            <BookOpen size={19} />
            <span>Resources</span>
          </a>
          <a
            href="#/settings"
            className={selectedPath === '/settings' ? 'active' : ''}
            aria-current={selectedPath === '/settings' ? 'page' : undefined}
          >
            <SettingsIcon size={19} />
            <span>Settings & backup</span>
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-progress">
            <div>
              <span>Your core journey</span>
              <strong>{completed} / 30</strong>
            </div>
            <ProgressBar value={(completed / 30) * 100} label="Sidebar course completion" />
            <p>
              {completed === 30
                ? 'Keep building beyond the core.'
                : 'Small steps. Real understanding.'}
            </p>
            <a href="#/portfolio" className="text-link">
              Build your proof of work
              <ArrowRight size={13} />
            </a>
          </div>
          <a className="github-link" href={REPO} target="_blank" rel="noopener noreferrer">
            <Github size={18} />
            Open-source curriculum
            <ExternalLink size={13} />
          </a>
          <div className="local-save">
            <span className="online-dot" />
            Progress stays in your browser
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-location">
            <button
              className="menu-toggle icon-button"
              aria-label={menu ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menu}
              aria-controls="workspace-sidebar"
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X size={21} /> : <Menu size={21} />}
            </button>
            <span className="muted breadcrumb-root">Workspace</span>
            <ChevronRight size={13} />
            <span>{section}</span>
          </div>
          <div className="topbar-actions">
            <button className="global-search" onClick={() => setSearchOpen(true)}>
              <Search size={16} />
              <span>Search lessons</span>
              <kbd>Ctrl K</kbd>
            </button>
            <span className="topbar-divider" />
            <a className="avatar" href="#/settings" aria-label="Edit your learning profile">
              {progress.name ? progress.name.slice(0, 1).toUpperCase() : <Sprout size={21} />}
            </a>
          </div>
        </header>
        <main ref={main} id="main-content" className="main-content" tabIndex={-1}>
          {storageError && (
            <div className="storage-alert" role="alert">
              This browser could not save your latest changes.{' '}
              <a href="#/settings">Export a backup</a> before closing this page.
            </div>
          )}
          <Suspense
            fallback={
              <p className="muted" role="status">
                Loading your workspace…
              </p>
            }
          >
            {page}
          </Suspense>
        </main>
        <footer className="workspace-footer">
          <span>
            FDE Academy <span className="dot-divider">/</span> Learn by building.
          </span>
          <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
            Help improve this course
            <ExternalLink size={13} />
          </a>
        </footer>
      </div>
      <dialog
        ref={dialog}
        className="search-dialog"
        onClose={() => setSearchOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSearchOpen(false);
        }}
      >
        <div className="search-dialog-header">
          <Search size={21} />
          <label className="sr-only" htmlFor="global-search-input">
            Search the curriculum
          </label>
          <input
            id="global-search-input"
            ref={searchInput}
            placeholder="What do you want to learn?"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            className="icon-button"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <p className="eyebrow search-results-label">
          {search ? 'MATCHING LESSONS' : 'START EXPLORING'}
        </p>
        <div className="search-results">
          {results.length ? (
            results.map((lesson) => (
              <a
                href={`#/lesson/${lesson.day}`}
                key={lesson.day}
                onClick={() => setSearchOpen(false)}
              >
                <span className="search-day">{String(lesson.day).padStart(2, '0')}</span>
                <div>
                  <strong>{lesson.title}</strong>
                  <small>{lesson.track}</small>
                </div>
                <ArrowRight size={16} />
              </a>
            ))
          ) : (
            <p className="empty-search">No matches. Try “APIs”, “data”, or “discovery”.</p>
          )}
        </div>
        <div className="search-dialog-footer">
          <span>Press Esc to close</span>
          <a
            href={`#/curriculum?q=${encodeURIComponent(search)}`}
            onClick={() => setSearchOpen(false)}
          >
            Search all lessons
            <ArrowRight size={14} />
          </a>
        </div>
      </dialog>
    </div>
  );
}
