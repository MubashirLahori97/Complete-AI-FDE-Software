import { useState } from 'react';
import {
  Boxes,
  Check,
  Code2,
  Copy,
  Cpu,
  FileCode,
  FolderTree,
  Package,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { STARTER_KIT_FILES, type StarterKitFile } from './python-starter-kit-data';

export default function PythonStarterKitView() {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('pyproject.toml');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSetupCmd, setCopiedSetupCmd] = useState(false);

  const activeFile: StarterKitFile =
    STARTER_KIT_FILES.find((f) => f.path === selectedFilePath) || STARTER_KIT_FILES[0];

  const setupCommands = `# 1. Clone repository
git clone https://github.com/mubashirlahori97/Complete-AI-FDE-Software.git
cd Complete-AI-FDE-Software/templates/python-service

# 2. Configure environment
cp .env.example .env

# 3. Install dependencies in <3 seconds using Astral uv
make install

# 4. Run full test suite with coverage
make test

# 5. Start live server on http://localhost:8000
make run
`;

  return (
    <div className="starter-kit-container">
      {/* Hero Banner */}
      <div className="starter-kit-hero">
        <div className="starter-kit-hero-badge">
          <Boxes size={16} />
          <span>Cloneable Production Foundation</span>
        </div>
        <h2>📦 Production Python Microservice Starter Kit</h2>
        <p>
          Skip the blank-screen paralysis. This battle-tested microservice blueprint integrates
          <strong> Astral uv</strong>, <strong>FastAPI</strong>, <strong>Pydantic v2</strong>,
          <strong> Pydantic Settings</strong>, and <strong>Structlog</strong> with multi-stage
          Docker and automated Kubernetes probes.
        </p>

        {/* Quick Clone Bash Strip */}
        <div className="quick-clone-bar">
          <div className="clone-bar-header">
            <Terminal size={15} />
            <span>5-Minute Local Setup</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(setupCommands);
                setCopiedSetupCmd(true);
                setTimeout(() => setCopiedSetupCmd(false), 2000);
              }}
              className="copy-btn-inline"
            >
              {copiedSetupCmd ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedSetupCmd ? 'Copied Commands' : 'Copy Setup Script'}</span>
            </button>
          </div>
          <pre className="clone-code-block">{setupCommands}</pre>
        </div>
      </div>

      {/* Production vs Toy Comparison Strip */}
      <div className="starter-kit-pillars">
        <div className="pillar-card">
          <div className="pillar-icon">
            <Cpu size={20} />
          </div>
          <h4>Astral Stack Tooling</h4>
          <p>
            Replaced pip, poetry, black, flake8, and isort with <code>uv</code> and <code>ruff</code>
            . 10-100x faster package resolution with deterministic lockfiles.
          </p>
        </div>
        <div className="pillar-card">
          <div className="pillar-icon">
            <ShieldCheck size={20} />
          </div>
          <h4>Strict Type Safety</h4>
          <p>
            Configured with <code>mypy --strict</code> and Pydantic v2 domain schemas. Runtime type
            mismatches are caught during pre-commit, not in customer traffic.
          </p>
        </div>
        <div className="pillar-card">
          <div className="pillar-icon">
            <Package size={20} />
          </div>
          <h4>Hardened OCI Container</h4>
          <p>
            Multi-stage Docker build running as unprivileged <code>appuser</code> (UID 10001) with
            automated <code>/healthz</code> liveness probes.
          </p>
        </div>
      </div>

      {/* File Browser & Code Viewer */}
      <div className="starter-kit-browser">
        {/* Left Sidebar: File Tree */}
        <div className="file-tree-sidebar">
          <div className="tree-header">
            <FolderTree size={16} />
            <span>Repository Files</span>
          </div>

          <div className="tree-groups">
            {/* Config & Tooling */}
            <div className="tree-category">
              <span className="tree-category-title">Config & Build</span>
              {STARTER_KIT_FILES.filter((f) => f.category === 'config' || f.category === 'docker').map(
                (file) => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFilePath(file.path)}
                    className={`tree-file-btn ${selectedFilePath === file.path ? 'active' : ''}`}
                  >
                    <FileCode size={14} />
                    <span>{file.name}</span>
                  </button>
                ),
              )}
            </div>

            {/* Application Source */}
            <div className="tree-category">
              <span className="tree-category-title">src/app/</span>
              {STARTER_KIT_FILES.filter((f) => f.category === 'source').map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`tree-file-btn ${selectedFilePath === file.path ? 'active' : ''}`}
                >
                  <FileCode size={14} />
                  <span>{file.name}</span>
                </button>
              ))}
            </div>

            {/* Test Suite */}
            <div className="tree-category">
              <span className="tree-category-title">tests/</span>
              {STARTER_KIT_FILES.filter((f) => f.category === 'tests').map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`tree-file-btn ${selectedFilePath === file.path ? 'active' : ''}`}
                >
                  <FileCode size={14} />
                  <span>{file.name}</span>
                </button>
              ))}
            </div>

            {/* Documentation */}
            <div className="tree-category">
              <span className="tree-category-title">Docs</span>
              {STARTER_KIT_FILES.filter((f) => f.category === 'docs').map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`tree-file-btn ${selectedFilePath === file.path ? 'active' : ''}`}
                >
                  <FileCode size={14} />
                  <span>{file.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="file-code-viewer">
          <div className="code-viewer-header">
            <div className="file-meta">
              <Code2 size={16} />
              <span className="file-path">{activeFile.path}</span>
              <span className="file-lang-pill">{activeFile.language}</span>
            </div>
            <div className="file-actions">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeFile.content);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="copy-file-btn"
              >
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedCode ? 'Copied File' : 'Copy File Content'}</span>
              </button>
            </div>
          </div>

          <div className="file-description-strip">
            <Sparkles size={14} />
            <span>{activeFile.description}</span>
          </div>

          <div className="code-content-wrapper">
            <pre className="code-pre">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
