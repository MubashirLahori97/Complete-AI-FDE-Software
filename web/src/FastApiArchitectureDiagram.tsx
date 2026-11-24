import { useState } from 'react';
import {
  ArrowRight,
  Boxes,
  Check,
  ChevronRight,
  Download,
  ExternalLink,
  FileCode,
  Globe,
  Layers,
  Network,
  Server,
  ShieldCheck,
  Workflow,
  Zap,
} from 'lucide-react';
import { strToU8, zipSync } from 'fflate';
import { FASTAPI_PRODUCTION_PROJECT_FILES } from './python-fastapi-data';

interface FastApiArchitectureDiagramProps {
  onSelectFile?: (filePath: string) => void;
}

interface ArchNode {
  id: string;
  label: string;
  sublabel: string;
  category: 'client' | 'gateway' | 'app' | 'data';
  blueprintFile: string;
  productionInvariant: string;
  color: string;
}

const ARCH_NODES: ArchNode[] = [
  {
    id: 'client',
    label: 'HTTP / API Clients',
    sublabel: 'Concurrent async requests',
    category: 'client',
    blueprintFile: 'tests/test_api.py',
    productionInvariant: 'Client requests include X-Request-ID headers and adhere to rate limits.',
    color: '#38bdf8',
  },
  {
    id: 'asgi',
    label: 'Uvicorn ASGI Loop',
    sublabel: 'Single-thread event loop',
    category: 'gateway',
    blueprintFile: 'Dockerfile',
    productionInvariant: 'Never block the event loop with synchronous time.sleep or blocking sockets.',
    color: '#818cf8',
  },
  {
    id: 'lifespan',
    label: 'Lifespan & Middleware',
    sublabel: 'Deterministic state binding',
    category: 'gateway',
    blueprintFile: 'app/core/lifespan.py',
    productionInvariant: 'Warm database pools at startup; dispose pools cleanly on SIGTERM.',
    color: '#a78bfa',
  },
  {
    id: 'routers',
    label: 'Thin Routers (Layer 1)',
    sublabel: 'Pydantic v2 validation',
    category: 'app',
    blueprintFile: 'app/routers/tasks.py',
    productionInvariant: 'Zero business logic in routes. Routes only validate schemas and inject dependencies.',
    color: '#34d399',
  },
  {
    id: 'services',
    label: 'Domain Services (Layer 2)',
    sublabel: 'Pure business logic',
    category: 'app',
    blueprintFile: 'app/core/exceptions.py',
    productionInvariant: 'Raise domain exceptions (ResourceNotFoundError); service layers never know about HTTP status codes.',
    color: '#4ade80',
  },
  {
    id: 'repositories',
    label: 'Repositories (Layer 3)',
    sublabel: 'Data Access Isolation',
    category: 'data',
    blueprintFile: 'app/core/database.py',
    productionInvariant: 'All queries use Async SQLAlchemy 2.0 select() statements with scoped Unit of Work.',
    color: '#fbbf24',
  },
  {
    id: 'database',
    label: 'PostgreSQL Pool (Layer 4)',
    sublabel: 'asyncpg connection pool',
    category: 'data',
    blueprintFile: 'app/core/config.py',
    productionInvariant: 'Pool size=20, max_overflow=10, pre_ping=True to prevent stale connection timeouts.',
    color: '#f87171',
  },
];

export default function FastApiArchitectureDiagram({ onSelectFile }: FastApiArchitectureDiagramProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('routers');
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const activeNode = ARCH_NODES.find((n) => n.id === selectedNodeId) || ARCH_NODES[3];

  const handleDownloadZip = () => {
    try {
      setDownloading(true);
      const zipEntries: Record<string, Uint8Array> = {};

      FASTAPI_PRODUCTION_PROJECT_FILES.forEach((file) => {
        const fullPath = `fastapi-production-service/${file.path}`;
        zipEntries[fullPath] = strToU8(file.code);
      });

      // Add a README.md to the zip
      const readmeContent = `# Production-Grade FastAPI Backend Service
Built with Clean 4-Layer Architecture, Async SQLAlchemy 2.0, Pydantic v2, and Docker.

## Quick Start
1. Create virtualenv: \`python3 -m venv .venv && source .venv/bin/activate\`
2. Install dependencies: \`pip install -e .\`
3. Run with Uvicorn: \`uvicorn app.main:app --reload --port 8000\`
4. Run integration tests: \`pytest tests/test_api.py\`
5. Build Docker image: \`docker build -t fastapi-service:latest .\`
`;
      zipEntries['fastapi-production-service/README.md'] = strToU8(readmeContent);

      const zipped = zipSync(zipEntries);
      const blob = new Blob([zipped], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fastapi-production-service.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Failed to create project zip archive:', err);
      setDownloading(false);
    }
  };

  return (
    <div className="arch-visualizer-container">
      <div className="arch-visualizer-header">
        <div>
          <div className="arch-badge">
            <Network size={14} />
            <span>Interactive Request Flow</span>
          </div>
          <h4>ByteByteGo-Style System Architecture</h4>
          <p className="muted">
            Click any node in the request lifecycle to see how production data flows through each layer.
          </p>
        </div>

        <button
          type="button"
          className="button primary small download-zip-btn"
          disabled={downloading}
          onClick={handleDownloadZip}
        >
          {downloaded ? (
            <>
              <Check size={14} /> Downloaded (.zip)
            </>
          ) : downloading ? (
            <span>Zipping...</span>
          ) : (
            <>
              <Download size={14} /> Download Full Starter Kit (.zip)
            </>
          )}
        </button>
      </div>

      {/* Interactive Node Flowchart */}
      <div className="arch-nodes-flow">
        {ARCH_NODES.map((node, idx) => {
          const isSelected = node.id === selectedNodeId;
          return (
            <div key={node.id} className="arch-node-wrapper">
              <button
                type="button"
                className={`arch-node-card ${isSelected ? 'active' : ''}`}
                style={{
                  borderColor: isSelected ? node.color : undefined,
                  boxShadow: isSelected ? `0 0 16px ${node.color}33` : undefined,
                }}
                onClick={() => setSelectedNodeId(node.id)}
              >
                <div className="node-indicator" style={{ background: node.color }} />
                <div className="node-info">
                  <span className="node-title">{node.label}</span>
                  <span className="node-subtitle">{node.sublabel}</span>
                </div>
              </button>
              {idx < ARCH_NODES.length - 1 && (
                <div className="arch-flow-arrow">
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Node Detail Card */}
      <div className="arch-node-inspector" style={{ borderLeftColor: activeNode.color }}>
        <div className="inspector-head">
          <div className="inspector-title">
            <span className="dot" style={{ background: activeNode.color }} />
            <h5>{activeNode.label}</h5>
            <span className="inspector-file-tag">{activeNode.blueprintFile}</span>
          </div>

          {onSelectFile && (
            <button
              type="button"
              className="inspect-file-btn"
              onClick={() => onSelectFile(activeNode.blueprintFile)}
            >
              <FileCode size={13} />
              <span>Inspect {activeNode.blueprintFile} in Blueprint Explorer</span>
              <ChevronRight size={13} />
            </button>
          )}
        </div>

        <div className="inspector-body">
          <div className="invariant-box">
            <strong>Production Invariant:</strong> {activeNode.productionInvariant}
          </div>
        </div>
      </div>
    </div>
  );
}
