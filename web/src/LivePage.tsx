import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { websiteDocument } from './visual-website';

/** A real, escaped local page. The opaque frame cannot read academy storage. */
export default function LivePage({
  heading,
  size = 30,
  rule = true,
  title = 'Your live website',
  onAction,
}: {
  heading: string;
  size?: number;
  rule?: boolean;
  title?: string;
  onAction?: (open: boolean, hasRule: boolean) => void;
}) {
  const uid = useId();
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(360);
  const channel = `${uid}:${heading}:${size}:${rule}`;
  const document = useMemo(
    () => websiteDocument({ title: heading, accent: 'teal', size, rule, channel }),
    [channel],
  );
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.channel !== channel) return;
      if (
        event.data.type === 'fde-visual-height' &&
        typeof event.data.height === 'number' &&
        Number.isFinite(event.data.height)
      )
        setHeight(Math.max(330, Math.min(700, event.data.height)));
      if (
        event.data.type === 'fde-visual-click' &&
        typeof event.data.open === 'boolean' &&
        typeof event.data.hasRule === 'boolean'
      )
        onAction?.(event.data.open, event.data.hasRule);
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [channel, onAction]);
  return (
    <iframe
      ref={frame}
      title={title}
      sandbox="allow-scripts"
      srcDoc={document}
      style={{ height }}
    />
  );
}
