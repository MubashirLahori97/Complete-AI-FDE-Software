import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { websiteDocument, type VisualAccent, type PageFocus } from './visual-website';

/** A real, escaped local page. The opaque frame cannot read academy storage. */
export default function LivePage({
  heading,
  size = 30,
  rule = true,
  showArea = true,
  accent = 'teal',
  focus,
  title = 'Your live website',
  onAction,
}: {
  heading: string;
  size?: number;
  rule?: boolean;
  showArea?: boolean;
  accent?: VisualAccent;
  focus?: PageFocus;
  title?: string;
  onAction?: (open: boolean, hasRule: boolean) => void;
}) {
  const uid = useId();
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(360);
  const [loadedChannel, setLoadedChannel] = useState('');
  const [measuredChannel, setMeasuredChannel] = useState('');
  const [readyChannel, setReadyChannel] = useState('');
  const configuration = JSON.stringify([heading, size, rule, showArea, accent, focus]);
  // Restoring earlier inputs still creates a new document, with fresh readiness.
  const channel = useMemo(() => `${uid}:${crypto.randomUUID()}`, [uid, configuration]);
  const ready = readyChannel === channel;
  const document = useMemo(
    () =>
      websiteDocument({
        title: heading,
        accent,
        size,
        rule,
        channel,
        showArea,
        focus,
        interactionGate: true,
      }),
    [channel],
  );
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.channel !== channel) return;
      if (
        event.data.type === 'fde-visual-height' &&
        typeof event.data.height === 'number' &&
        Number.isFinite(event.data.height)
      ) {
        setHeight(Math.max(330, Math.min(700, event.data.height)));
        setMeasuredChannel(channel);
      }
      if (event.data.type === 'fde-visual-ready') setReadyChannel(channel);
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
  useEffect(() => {
    if (loadedChannel !== channel || measuredChannel !== channel) return;
    let second: number | undefined;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() =>
        frame.current?.contentWindow?.postMessage({ type: 'fde-visual-enable', channel }, '*'),
      );
    });
    return () => {
      cancelAnimationFrame(first);
      if (second !== undefined) cancelAnimationFrame(second);
    };
  }, [channel, loadedChannel, measuredChannel]);
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
      style={{ height: height + 2 }}
    />
  );
}
