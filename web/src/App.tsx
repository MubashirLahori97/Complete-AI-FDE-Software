import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  Download,
  ExternalLink,
  FolderGit2,
  LayoutDashboard,
  Menu,
  Search,
  Settings as SettingsIcon,
  X,
} from 'lucide-react';
import { lessons, REPO } from './data';
import { loadProgress, STORAGE_KEY, type Progress } from './state';
import { missions } from './missions';
import { MissionHome, MissionPath, MissionLesson } from './MissionPages';
import AccountButton from './cloud/AccountButton';
import AuthModal from './cloud/AuthModal';
import ProfileModal from './cloud/ProfileModal';
import { getSupabase, isCloudEnabled } from './cloud/client';
import { flushDirty, pullMergePush } from './cloud/sync';
import { loadMentorProgress, type MentorProgress } from './mentor/progress';
const Dashboard = lazy(() => import('./Dashboard'));
const VisualWebsiteLesson = lazy(() => import('./VisualWebsiteLesson'));
const MotionLesson = lazy(() => import('./MotionLesson'));
const Curriculum = lazy(() => import('./Curriculum'));
const Lesson = lazy(() => import('./Lesson'));
const Playground = lazy(() => import('./Playground'));
const Scenarios = lazy(() => import('./Scenarios'));
const Portfolio = lazy(() => import('./Portfolio'));
const SdlcStudio = lazy(() => import('./SdlcStudio'));
const ProductionBlueprint = lazy(() => import('./ProductionBlueprint'));
const PythonTrack = lazy(() => import('./PythonTrack'));
const AgenticEraStudio = lazy(() => import('./AgenticEraStudio'));
const FullStackCourse = lazy(() => import('./FullStackCourse'));
const PracticeHub = lazy(() => import('./PracticeHub'));
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
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/curriculum', label: 'Learn', icon: BookOpen },
  { path: '/practice', label: 'Practice', icon: Code2 },
  { path: '/portfolio', label: 'Portfolio', icon: FolderGit2 },
];
const readHash = () => window.location.hash.slice(1) || '/';

export default function App() {
  const [hash, setHash] = useState(readHash);
  const [progress, setProgress] = useState(loadProgress);
  const [storageError, setStorageError] = useState(false);
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [mentorProgress, setMentorProgress] = useState<MentorProgress>(loadMentorProgress);
  const [signedIn, setSignedIn] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const main = useRef<HTMLElement>(null);
  const [path, queryString] = hash.split('?');
  const legacyContext =
    path === '/workshops' ||
    path === '/library' ||
    path === '/workshop-path' ||
    path === '/lab' ||
    path.startsWith('/lesson/') ||
    path.startsWith('/phase/');
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
    if (!isCloudEnabled()) return;
    const client = getSupabase();
    if (!client) return;
    client.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
      if (data.session) void flushDirty();
    });
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
      if (session) {
        void pullMergePush().then((merged) => setMentorProgress(merged));
      } else {
        setAuthOpen(false);
        setProfileOpen(false);
      }
    });
    return () => data.subscription.unsubscribe();
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
    const mission = path.match(/^\/mission\/(\d+)$/);
    const match = path.match(/^\/lesson\/(\d+)$/);
    const day = match ? Number(match[1]) : 0;
    const title =
      mission && Number(mission[1]) >= 1 && Number(mission[1]) <= 30
        ? missions[Number(mission[1]) - 1].title
        : day >= 1 && day <= 30
          ? lessons[day - 1].title
          : navigation.find((item) => item.path === path)?.label ||
            (path === '/settings'
              ? 'Settings'
              : path === '/resources'
                ? 'Resources'
                : path === '/sample/motion'
                  ? 'One page. Three layers. · Motion prototype'
                  : path === '/sample/website'
                    ? 'Your first website · Visual sample'
                    : 'Learning workspace');
    document.title = `${title} · FDE Academy`;
  }, [hash, path]);
  const lessonMatch = path.match(/^\/lesson\/(\d+)$/);
  const missionMatch = path.match(/^\/mission\/(\d+)$/);
  const phaseMatch = path.match(/^\/phase\/([234])$/);
  const documentMatch = path.match(
    /^\/document\/(ROADMAP|CURRICULUM|VISION|PROJECTS|RESEARCH-2030|MISSION-MAP|MISSION-COURSE|AI-NATIVE-SDLC|STEP-BY-STEP-GUIDE|PRODUCTION-BLUEPRINT|PYTHON-MASTERY-GUIDE|AGENTIC-ERA-2030)\.md$/,
  );
  const lessonDay = lessonMatch ? Number(lessonMatch[1]) : 0;
  const selectedPath =
    lessonMatch ||
    missionMatch ||
    phaseMatch ||
    path === '/workshop-path' ||
    path === '/sample/website' ||
    path === '/fullstack' ||
    path === '/python' ||
    path === '/agentic-era' ||
    path === '/sdlc' ||
    path === '/production'
      ? '/curriculum'
      : path === '/lab' || path === '/scenarios'
        ? '/practice'
        : documentMatch
          ? '/resources'
          : path === '/library' || path === '/workshops'
            ? '/'
            : path;
  const section =
    path === '/fullstack'
      ? 'Full-Stack & CS'
      : path === '/python'
        ? 'Python & FastAPI'
        : path === '/agentic-era'
          ? 'AI-Era Lab'
          : path === '/sdlc'
            ? 'AI-Era Workflow'
            : path === '/production'
              ? 'Production Blueprint'
              : path === '/scenarios'
                ? 'Client Scenarios'
                : path === '/lab'
                  ? 'Coding Sandbox'
                  : navigation.find((item) => item.path === selectedPath)?.label ||
                    (selectedPath === '/settings'
                      ? 'Settings'
                      : selectedPath === '/resources'
                        ? 'Resources'
                        : 'Workspace');
  const results = (
    legacyContext
      ? lessons
      : missions.map((m) => ({
          day: m.id,
          title: m.title,
          summary: m.problem,
          track: `Stage ${m.stage} · ${m.concepts.map((c) => c.name).join(' ')}`,
        }))
  )
    .filter((lesson) =>
      `${lesson.day} ${lesson.title} ${lesson.summary} ${lesson.track}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .slice(0, 6);
  let page;
  if (path === '/')
    page = <MissionHome progress={progress} update={update} mentorProgress={mentorProgress} />;
  else if (path === '/workshops' || path === '/library')
    page = <Dashboard progress={progress} update={update} />;
  else if (path === '/curriculum')
    page = (
      <MissionPath
        key={hash}
        progress={progress}
        initialStage={params.get('stage') || ''}
        initialQuery={params.get('q') || ''}
      />
    );
  else if (path === '/workshop-path')
    page = (
      <Curriculum
        key={hash}
        progress={progress}
        initialTrack={params.get('track') || ''}
        initialQuery={params.get('q') || ''}
      />
    );
  else if (path === '/fullstack') page = <FullStackCourse />;
  else if (path === '/practice') page = <PracticeHub />;
  else if (path === '/python') page = <PythonTrack progress={progress} />;
  else if (path === '/sdlc') page = <SdlcStudio progress={progress} />;
  else if (path === '/agentic-era') page = <AgenticEraStudio />;
  else if (path === '/production') page = <ProductionBlueprint />;
  else if (path === '/lab') page = <Playground progress={progress} update={update} />;
  else if (path === '/scenarios') page = <Scenarios progress={progress} update={update} />;
  else if (path === '/portfolio') page = <Portfolio progress={progress} update={update} />;
  else if (path === '/resources') page = <Resources />;
  else if (path === '/settings') page = <Settings progress={progress} update={update} />;
  else if (path === '/sample/website')
    page = (
      <div className="visual-sample-page">
        <div className="visual-sample-heading">
          <a className="back-link" href="#/mission/1">
            <ArrowLeft size={15} />
            Mission 1
          </a>
          <h1>Watch a website take shape.</h1>
        </div>
        <VisualWebsiteLesson standalone />
      </div>
    );
  else if (missionMatch && Number(missionMatch[1]) >= 1 && Number(missionMatch[1]) <= 30)
    page = (
      <MissionLesson
        key={`${missionMatch[1]}:${params.get('step') || ''}`}
        id={Number(missionMatch[1])}
        initialStep={
          params.has('step') && /^[0-4]$/.test(params.get('step') || '')
            ? Number(params.get('step'))
            : undefined
        }
        progress={progress}
        update={update}
      />
    );
  else if (lessonDay >= 1 && lessonDay <= 30)
    page = (
      <Lesson
        key={`${lessonDay}:${params.get('tab') || 'learn'}`}
        lesson={lessons[lessonDay - 1]}
        progress={progress}
        update={update}
        initialTab={params.get('tab') || undefined}
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
  if (path === '/sample/motion')
    return (
      <Suspense fallback={<p role="status">Opening the visual studio…</p>}>
        <MotionLesson />
      </Suspense>
    );
  return (
    <div className="app-shell studio-top-shell academy-shell">
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
      <header className="top-navbar">
        <div className="top-navbar-inner">
          <a href="#/" className="top-brand" aria-label="FDE Academy home">
            <span className="brand-mark">
              <Code2 size={20} />
            </span>
            <strong>FDE Academy</strong>
          </a>

          <nav className="top-nav-links" aria-label="Main navigation">
            {navigation.map((item) => (
              <a
                key={item.path}
                href={`#${legacyContext && item.path === '/' ? '/workshops' : legacyContext && item.path === '/curriculum' ? '/workshop-path' : item.path}`}
                aria-current={selectedPath === item.path ? 'page' : undefined}
                className={`top-nav-link ${selectedPath === item.path ? 'is-active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="top-navbar-actions">
            <button
              type="button"
              className="global-search"
              onClick={() => setSearchOpen(true)}
              aria-label="Search lessons"
            >
              <Search size={15} />
              <span>Search</span>
              <kbd>Ctrl K</kbd>
            </button>
            <a
              href="#/resources"
              className={`top-icon-link ${selectedPath === '/resources' ? 'is-active' : ''}`}
              title="Guides & Resources"
              aria-label="Guides and resources"
            >
              <BookOpen size={17} />
            </a>
            <a
              href="#/settings"
              className={`top-icon-link ${selectedPath === '/settings' ? 'is-active' : ''}`}
              title="Settings & Backup"
              aria-label="Settings and backup"
            >
              <SettingsIcon size={17} />
            </a>
            <AccountButton
              onOpenAccount={() => (signedIn ? setProfileOpen(true) : setAuthOpen(true))}
            />
            <button
              type="button"
              className="top-mobile-toggle"
              aria-label={menu ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menu && (
          <nav className="top-mobile-drawer" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <a
                key={item.path}
                href={`#${item.path}`}
                className={selectedPath === item.path ? 'is-active' : ''}
              >
                {item.label}
              </a>
            ))}
            <a href="#/resources" className={selectedPath === '/resources' ? 'is-active' : ''}>
              Resources
            </a>
            <a href="#/settings" className={selectedPath === '/settings' ? 'is-active' : ''}>
              Settings &amp; backup
            </a>
          </nav>
        )}
      </header>

      <div className="workspace studio-workspace">
        <main ref={main} id="main-content" className="main-content studio-main" tabIndex={-1}>
          {path !== '/' && path !== '/curriculum' && path !== '/practice' && path !== '/portfolio' && (
            <div className="sub-breadcrumb" aria-label="Current location">
              <a href={selectedPath === '/curriculum' ? '#/curriculum' : '#/'}>
                {selectedPath === '/curriculum' ? 'Learn' : 'Home'}
              </a>
              <ChevronRight size={13} />
              <span>
                {missionMatch
                  ? `Lesson ${Number(missionMatch[1])}: ${missions[Number(missionMatch[1]) - 1]?.title ?? ''}`
                  : section}
              </span>
            </div>
          )}
          {storageError && (
            <div className="storage-alert" role="alert">
              This browser could not save your latest changes.{' '}
              <a href="#/settings">Export a backup</a> before closing this page.
            </div>
          )}
          {legacyContext && (
            <div className="legacy-course-notice">
              Optional implementation workshops · Your original code, projects and progress are
              preserved. <a href="#/curriculum">Open the new concepts + AI core path.</a> Manual
              coding is optional in the core.
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
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthed={() => {
          setMentorProgress(loadMentorProgress());
          setAuthOpen(false);
        }}
      />
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        progress={mentorProgress}
        onProgressChange={(next) => setMentorProgress(next)}
      />
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
                href={`#/${legacyContext ? 'lesson' : 'mission'}/${lesson.day}`}
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
            href={`#/${legacyContext ? 'workshop-path' : 'curriculum'}?q=${encodeURIComponent(search)}`}
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
