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
  const [loadedChannel, setLoadedChannel] = useState('');
  const channel = `${uid}:${heading}:${size}:${rule}`;
  const ready = loadedChannel === channel;
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
  // Height reports describe the body. Include the frame's two 1px borders.
  return (
    <iframe
      key={channel}
      ref={frame}
      title={title}
      sandbox="allow-scripts"
      srcDoc={document}
      aria-busy={!ready}
      tabIndex={ready ? 0 : -1}
      onLoad={() => {
        setLoadedChannel(channel);
        frame.current?.contentWindow?.postMessage({ type: 'fde-visual-measure', channel }, '*');
      }}
      style={{ height: height + 2, pointerEvents: ready ? undefined : 'none' }}
    />
  );
}
