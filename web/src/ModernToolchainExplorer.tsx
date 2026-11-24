import { useState } from 'react';
import {
  Check,
  Copy,
  FolderTree,
  FileCode,
  Folder,
  Layers,
  Sparkles,
  Terminal,
  Zap,
  Cpu,
  ShieldCheck,
  Laptop,
} from 'lucide-react';

export type SupportedOs = 'mac' | 'linux' | 'windows' | 'brew';

export interface OsGuide {
  id: SupportedOs;
  name: string;
  terminalLabel: string;
  installCmd: string;
  initCmd: string;
  activateCmd: string;
  installDepsCmd: string;
  runCmd: string;
  lintCmd: string;
  fullScript: string;
}

export const OS_GUIDES: Record<SupportedOs, OsGuide> = {
  mac: {
    id: 'mac',
    name: 'macOS (zsh / bash)',
    terminalLabel: 'macOS Terminal (zsh)',
    installCmd: 'curl -LsSf https://astral.sh/uv/install.sh | sh',
    initCmd: 'uv venv',
    activateCmd: 'source .venv/bin/activate',
    installDepsCmd: 'uv pip install -r pyproject.toml',
    runCmd: 'uv run main.py',
    lintCmd: 'uv run ruff check --fix && uv run ruff format',
    fullScript: `# 1. Install Astral uv (instant Rust-based package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. Create isolated virtual environment in < 50ms
uv venv

# 3. Activate environment
source .venv/bin/activate

# 4. Install production dependencies with 20x speedup
uv pip install -r pyproject.toml

# 5. Run application with zero overhead
uv run main.py

# 6. Instant sub-10ms linting and formatting
uv run ruff check --fix && uv run ruff format`,
  },
  linux: {
    id: 'linux',
    name: 'Linux (Ubuntu / Debian / Alpine)',
    terminalLabel: 'Linux Shell (bash)',
    installCmd: 'curl -LsSf https://astral.sh/uv/install.sh | sh',
    initCmd: 'uv venv',
    activateCmd: 'source .venv/bin/activate',
    installDepsCmd: 'uv pip install -r pyproject.toml',
    runCmd: 'uv run main.py',
    lintCmd: 'uv run ruff check --fix && uv run ruff format',
    fullScript: `# 1. Install Astral uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. Create isolated virtual environment
uv venv

# 3. Activate environment
source .venv/bin/activate

# 4. Install production dependencies
uv pip install -r pyproject.toml

# 5. Run application
uv run main.py

# 6. Format and lint codebase
uv run ruff check --fix && uv run ruff format`,
  },
  windows: {
    id: 'windows',
    name: 'Windows (PowerShell)',
    terminalLabel: 'Windows PowerShell 7+',
    installCmd: 'powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"',
    initCmd: 'uv venv',
    activateCmd: '.\\.venv\\Scripts\\Activate.ps1',
    installDepsCmd: 'uv pip install -r pyproject.toml',
    runCmd: 'uv run main.py',
    lintCmd: 'uv run ruff check --fix; uv run ruff format',
    fullScript: `# 1. Install Astral uv via official PowerShell installer
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 2. Create isolated virtual environment in Windows
uv venv

# 3. Activate environment (run in PowerShell)
.\\.venv\\Scripts\\Activate.ps1

# 4. Install production dependencies
uv pip install -r pyproject.toml

# 5. Run application with zero overhead
uv run main.py

# 6. Sub-10ms formatting and linting
uv run ruff check --fix; uv run ruff format`,
  },
  brew: {
    id: 'brew',
    name: 'Homebrew & Scoop',
    terminalLabel: 'Package Manager (Brew / Scoop)',
    installCmd: 'brew install uv  # or on Windows: scoop install uv',
    initCmd: 'uv venv',
    activateCmd: 'source .venv/bin/activate',
    installDepsCmd: 'uv pip install -r pyproject.toml',
    runCmd: 'uv run main.py',
    lintCmd: 'uv run ruff check --fix && uv run ruff format',
    fullScript: `# On macOS / Linux Homebrew:
brew install uv

# On Windows Scoop:
# scoop install uv

# Create and activate environment:
uv venv && source .venv/bin/activate

# Install dependencies and run:
uv pip install -r pyproject.toml
uv run main.py`,
  },
};

export interface BenchmarkMetric {
  title: string;
  metric: string;
  uvScore: string;
  uvTime: number; // in seconds
  legacyScore: string;
  legacyTime: number; // in seconds
  speedupMultiplier: string;
  insight: string;
}

export const TOOLCHAIN_BENCHMARKS: BenchmarkMetric[] = [
  {
    title: 'Cold Package Resolution & Install',
    metric: 'Installing 25 production packages (FastAPI, Pydantic, HTTPx, Structlog)',
    uvScore: '0.12s',
    uvTime: 0.12,
    legacyScore: '2.84s',
    legacyTime: 2.84,
    speedupMultiplier: '23.6x Faster',
    insight:
      'Astral uv utilizes global content-addressable wheel caching and multi-threaded parallel downloads in Rust, bypassing Python GIL overhead.',
  },
  {
    title: 'Virtual Environment Creation',
    metric: 'Allocating fresh isolated .venv folder',
    uvScore: '0.04s',
    uvTime: 0.04,
    legacyScore: '1.40s',
    legacyTime: 1.4,
    speedupMultiplier: '35.0x Faster',
    insight:
      'uv symlinks Python binaries directly without copying heavy site-packages files, creating virtual environments almost instantaneously.',
  },
  {
    title: 'Linting, Formatting & Import Sorting',
    metric: 'Auditing 10,000 lines of code across 45 files',
    uvScore: '0.01s',
    uvTime: 0.01,
    legacyScore: '0.88s',
    legacyTime: 0.88,
    speedupMultiplier: '88.0x Faster',
    insight:
      'Ruff replaces Black, Flake8, and isort with a unified single-pass Rust AST parser, running pre-commit checks in single-digit milliseconds.',
  },
];

export interface ProjectTreeItem {
  id: string;
  path: string;
  type: 'file' | 'folder';
  badge: string;
  summary: string;
  importance: string;
  sampleCode: string;
}

export const ARCHITECTURE_TREE_ITEMS: ProjectTreeItem[] = [
  {
    id: 'pyproject',
    path: 'pyproject.toml',
    type: 'file',
    badge: 'PEP 621 Standard',
    summary: 'Single declarative configuration source for dependencies, linters, and build metadata.',
    importance:
      'Eliminates fragmented setup.py, requirements.txt, and setup.cfg into one unified modern standard used by Astral uv and modern Python packaging.',
    sampleCode: `[project]
name = "enterprise-api"
version = "1.0.0"
description = "Production FastAPI Microservice"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.115.0",
    "pydantic>=2.9.0",
    "pydantic-settings>=2.5.0",
    "structlog>=24.4.0",
    "httpx>=0.27.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.3.0",
    "pytest-asyncio>=0.24.0",
    "ruff>=0.6.0",
    "mypy>=1.11.0",
]

[tool.ruff]
line-length = 100
target-version = "py311"`,
  },
  {
    id: 'src-domain',
    path: 'src/domain/models.py',
    type: 'file',
    badge: 'Clean Architecture (Core)',
    summary: 'Pure business logic entities with zero framework or database dependencies.',
    importance:
      'Keeping domain models decoupled ensures business rules survive framework changes (e.g., migrating from Flask to FastAPI or Postgres to DynamoDB).',
    sampleCode: `from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

@dataclass(frozen=True)
class CustomerAccount:
    """Immutable domain entity enforcing business boundaries."""
    account_id: UUID
    tier: str
    balance_cents: int
    created_at: datetime

    def can_transact(self, charge_cents: int) -> bool:
        if charge_cents <= 0:
            raise ValueError("Charge must be positive")
        return self.balance_cents >= charge_cents`,
  },
  {
    id: 'src-services',
    path: 'src/services/billing.py',
    type: 'file',
    badge: 'Application Layer',
    summary: 'Service orchestrator managing workflows, transactions, and third-party API clients.',
    importance:
      'Orchestrates external side-effects (Stripe, Postgres, Kafka) while keeping HTTP controllers lightweight and testable.',
    sampleCode: `import structlog
from uuid import UUID

logger = structlog.get_logger(__name__)

class BillingService:
    def __init__(self, payment_gateway, account_repo):
        self.gateway = payment_gateway
        self.repo = account_repo

    async def execute_charge(self, account_id: UUID, amount_cents: int, idempotency_key: str):
        logger.info("billing.charge_start", account_id=str(account_id), amount=amount_cents)
        account = await self.repo.get(account_id)
        if not account.can_transact(amount_cents):
            raise InsufficientFundsError(f"Account {account_id} balance too low")
        
        result = await self.gateway.charge(amount_cents, idempotency_key=idempotency_key)
        await self.repo.deduct(account_id, amount_cents)
        return result`,
  },
  {
    id: 'src-api',
    path: 'src/api/routes.py',
    type: 'file',
    badge: 'Presentation Layer',
    summary: 'FastAPI route handlers with Pydantic request/response validation and error schemas.',
    importance:
      'Handles HTTP status codes, headers, and request schemas according to RFC 7807 problem details.',
    sampleCode: `from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/v1/accounts", tags=["Accounts"])

class ChargeRequest(BaseModel):
    amount_cents: int = Field(..., gt=0, le=1_000_000)
    idempotency_key: str = Field(..., min_length=16, max_length=64)

@router.post("/{account_id}/charge", status_code=status.HTTP_200_OK)
async def process_charge(account_id: str, payload: ChargeRequest):
    # Dependency injected service handles core transaction
    return {"status": "success", "charge_id": "ch_prod_99" }`,
  },
  {
    id: 'tests',
    path: 'tests/test_domain.py',
    type: 'file',
    badge: 'Pytest Suite',
    summary: 'Fast unit tests with isolated in-memory assertions and zero network dependencies.',
    importance:
      'Guarantees 100% test reliability in CI/CD pipelines without flaky network timeouts.',
    sampleCode: `import pytest
from uuid import uuid4
from datetime import datetime, timezone
from src.domain.models import CustomerAccount

def test_account_cannot_transact_negative_amount():
    acc = CustomerAccount(uuid4(), "enterprise", 5000, datetime.now(timezone.utc))
    with pytest.raises(ValueError, match="Charge must be positive"):
        acc.can_transact(-50)

def test_account_approves_valid_transaction():
    acc = CustomerAccount(uuid4(), "pro", 10000, datetime.now(timezone.utc))
    assert acc.can_transact(2500) is True`,
  },
  {
    id: 'env',
    path: '.env.example',
    type: 'file',
    badge: 'Security & Config',
    summary: 'Safe template documenting all required environment variables for team onboarding.',
    importance:
      'Prevents credentials leakage while ensuring new developers can spin up the environment without guessing missing variables.',
    sampleCode: `# App Configuration Template
ENVIRONMENT=development
LOG_LEVEL=INFO
APP_PORT=8000

# Security (Never commit real values to Git)
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/app_db
APP_SECRET_KEY=change_me_to_a_secure_random_64_character_hex_string
OPENAI_API_KEY=sk-mock-key-for-local-testing`,
  },
  {
    id: 'docker',
    path: 'Dockerfile',
    type: 'file',
    badge: 'Production Container',
    summary: 'Multi-stage non-root container utilizing Astral uv for lightning build times.',
    importance:
      'Reduces production container image size from 1.2GB to <120MB and runs as non-root for security compliance.',
    sampleCode: `FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim AS builder

WORKDIR /app
COPY pyproject.toml .
RUN uv venv /opt/venv && uv pip install --no-cache -r pyproject.toml

FROM python:3.11-slim-bookworm AS runner
WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY src/ ./src/
USER nobody
EXPOSE 8000
CMD ["uvicorn", "src.api.routes:app", "--host", "0.0.0.0", "--port", "8000"]`,
  },
];

export default function ModernToolchainExplorer() {
  const [selectedOs, setSelectedOs] = useState<SupportedOs>('mac');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string>('pyproject');

  const guide = OS_GUIDES[selectedOs];
  const activeFile =
    ARCHITECTURE_TREE_ITEMS.find((item) => item.id === selectedFileId) ||
    ARCHITECTURE_TREE_ITEMS[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="modern-toolchain-explorer">
      {/* 1. OS-SWITCHER TABS */}
      <div className="os-switcher-card">
        <div className="os-switcher-header">
          <div className="header-left">
            <span className="toolchain-badge">
              <Zap size={14} /> MODERN PYTHON 2025/2026 STANDARD
            </span>
            <h3>Astral uv & Ruff Interactive Setup Guide</h3>
            <p className="header-subtitle">
              Choose your operating system to see the exact copy-paste terminal commands.
            </p>
          </div>
          <button
            type="button"
            className="copy-full-script-btn"
            onClick={() => handleCopy(guide.fullScript, 'full-script')}
          >
            {copiedKey === 'full-script' ? (
              <>
                <Check size={14} /> Copied 6-Step Script!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy Full {guide.name.split(' ')[0]} Script
              </>
            )}
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="os-tabs-bar" role="tablist">
          {(Object.keys(OS_GUIDES) as SupportedOs[]).map((osKey) => {
            const osItem = OS_GUIDES[osKey];
            const isActive = selectedOs === osKey;
            return (
              <button
                key={osKey}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`os-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedOs(osKey)}
              >
                <Laptop size={15} />
                <span>{osItem.name}</span>
              </button>
            );
          })}
        </div>

        {/* Command Grid */}
        <div className="os-commands-grid">
          <div className="cmd-step-row">
            <div className="step-num-badge">1</div>
            <div className="step-info">
              <strong>Install Astral uv</strong>
              <span className="step-desc">Rust-based package manager replacing pip & virtualenv</span>
            </div>
            <div className="step-code-box">
              <code>{guide.installCmd}</code>
              <button
                type="button"
                className="step-copy-btn"
                title="Copy command"
                onClick={() => handleCopy(guide.installCmd, 'install')}
              >
                {copiedKey === 'install' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="cmd-step-row">
            <div className="step-num-badge">2</div>
            <div className="step-info">
              <strong>Create Virtual Environment</strong>
              <span className="step-desc">Instant isolated environment created in &lt;50ms</span>
            </div>
            <div className="step-code-box">
              <code>{guide.initCmd}</code>
              <button
                type="button"
                className="step-copy-btn"
                title="Copy command"
                onClick={() => handleCopy(guide.initCmd, 'init')}
              >
                {copiedKey === 'init' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="cmd-step-row">
            <div className="step-num-badge">3</div>
            <div className="step-info">
              <strong>Activate Environment</strong>
              <span className="step-desc">Platform-specific activation script</span>
            </div>
            <div className="step-code-box">
              <code>{guide.activateCmd}</code>
              <button
                type="button"
                className="step-copy-btn"
                title="Copy command"
                onClick={() => handleCopy(guide.activateCmd, 'activate')}
              >
                {copiedKey === 'activate' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="cmd-step-row">
            <div className="step-num-badge">4</div>
            <div className="step-info">
              <strong>Install Dependencies</strong>
              <span className="step-desc">20x faster multi-threaded resolution from pyproject.toml</span>
            </div>
            <div className="step-code-box">
              <code>{guide.installDepsCmd}</code>
              <button
                type="button"
                className="step-copy-btn"
                title="Copy command"
                onClick={() => handleCopy(guide.installDepsCmd, 'deps')}
              >
                {copiedKey === 'deps' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="cmd-step-row">
            <div className="step-num-badge">5</div>
            <div className="step-info">
              <strong>Run Fast Linting & Formatting</strong>
              <span className="step-desc">Ruff audits and formats in &lt;10ms (replaces Black + Flake8)</span>
            </div>
            <div className="step-code-box">
              <code>{guide.lintCmd}</code>
              <button
                type="button"
                className="step-copy-btn"
                title="Copy command"
                onClick={() => handleCopy(guide.lintCmd, 'lint')}
              >
                {copiedKey === 'lint' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SPEED BENCHMARK COMPARISONS */}
      <div className="benchmarks-container">
        <div className="benchmarks-header">
          <div className="bench-title">
            <Cpu size={18} className="bench-icon" />
            <div>
              <h3>Real-World Execution Benchmarks: uv vs Legacy pip</h3>
              <p className="bench-subtitle">
                Why modern high-performing teams have phased out pip and setup.py
              </p>
            </div>
          </div>
        </div>

        <div className="benchmarks-grid">
          {TOOLCHAIN_BENCHMARKS.map((bench, idx) => {
            const maxVal = Math.max(bench.uvTime, bench.legacyTime);
            const uvPercent = Math.max(4, (bench.uvTime / maxVal) * 100);
            const legacyPercent = 100;

            return (
              <div key={idx} className="benchmark-card">
                <div className="benchmark-card-head">
                  <h4>{bench.title}</h4>
                  <span className="multiplier-badge">{bench.speedupMultiplier}</span>
                </div>
                <p className="benchmark-metric">{bench.metric}</p>

                {/* Progress Bars */}
                <div className="bar-comparisons">
                  <div className="bar-group">
                    <div className="bar-labels">
                      <span className="bar-tool-name tool-uv">⚡ uv (Rust)</span>
                      <span className="bar-duration duration-uv">{bench.uvScore}</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill fill-uv"
                        style={{ width: `${uvPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="bar-group">
                    <div className="bar-labels">
                      <span className="bar-tool-name tool-pip">🐢 pip / venv (Python)</span>
                      <span className="bar-duration duration-pip">{bench.legacyScore}</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill fill-pip"
                        style={{ width: `${legacyPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="bench-insight">{bench.insight}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. INTERACTIVE PRODUCTION PROJECT STRUCTURE EXPLORER */}
      <div className="project-tree-container">
        <div className="tree-header">
          <div className="tree-title">
            <FolderTree size={18} className="tree-icon" />
            <div>
              <h3>Modern Multi-File Python Project Structure</h3>
              <p className="tree-subtitle">
                Click any file or directory to inspect its clean architecture role and code blueprint.
              </p>
            </div>
          </div>
        </div>

        <div className="tree-explorer-split">
          {/* Left Tree Explorer */}
          <div className="tree-file-list">
            <div className="root-folder-label">
              <Folder size={15} /> <span>my_service/</span>
            </div>
            {ARCHITECTURE_TREE_ITEMS.map((item) => {
              const isSelected = item.id === activeFile.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`tree-item-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedFileId(item.id)}
                >
                  <FileCode size={15} />
                  <span className="item-path">{item.path}</span>
                  <span className="item-badge">{item.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Right Detail Pane */}
          <div className="tree-file-detail">
            <div className="detail-header">
              <div>
                <span className="detail-badge">{activeFile.badge}</span>
                <h4>{activeFile.path}</h4>
              </div>
              <button
                type="button"
                className="detail-copy-btn"
                onClick={() => handleCopy(activeFile.sampleCode, `file-${activeFile.id}`)}
              >
                {copiedKey === `file-${activeFile.id}` ? (
                  <>
                    <Check size={14} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Blueprint
                  </>
                )}
              </button>
            </div>

            <p className="detail-summary">{activeFile.summary}</p>
            <div className="detail-importance-box">
              <strong>Architectural Purpose:</strong> {activeFile.importance}
            </div>

            <pre className="code-pre">
              <code>{activeFile.sampleCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
