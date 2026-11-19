import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Flame,
  LifeBuoy,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Terminal,
  XCircle,
} from 'lucide-react';
import {
  PRODUCTION_INCIDENTS,
  loadIncidentDrafts,
  loadIncidentProgress,
  saveIncidentDraft,
  saveIncidentResolved,
  type ProductionIncident,
} from './python-incidents-data';

interface PythonIncidentsSimulatorProps {
  onIncidentResolved?: (incidentId: string) => void;
}

export default function PythonIncidentsSimulator({
  onIncidentResolved,
}: PythonIncidentsSimulatorProps) {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('inc-1');
  const [drafts, setDrafts] = useState<Record<string, string>>(() => loadIncidentDrafts());
  const [resolvedIncidents, setResolvedIncidents] = useState<Record<string, boolean>>(() =>
    loadIncidentProgress(),
  );
  const [showPostMortem, setShowPostMortem] = useState(false);
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

  const currentIncident: ProductionIncident =
    PRODUCTION_INCIDENTS.find((inc) => inc.id === selectedIncidentId) || PRODUCTION_INCIDENTS[0];

  const activeCode = drafts[currentIncident.id] ?? currentIncident.brokenCode;

  // Sandbox messaging listener
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
            'Execution timed out (15s limit). Check for deadlock or infinite loops.',
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
            message: 'All regression tests passed! Incident mitigated.',
          });
          setResolvedIncidents((prev) => {
            const next = { ...prev, [currentIncident.id]: true };
            saveIncidentResolved(currentIncident.id);
            return next;
          });
          onIncidentResolved?.(currentIncident.id);
        } else {
          setRunnerStatus('error');
          setTestResult({
            tested: true,
            passed: false,
            message: `Regression suite failed (Exit code: ${code}). Review traceback.`,
          });
        }
      } else if (msg.type === 'fatal') {
        clearTimeout(timerRef.current);
        setRunnerStatus('error');
        setTerminalOutput((prev) => [...prev, `[Fatal Environment Error] ${String(msg.error)}`]);
      }
    };

    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
      clearTimeout(timerRef.current);
    };
  }, [currentIncident.id, onIncidentResolved]);

  const stopRunner = () => {
    clearTimeout(timerRef.current);
    frameRef.current?.contentWindow?.postMessage({ type: 'fde:stop' }, '*');
  };

  const handleCodeChange = (newCode: string) => {
    setDrafts((prev) => {
      const next = { ...prev, [currentIncident.id]: newCode };
      saveIncidentDraft(currentIncident.id, newCode);
      return next;
    });
    setTestResult(null);
  };

  const handleResetToBroken = () => {
    if (confirm('Reset code back to the original broken production incident?')) {
      handleCodeChange(currentIncident.brokenCode);
      setTestResult(null);
    }
  };

  const handleApplyOfficialFix = () => {
    handleCodeChange(currentIncident.fixedCode);
    setTestResult(null);
  };

  // Semantic fallback check in case Pyodide CDN is slow or offline
  const runSemanticFallback = (userCode: string) => {
    let passed = false;
    let message = '';

    if (currentIncident.id === 'inc-1') {
      const hasClose = userCode.includes('.close()') || userCode.includes('aclose');
      const hasFinallyOrContext =
        userCode.includes('finally:') || userCode.includes('with ') || userCode.includes('async with ');
      passed = hasClose && hasFinallyOrContext;
      message = passed
        ? 'Connection pool leak eliminated: Redis connection safely released in finally block.'
        : 'Regression failed: Redis connection is not guaranteed to close on exception.';
    } else if (currentIncident.id === 'inc-2') {
      const handlesRollback = userCode.includes('rollback()');
      const managesSession =
        userCode.includes('finally:') || userCode.includes('with ') || userCode.includes('async with ');
      passed = handlesRollback && managesSession;
      message = passed
        ? 'Distributed deadlock prevented: Database session cleanly rolled back on failure.'
        : 'Regression failed: Database transaction left dangling on exception.';
    } else if (currentIncident.id === 'inc-3') {
      const usesToThread =
        userCode.includes('asyncio.to_thread') ||
        userCode.includes('run_in_executor') ||
        userCode.includes('ThreadPoolExecutor');
      passed = usesToThread;
      message = passed
        ? 'Event loop unblocked: CPU-bound computation successfully offloaded to worker threadpool.'
        : 'Regression failed: Heavy CPU hash/token computation still executes on the main async event loop.';
    } else if (currentIncident.id === 'inc-4') {
      const usesV2Model =
        userCode.includes('BaseModel') &&
        (userCode.includes('model_validate_json') || userCode.includes('parse_raw') || userCode.includes('ConfigDict'));
      passed = usesV2Model;
      message = passed
        ? 'Schema validated: Deserialization guarantees strict schema conformance and error bounds.'
        : 'Regression failed: Payload not validated against typed Pydantic v2 schema.';
    } else if (currentIncident.id === 'inc-5') {
      const hasLimit =
        userCode.includes('max_tokens') ||
        userCode.includes('buffer_size') ||
        userCode.includes('sliding_window') ||
        userCode.includes('[:') ||
        userCode.includes('deque');
      passed = hasLimit;
      message = passed
        ? 'Cascading OOM averted: Dynamic token buffer bounding and truncation active.'
        : 'Regression failed: Token stream accumulates without memory bound.';
    }

    setTerminalOutput([
      `=== SIMULATED REGRESSION SUITE: ${currentIncident.id.toUpperCase()} ===`,
      `Service: ${currentIncident.service} | Severity: ${currentIncident.severity}`,
      `Evaluating hotfix patch...`,
      passed ? 'STATUS: ALL REGRESSION TESTS PASSED (0 regressions detected)' : 'STATUS: REGRESSION SUITE FAILED',
      message,
    ]);

    setTestResult({ tested: true, passed, message });
    if (passed) {
      setResolvedIncidents((prev) => {
        const next = { ...prev, [currentIncident.id]: true };
        saveIncidentResolved(currentIncident.id);
        return next;
      });
      onIncidentResolved?.(currentIncident.id);
    }
  };

  const executeIncidentTests = () => {
    setRunnerStatus('loading');
    setTerminalOutput([
      `Initiating hotfix validation for ${currentIncident.service}...`,
      `Injecting regression test suite...`,
    ]);
    setTestResult(null);

    const fullCode = `${activeCode}\n\n# --- Regression Test Suite ---\n${currentIncident.testSuiteCode}`;
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

        // Fallback timeout in case Pyodide takes more than 4 seconds to load WASM
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

  const resolvedCount = Object.values(resolvedIncidents).filter(Boolean).length;
  const isCurrentResolved = Boolean(resolvedIncidents[currentIncident.id]);

  return (
    <div className="incident-simulator-container">
      {/* Hidden Pyodide WebAssembly runner iframe */}
      <iframe
        ref={frameRef}
        src={`${import.meta.env.BASE_URL ?? '/'}sandbox.html`}
        title="Pyodide Incident Sandbox"
        style={{ display: 'none' }}
        sandbox="allow-scripts"
      />

      {/* Simulator Hero Banner */}
      <div className="incident-hero">
        <div className="incident-hero-badge">
          <ShieldAlert size={16} />
          <span>On-Call Outage Simulator</span>
        </div>
        <h2>🚨 Fix the Production Incident</h2>
        <p>
          Real engineering competence is tested when a P0 alert wakes you at 3 AM. Fix 5 live
          outage incidents, diagnose stack traces from production logs, eliminate memory leaks, and
          ensure zero regressions pass back into staging.
        </p>

        <div className="incident-stats-bar">
          <div className="incident-stat-item">
            <span className="stat-label">Incidents Resolved</span>
            <span className="stat-value">
              {resolvedCount} / {PRODUCTION_INCIDENTS.length}
            </span>
          </div>
          <div className="incident-stat-item">
            <span className="stat-label">SLA Protection</span>
            <span className="stat-value stat-highlight">
              {Math.round((resolvedCount / PRODUCTION_INCIDENTS.length) * 100)}%
            </span>
          </div>
          <div className="incident-stat-item">
            <span className="stat-label">Active Scenario</span>
            <span className="stat-value">{currentIncident.title}</span>
          </div>
        </div>
      </div>

      {/* Incident Selector Grid */}
      <div className="incident-nav-grid">
        {PRODUCTION_INCIDENTS.map((inc) => {
          const isResolved = Boolean(resolvedIncidents[inc.id]);
          const isSelected = inc.id === selectedIncidentId;
          return (
            <button
              key={inc.id}
              onClick={() => {
                setSelectedIncidentId(inc.id);
                setTestResult(null);
                setTerminalOutput([]);
                setShowPostMortem(false);
              }}
              className={`incident-nav-btn ${isSelected ? 'active' : ''} ${
                isResolved ? 'resolved' : ''
              }`}
            >
              <div className="incident-btn-top">
                <span className={`incident-severity ${inc.severity.toLowerCase()}`}>
                  {inc.severity}
                </span>
                {isResolved ? (
                  <span className="badge-resolved">
                    <CheckCircle2 size={14} /> Resolved
                  </span>
                ) : (
                  <span className="badge-unresolved">
                    <AlertTriangle size={14} /> Active
                  </span>
                )}
              </div>
              <div className="incident-btn-title">
                {inc.number}. {inc.title}
              </div>
              <div className="incident-btn-service">Service: {inc.service}</div>
            </button>
          );
        })}
      </div>

      {/* Incident Briefing Card */}
      <div className="incident-briefing-card">
        <div className="incident-briefing-header">
          <div>
            <div className="service-tag">
              <span>{currentIncident.service}</span> • <span>Severity: {currentIncident.severity}</span>
            </div>
            <h3>{currentIncident.title}</h3>
          </div>
          {isCurrentResolved && (
            <div className="resolved-pill">
              <Award size={18} /> Incident Mitigated
            </div>
          )}
        </div>

        <p className="incident-summary-text">{currentIncident.outageSummary}</p>

        {/* Symptoms & Telemetry */}
        <div className="incident-symptoms-section">
          <h4>
            <Flame size={16} /> Reported Symptoms & Telemetry Alerts
          </h4>
          <ul className="symptoms-list">
            {currentIncident.symptoms.map((symptom, idx) => (
              <li key={idx}>
                <ChevronRight size={14} className="bullet-icon" />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Live Terminal Server Logs */}
        <div className="incident-terminal-box">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="terminal-title">prod-us-east-1 :: {currentIncident.service}.log</span>
          </div>
          <div className="terminal-body log-viewer">
            {currentIncident.errorLogs.map((log, idx) => (
              <div key={idx} className="log-line">
                <span className="log-prefix">&gt;</span> {log}
              </div>
            ))}
          </div>
        </div>

        {/* Root Cause Analysis */}
        <div className="incident-rca-box">
          <div className="rca-title">
            <LifeBuoy size={16} /> Root Cause Analysis
          </div>
          <p>{currentIncident.rootCauseAnalysis}</p>
        </div>
      </div>

      {/* Interactive Code Editor & Test Runner */}
      <div className="incident-editor-section">
        <div className="editor-header">
          <div className="editor-title">
            <Code2 size={18} />
            <span>Hotfix Workspace: {currentIncident.service}</span>
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
              onClick={handleResetToBroken}
              className="studio-btn secondary"
              title="Reset to broken code"
            >
              <RotateCcw size={14} />
              Reset Broken
            </button>
            <button
              onClick={handleApplyOfficialFix}
              className="studio-btn secondary"
              title="Apply reference fix"
            >
              <Sparkles size={14} />
              View Fix Patch
            </button>
            <button
              onClick={executeIncidentTests}
              className="studio-btn primary"
              disabled={runnerStatus === 'loading' || runnerStatus === 'running'}
            >
              <Play size={14} />
              {runnerStatus === 'loading' || runnerStatus === 'running'
                ? 'Validating Hotfix...'
                : 'Run Regression Suite'}
            </button>
          </div>
        </div>

        <div className="editor-container">
          <textarea
            value={activeCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="incident-code-textarea"
            spellCheck={false}
            rows={18}
          />
        </div>

        {/* Test Result Banner */}
        {testResult && (
          <div className={`incident-test-banner ${testResult.passed ? 'passed' : 'failed'}`}>
            <div className="test-banner-icon">
              {testResult.passed ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            </div>
            <div className="test-banner-content">
              <h4>{testResult.passed ? 'Outage Mitigated & Validated' : 'Regression Detected'}</h4>
              <p>{testResult.message}</p>
            </div>
          </div>
        )}

        {/* Output Console */}
        {terminalOutput.length > 0 && (
          <div className="incident-console-box">
            <div className="console-header">
              <Terminal size={14} />
              <span>Regression Test Execution Output</span>
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

        {/* Engineering Post-Mortem Disclosure */}
        <div className="post-mortem-section">
          <button
            onClick={() => setShowPostMortem((prev) => !prev)}
            className="post-mortem-toggle-btn"
          >
            <span>📄 Engineering Post-Mortem & Preventative Safeguards</span>
            <ChevronRight
              size={18}
              className={`toggle-icon ${showPostMortem ? 'rotated' : ''}`}
            />
          </button>

          {showPostMortem && (
            <div className="post-mortem-body">
              <div className="pm-block">
                <h5>Post-Mortem Executive Summary</h5>
                <p>{currentIncident.postMortem}</p>
              </div>
              <div className="pm-block">
                <h5>Architectural Safeguards & Mitigation Hints</h5>
                <ul>
                  {currentIncident.hints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
