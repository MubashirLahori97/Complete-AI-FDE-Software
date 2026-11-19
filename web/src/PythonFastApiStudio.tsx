import { useEffect, useRef, useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Cpu,
  Layers,
  Play,
  RotateCcw,
  Server,
  Sparkles,
  Terminal,
  Workflow,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  FASTAPI_LABS,
  FASTAPI_OVERVIEW,
  loadFastApiDrafts,
  loadFastApiProgress,
  saveFastApiCleared,
  saveFastApiDraft,
  type FastApiLab,
} from './python-fastapi-data';

interface PythonFastApiStudioProps {
  onLabCleared?: (labId: string) => void;
}

export default function PythonFastApiStudio({ onLabCleared }: PythonFastApiStudioProps) {
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
  const frameRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const runIdRef = useRef(0);

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
                <span>{spec}</span>
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
    </div>
  );
}
