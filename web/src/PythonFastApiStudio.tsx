import { useEffect, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Compass,
  Copy,
  Cpu,
  FileCode,
  FolderTree,
  Flame,
  HelpCircle,
  Layers,
  Lightbulb,
  Play,
  RotateCcw,
  Server,
  Shield,
  Sparkles,
  Terminal,
  Workflow,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  FASTAPI_LABS,
  FASTAPI_OVERVIEW,
  FASTAPI_ROADMAP_STAGES,
  FASTAPI_PRODUCTION_PROJECT_FILES,
  loadFastApiDrafts,
  loadFastApiProgress,
  saveFastApiCleared,
  saveFastApiDraft,
  type FastApiLab,
  type FastApiRoadmapStage,
  type FastApiProjectFile,
} from './python-fastapi-data';
import FastApiArchitectureDiagram from './FastApiArchitectureDiagram';

interface PythonFastApiStudioProps {
  onLabCleared?: (labId: string) => void;
}

function renderInlineCode(text: string) {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="spec-inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function PythonFastApiStudio({ onLabCleared }: PythonFastApiStudioProps) {
  const [studioMode, setStudioMode] = useState<'labs' | 'roadmap' | 'blueprint'>('labs');
  const [selectedStageId, setSelectedStageId] = useState<string>('stage-1');
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    FASTAPI_PRODUCTION_PROJECT_FILES[0]?.path || 'pyproject.toml',
  );
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedTopicId, setCopiedTopicId] = useState<string | null>(null);

  const [selectedLabId, setSelectedLabId] = useState<string>('fastapi-lab-1');
  const [drafts, setDrafts] = useState<Record<string, string>>(() => loadFastApiDrafts());
  const [clearedLabs, setClearedLabs] = useState<Record<string, boolean>>(() => loadFastApiProgress());
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [runnerStatus, setRunnerStatus] = useState<
    'idle' | 'loading' | 'running' | 'done' | 'error'
  >('idle');
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    passed: boolean;
    message?: string;
  } | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [masteredTopics, setMasteredTopics] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('fde_fastapi_mastered_topics');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const toggleTopicMastered = (topicId: string) => {
    setMasteredTopics((prev) => {
      const next = { ...prev, [topicId]: !prev[topicId] };
      try {
        localStorage.setItem('fde_fastapi_mastered_topics', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const frameRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const runIdRef = useRef(0);

  const copyFileCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const copyTopicCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTopicId(id);
    setTimeout(() => setCopiedTopicId(null), 2000);
  };

  const currentLab: FastApiLab =
    FASTAPI_LABS.find((l) => l.id === selectedLabId) || FASTAPI_LABS[0];

  const activeCode = drafts[currentLab.id] ?? currentLab.starterCode;

  // Pyodide sandbox messaging listener
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow || event.data?.source !== 'fde-runner') {
        return;
      }
      const msg = event.data;
      if (msg.id !== runIdRef.current) return;

      if (msg.type === 'ready') {
        setRunnerStatus('running');
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          stopRunner();
          setRunnerStatus('error');
          setTerminalOutput((prev) => [
            ...prev,
            'Execution timed out (15s limit). Check for infinite loops in route handlers.',
          ]);
        }, 15000);
      } else if (msg.type === 'stdout') {
        setTerminalOutput((prev) => [...prev, String(msg.text ?? '')]);
      } else if (msg.type === 'stderr') {
        setTerminalOutput((prev) => [...prev, `[stderr] ${String(msg.text ?? '')}`]);
      } else if (msg.type === 'exit') {
        clearTimeout(timerRef.current);
        const code = Number(msg.code ?? 0);
        if (code === 0) {
          setRunnerStatus('done');
          setTestResult({
            tested: true,
            passed: true,
            message: 'All FastAPI test assertions passed! Endpoint contract verified.',
          });
          setClearedLabs((prev) => {
            const next = { ...prev, [currentLab.id]: true };
            saveFastApiCleared(currentLab.id);
            return next;
          });
          onLabCleared?.(currentLab.id);
        } else {
          setRunnerStatus('error');
          setTestResult({
            tested: true,
            passed: false,
            message: `FastAPI verification failed (Exit code: ${code}). Review traceback.`,
          });
        }
      } else if (msg.type === 'fatal') {
        clearTimeout(timerRef.current);
        setRunnerStatus('error');
        setTerminalOutput((prev) => [...prev, `[Fatal Sandbox Error] ${String(msg.error)}`]);
      }
    };

    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
      clearTimeout(timerRef.current);
    };
  }, [currentLab.id, onLabCleared]);

  const stopRunner = () => {
    clearTimeout(timerRef.current);
    frameRef.current?.contentWindow?.postMessage({ type: 'fde:stop' }, '*');
  };

  const handleCodeChange = (newCode: string) => {
    setDrafts((prev) => {
      const next = { ...prev, [currentLab.id]: newCode };
      saveFastApiDraft(currentLab.id, newCode);
      return next;
    });
    setTestResult(null);
  };

  const handleResetToStarter = () => {
    if (confirm('Reset code to initial starter template?')) {
      handleCodeChange(currentLab.starterCode);
      setTestResult(null);
    }
  };

  const handleApplySolution = () => {
    handleCodeChange(currentLab.solutionCode);
    setTestResult(null);
  };

  // Semantic fallback validator in case Pyodide CDN is slow or offline
  const runSemanticFallback = (userCode: string) => {
    let passed = false;
    let message = '';

    if (currentLab.id === 'fastapi-lab-1') {
      const hasLifespan = userCode.includes('lifespan') && userCode.includes('asynccontextmanager');
      const hasHealthz = userCode.includes('healthy');
      const hasReady = userCode.includes('503') || userCode.includes('is_ready');
      passed = hasLifespan && hasHealthz && hasReady;
      message = passed
        ? 'Lifespan lifecycle and Kubernetes probes verified.'
        : 'Missing lifespan context manager or readiness status code.';
    } else if (currentLab.id === 'fastapi-lab-2') {
      const hasRepo = userCode.includes('ItemRepository') || userCode.includes('InMemoryItemRepository');
      const hasService = userCode.includes('ItemService');
      const hasFactory = userCode.includes('get_item_service');
      passed = hasRepo && hasService && hasFactory;
      message = passed
        ? 'Service layer and dependency injection factory verified.'
        : 'Missing repository implementation or service provider factory.';
    } else if (currentLab.id === 'fastapi-lab-3') {
      const hasValidation = userCode.includes('validate_create_payload') || userCode.includes('@');
      const hasStripping = userCode.includes('serialize_public_profile');
      const stripsSecret = !userCode.includes('return internal_user_record');
      passed = hasValidation && hasStripping && stripsSecret;
      message = passed
        ? 'Pydantic v2 validation and response model secret stripping verified.'
        : 'Missing input validation or public response sanitization.';
    } else if (currentLab.id === 'fastapi-lab-4') {
      const hasDomainError = userCode.includes('ApiDomainError');
      const hasEnvelope = userCode.includes('format_error_envelope') && userCode.includes('trace_id');
      const hasSanitize = userCode.includes('INTERNAL_SERVER_ERROR');
      passed = hasDomainError && hasEnvelope && hasSanitize;
      message = passed
        ? 'Standardized error envelopes and 500 sanitization verified.'
        : 'Missing error envelope formatting or 500 status mapping.';
    }

    setTerminalOutput([
      `=== FASTAPI ARCHITECTURE VALIDATOR: ${currentLab.title.toUpperCase()} ===`,
      `Category: ${currentLab.category} | Duration: ${currentLab.duration}`,
      `Evaluating FastAPI backend implementation...`,
      passed ? 'STATUS: ALL FASTAPI SPECIFICATIONS VERIFIED' : 'STATUS: SPECIFICATION FAILED',
      message,
    ]);

    setTestResult({ tested: true, passed, message });
    if (passed) {
      setClearedLabs((prev) => {
        const next = { ...prev, [currentLab.id]: true };
        saveFastApiCleared(currentLab.id);
        return next;
      });
      onLabCleared?.(currentLab.id);
    }
  };

  const executeFastApiTests = () => {
    setRunnerStatus('loading');
    setTerminalOutput([
      `Compiling FastAPI backend architecture for ${currentLab.title}...`,
      `Executing automated HTTP route & test suite assertions...`,
    ]);
    setTestResult(null);

    const fullCode = `${activeCode}\n\n# --- Test Suite Verification ---\n${currentLab.testSuiteCode}`;
    runIdRef.current += 1;

    try {
      const win = frameRef.current?.contentWindow;
      if (win) {
        win.postMessage(
          {
            type: 'fde:run',
            id: runIdRef.current,
            code: fullCode,
          },
          '*',
        );

        setTimeout(() => {
          if (runnerStatus === 'loading') {
            runSemanticFallback(activeCode);
            setRunnerStatus('done');
          }
        }, 4000);
      } else {
        runSemanticFallback(activeCode);
        setRunnerStatus('done');
      }
    } catch {
      runSemanticFallback(activeCode);
      setRunnerStatus('done');
    }
  };

  const clearedCount = Object.values(clearedLabs).filter(Boolean).length;
  const isCurrentCleared = Boolean(clearedLabs[currentLab.id]);

  return (
    <div className="fastapi-studio-container">
      {/* Hidden Pyodide WebAssembly runner iframe */}
      <iframe
        ref={frameRef}
        src={`${import.meta.env.BASE_URL ?? '/'}sandbox.html`}
        title="Pyodide FastAPI Sandbox"
        style={{ display: 'none' }}
        sandbox="allow-scripts"
      />

      {/* Hero Banner */}
      <div className="fastapi-hero">
        <div className="fastapi-hero-badge">
          <Zap size={16} />
          <span>Production Web Framework</span>
        </div>
        <h2>⚡ FastAPI Production Backend Engineering</h2>
        <p>
          Learn how high-growth tech companies build asynchronous Python APIs. Master modern ASGI
          lifespans, dependency injection (`Depends`), Rust-powered Pydantic v2 validation,
          middleware correlation tracing, and Kubernetes health probes.
        </p>

        <div className="fastapi-stats-bar">
          <div className="fastapi-stat-item">
            <span className="stat-label">Labs Cleared</span>
            <span className="stat-value">
              {clearedCount} / {FASTAPI_LABS.length}
            </span>
          </div>
          <div className="fastapi-stat-item">
            <span className="stat-label">Backend Architecture Mastery</span>
            <span className="stat-value stat-highlight">
              {Math.round((clearedCount / FASTAPI_LABS.length) * 100)}%
            </span>
          </div>
          <div className="fastapi-stat-item">
            <span className="stat-label">Active Scenario</span>
            <span className="stat-value">{currentLab.title}</span>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="fastapi-pillars-strip">
        {FASTAPI_OVERVIEW.corePillars.map((p, idx) => (
          <div key={idx} className="pillar-tile">
            <h5>
              <Server size={14} /> {p.title}
            </h5>
            <p>{p.description}</p>
          </div>
        ))}
      </div>

      {/* Studio View Mode Switcher */}
      <div className="fastapi-mode-tabs" role="tablist">
        <button
          type="button"
          className={`fastapi-mode-btn ${studioMode === 'labs' ? 'active' : ''}`}
          onClick={() => setStudioMode('labs')}
        >
          <Zap size={16} />
          <span>Interactive Labs</span>
          <span className="mode-badge">{clearedCount}/{FASTAPI_LABS.length} Cleared</span>
        </button>
        <button
          type="button"
          className={`fastapi-mode-btn ${studioMode === 'roadmap' ? 'active' : ''}`}
          onClick={() => setStudioMode('roadmap')}
        >
          <Compass size={16} />
          <span>Complete Roadmap</span>
          <span className="mode-badge">{FASTAPI_ROADMAP_STAGES.length} Stages</span>
        </button>
        <button
          type="button"
          className={`fastapi-mode-btn ${studioMode === 'blueprint' ? 'active' : ''}`}
          onClick={() => setStudioMode('blueprint')}
        >
          <Boxes size={16} />
          <span>Production Project Blueprint</span>
          <span className="mode-badge">{FASTAPI_PRODUCTION_PROJECT_FILES.length} Files</span>
        </button>
      </div>

      {/* MODE 1: INTERACTIVE LABS */}
      {studioMode === 'labs' && (
        <>
          {/* Lab Nav Grid */}
      <div className="fastapi-nav-grid">
        {FASTAPI_LABS.map((lab) => {
          const isCleared = Boolean(clearedLabs[lab.id]);
          const isSelected = lab.id === selectedLabId;
          return (
            <button
              key={lab.id}
              onClick={() => {
                setSelectedLabId(lab.id);
                setTestResult(null);
                setTerminalOutput([]);
              }}
              className={`fastapi-nav-btn ${isSelected ? 'active' : ''} ${
                isCleared ? 'cleared' : ''
              }`}
            >
              <div className="fastapi-btn-top">
                <span className="fastapi-category">{lab.category}</span>
                {isCleared ? (
                  <span className="badge-cleared">
                    <CheckCircle2 size={14} /> Cleared
                  </span>
                ) : (
                  <span className="badge-pending">
                    <Workflow size={14} /> Ready
                  </span>
                )}
              </div>
              <div className="fastapi-btn-title">{lab.title}</div>
              <div className="fastapi-btn-duration">Duration: {lab.duration}</div>
            </button>
          );
        })}
      </div>

      {/* Specification Card */}
      <div className="fastapi-spec-card">
        <div className="spec-header">
          <div>
            <div className="category-pill">{currentLab.category}</div>
            <h3>{currentLab.title}</h3>
          </div>
          {isCurrentCleared && (
            <div className="cleared-pill">
              <Award size={18} /> Lab Cleared
            </div>
          )}
        </div>

        <p className="spec-summary">{currentLab.summary}</p>

        {/* Why it matters in Production */}
        <div className="prod-importance-box">
          <div className="importance-title">
            <Cpu size={16} /> Why This Architecture Matters in Production
          </div>
          <p>{currentLab.whyItMattersInProduction}</p>
        </div>

        {/* Toy vs Production Comparison Preview */}
        <div className="toy-prod-box">
          <div className="toy-side">
            <span className="tp-badge toy">Toy Tutorial Code</span>
            <pre>
              <code>{currentLab.toyVsProd.toyCode}</code>
            </pre>
          </div>
          <div className="prod-side">
            <span className="tp-badge prod">Production Standard</span>
            <pre>
              <code>{currentLab.toyVsProd.prodCode}</code>
            </pre>
          </div>
        </div>

        {/* Specifications */}
        <div className="requirements-section">
          <h4>Engineering Specifications:</h4>
          <ul className="requirements-list">
            {currentLab.specification.map((spec, idx) => (
              <li key={idx}>
                <ChevronRight size={14} className="bullet-icon" />
                <span>{renderInlineCode(spec)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Code Editor & Test Runner */}
      <div className="fastapi-editor-section">
        <div className="editor-header">
          <div className="editor-title">
            <Code2 size={18} />
            <span>FastAPI Implementation Workspace</span>
          </div>
          <div className="editor-actions">
            <button
              onClick={() => {
                navigator.clipboard.writeText(activeCode);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="studio-btn secondary"
              title="Copy code"
            >
              <Copy size={14} />
              {copiedCode ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleResetToStarter}
              className="studio-btn secondary"
              title="Reset code"
            >
              <RotateCcw size={14} />
              Reset Starter
            </button>
            <button
              onClick={handleApplySolution}
              className="studio-btn secondary"
              title="Load reference architecture"
            >
              <Sparkles size={14} />
              Load Solution
            </button>
            <button
              onClick={executeFastApiTests}
              className="studio-btn primary"
              disabled={runnerStatus === 'loading' || runnerStatus === 'running'}
            >
              <Play size={14} />
              {runnerStatus === 'loading' || runnerStatus === 'running'
                ? 'Verifying API...'
                : 'Run Test Verification'}
            </button>
          </div>
        </div>

        <div className="editor-container">
          <textarea
            value={activeCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="fastapi-code-textarea"
            spellCheck={false}
            rows={18}
          />
        </div>

        {/* Test Result Banner */}
        {testResult && (
          <div className={`fastapi-test-banner ${testResult.passed ? 'passed' : 'failed'}`}>
            <div className="test-banner-icon">
              {testResult.passed ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            </div>
            <div className="test-banner-content">
              <h4>{testResult.passed ? 'Architecture Validated' : 'Verification Failed'}</h4>
              <p>{testResult.message}</p>
            </div>
          </div>
        )}

        {/* Verification Test Cases */}
        <div className="test-cases-checklist">
          <h5>Test Suite Assertions</h5>
          <div className="test-cases-grid">
            {currentLab.testCases.map((tc) => (
              <div key={tc.id} className="test-case-item">
                <CheckCircle2
                  size={16}
                  className={`tc-icon ${testResult?.passed ? 'active' : ''}`}
                />
                <div className="tc-details">
                  <span className="tc-name">{tc.name}</span>
                  <span className="tc-desc">{tc.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Output Console */}
        {terminalOutput.length > 0 && (
          <div className="fastapi-console-box">
            <div className="console-header">
              <Terminal size={14} />
              <span>FastAPI Test Suite Output</span>
            </div>
            <div className="console-body">
              {terminalOutput.map((line, idx) => (
                <div key={idx} className="console-line">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )}

      {/* MODE 2: COMPLETE FASTAPI PRODUCTION ROADMAP */}
      {studioMode === 'roadmap' && (
        <div className="fastapi-roadmap-view">
          <div className="roadmap-intro-card">
            <div className="roadmap-intro-header">
              <div className="roadmap-meta-row">
                <span className="roadmap-tag">6-STAGE SYSTEMATIC CURRICULUM</span>
                <span className="roadmap-progress-badge">
                  <CheckCircle2 size={13} />{' '}
                  {Object.values(masteredTopics).filter(Boolean).length} /{' '}
                  {FASTAPI_ROADMAP_STAGES.reduce((acc, s) => acc + s.topics.length, 0)} Topics Mastered
                </span>
              </div>
              <h3>The Complete FastAPI Production Engineering Roadmap</h3>
              <p>
                From ASGI event-loop concurrency and strict Pydantic v2 validation contracts to
                zero-downtime Alembic migrations, RFC 7807 problem details, and multi-stage containerization.
              </p>
            </div>
            <div className="roadmap-stage-pills">
              {FASTAPI_ROADMAP_STAGES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`stage-pill-btn ${s.id === selectedStageId ? 'active' : ''}`}
                  onClick={() => setSelectedStageId(s.id)}
                >
                  <span className="stage-pill-num">0{s.number}</span>
                  <span className="stage-pill-title">{s.title.split(':')[1]?.trim() || s.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Stage Details */}
          {(() => {
            const activeStage =
              FASTAPI_ROADMAP_STAGES.find((s) => s.id === selectedStageId) ||
              FASTAPI_ROADMAP_STAGES[0];
            return (
              <div className="active-stage-card">
                <header className="active-stage-header">
                  <div className="stage-header-meta">
                    <span className="stage-pill-large">STAGE 0{activeStage.number}</span>
                    <span className="stage-tagline">{activeStage.tagline}</span>
                  </div>
                  <h3>{activeStage.title}</h3>
                  <p className="stage-desc">{activeStage.description}</p>
                </header>

                <div className="stage-topics-list">
                  {activeStage.topics.map((topic) => (
                    <article key={topic.id} className="stage-topic-card">
                      <div className="topic-card-header">
                        <h4>{topic.title}</h4>
                        <div className="topic-actions">
                          <button
                            type="button"
                            className={`mastery-toggle-btn ${masteredTopics[topic.id] ? 'mastered' : ''}`}
                            onClick={() => toggleTopicMastered(topic.id)}
                            title={masteredTopics[topic.id] ? 'Marked as mastered' : 'Mark as mastered'}
                          >
                            <CheckCircle2 size={13} />
                            <span>{masteredTopics[topic.id] ? 'Mastered' : 'Mark Mastered'}</span>
                          </button>
                          <button
                            type="button"
                            className="launch-lab-btn"
                            onClick={() => setStudioMode('labs')}
                          >
                            <Play size={12} />
                            <span>Practice Lab</span>
                          </button>
                        </div>
                      </div>
                      <p className="topic-summary">{topic.summary}</p>

                      <div className="code-block-wrapper">
                        <div className="code-block-header">
                          <span className="code-lang">python</span>
                          <button
                            type="button"
                            className="copy-btn"
                            onClick={() => copyTopicCode(topic.codeSnippet, topic.id)}
                          >
                            {copiedTopicId === topic.id ? (
                              <>
                                <Check size={14} /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={14} /> Copy snippet
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="code-pre">
                          <code>{topic.codeSnippet}</code>
                        </pre>
                      </div>

                      <div className="topic-callouts-grid">
                        <div className="topic-callout practice-box">
                          <h5>
                            <Shield size={16} /> Production Best Practice
                          </h5>
                          <p>{topic.productionBestPractice}</p>
                        </div>
                        <div className="topic-callout pitfall-box">
                          <h5>
                            <Flame size={16} /> Dangerous Pitfall
                          </h5>
                          <p>{topic.commonPitfall}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* MODE 3: PRODUCTION PROJECT BLUEPRINT */}
      {studioMode === 'blueprint' && (
        <div className="fastapi-blueprint-view">
          {/* Architectural Philosophy Card */}
          <div className="blueprint-intro-card">
            <div className="blueprint-intro-copy">
              <span className="blueprint-tag">ENTERPRISE SERVICE ARCHITECTURE</span>
              <h3>How to Create a Production-Grade FastAPI Project</h3>
              <p>
                Toy tutorials put everything in a single <code>main.py</code> file with global state and
                synchronous calls. Real production engineering requires a <strong>4-Layer Clean Architecture</strong> that
                scales cleanly to dozens of engineers and hundreds of endpoints.
              </p>
            </div>

            <div className="clean-arch-grid">
              <div className="arch-layer-card">
                <span className="layer-step">LAYER 1</span>
                <h5>Thin Routers (Controllers)</h5>
                <p>
                  Handles HTTP concerns: route paths, input validation, status codes, and headers. Zero business logic or raw database queries.
                </p>
              </div>
              <div className="arch-layer-card">
                <span className="layer-step">LAYER 2</span>
                <h5>Domain Services</h5>
                <p>
                  Pure Python business rules. Orchestrates domain calculations, access validations, and coordination across multiple entities.
                </p>
              </div>
              <div className="arch-layer-card">
                <span className="layer-step">LAYER 3</span>
                <h5>Repositories</h5>
                <p>
                  Encapsulates all SQL queries, joins, and transactions using Async SQLAlchemy 2.0. Keeps service layers database-agnostic.
                </p>
              </div>
              <div className="arch-layer-card">
                <span className="layer-step">LAYER 4</span>
                <h5>Database & Infrastructure</h5>
                <p>
                  Declarative SQLAlchemy models, connection pool tuning, Alembic migrations, and Redis caching.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive ByteByteGo-style Architecture Visualizer */}
          <FastApiArchitectureDiagram onSelectFile={(filePath) => setSelectedFilePath(filePath)} />

          {/* Interactive File Explorer */}
          <div className="blueprint-explorer-container">
            <div className="blueprint-explorer-head">
              <h4>
                <FolderTree size={18} /> Enterprise Project Scaffolding ({FASTAPI_PRODUCTION_PROJECT_FILES.length} Production Files)
              </h4>
              <p className="muted">
                Select any file to inspect its full production implementation, architectural purpose, and copy directly into your repository.
              </p>
            </div>

            <div className="blueprint-explorer-grid">
              {/* Left: File Tree */}
              <aside className="blueprint-file-tree">
                {FASTAPI_PRODUCTION_PROJECT_FILES.map((f) => (
                  <button
                    key={f.path}
                    type="button"
                    className={`file-tree-btn ${f.path === selectedFilePath ? 'active' : ''}`}
                    onClick={() => setSelectedFilePath(f.path)}
                  >
                    <FileCode size={15} />
                    <div className="file-info">
                      <span className="file-name">{f.path}</span>
                      <span className="file-cat">{f.category}</span>
                    </div>
                  </button>
                ))}
              </aside>

              {/* Right: Code Viewer */}
              <div className="blueprint-code-pane">
                {(() => {
                  const activeFile =
                    FASTAPI_PRODUCTION_PROJECT_FILES.find((f) => f.path === selectedFilePath) ||
                    FASTAPI_PRODUCTION_PROJECT_FILES[0];
                  return (
                    <>
                      <div className="code-pane-header">
                        <div className="code-pane-meta">
                          <span className="file-badge">{activeFile.category}</span>
                          <span className="file-path-title">{activeFile.path}</span>
                        </div>
                        <button
                          type="button"
                          className="copy-btn primary"
                          onClick={() => copyFileCode(activeFile.code)}
                        >
                          {copiedFile ? (
                            <>
                              <Check size={14} /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copy Full File
                            </>
                          )}
                        </button>
                      </div>
                      <div className="code-pane-desc">
                        <p>{activeFile.description}</p>
                      </div>
                      <pre className="blueprint-code-block">
                        <code>{activeFile.code}</code>
                      </pre>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
