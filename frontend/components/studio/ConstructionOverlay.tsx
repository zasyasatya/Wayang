"use client";

import type { Construction, Silhouette } from "@/lib/api";
import type { FocusZone, GuideKind } from "@/lib/studioSteps";

type Props = {
  construction?: Construction | null;
  refPoints?: Silhouette["ref_points"];
  guides: GuideKind[];
  focus: FocusZone;
  showLabels: boolean;
  /** Lebih redup di kanvas agar tidak menyaingi goresan. */
  muted?: boolean;
};

function pts(list: number[][] | undefined): string {
  if (!list?.length) return "";
  return list.map(([x, y]) => `${x},${y}`).join(" ");
}

export function ConstructionOverlay({
  construction,
  refPoints,
  guides,
  focus,
  showLabels,
  muted = false,
}: Props) {
  if (!construction) return null;
  const [vw, vh] = construction.view;
  const stroke = muted ? "rgba(37, 99, 235, 0.45)" : "rgba(37, 99, 235, 0.78)";
  const fill = muted ? "rgba(37, 99, 235, 0.08)" : "rgba(37, 99, 235, 0.12)";
  const labelFill = muted ? "rgba(15, 23, 42, 0.45)" : "rgba(15, 23, 42, 0.72)";
  const want = (g: GuideKind) => guides.includes(g);
  const contour = construction.contour?.length ? construction.contour : refPoints;
  const uid = muted ? "c-mute" : "c-ref";

  const landmarks = construction.landmarks.filter((lm) => {
    if (want("face")) return lm.zone === "head";
    if (want("landmarks")) return true;
    return false;
  });

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <mask id={`${uid}-dim`}>
          <rect width={vw} height={vh} fill="white" />
          {focus === "head" && construction.face_box && (
            <rect
              x={construction.face_box.x}
              y={construction.face_box.y}
              width={construction.face_box.w}
              height={construction.face_box.h}
              rx="8"
              fill="black"
            />
          )}
        </mask>
      </defs>

      {focus === "head" && construction.face_box && (
        <rect
          width={vw}
          height={vh}
          fill="rgba(244, 230, 200, 0.55)"
          mask={`url(#${uid}-dim)`}
        />
      )}

      {want("bbox") && (
        <rect
          x={construction.bbox.x}
          y={construction.bbox.y}
          width={construction.bbox.w}
          height={construction.bbox.h}
          fill="none"
          stroke={stroke}
          strokeWidth="0.6"
          strokeDasharray="3 2"
        />
      )}

      {want("axis") && (
        <line
          x1={construction.axis.x1}
          y1={construction.axis.y1}
          x2={construction.axis.x2}
          y2={construction.axis.y2}
          stroke={stroke}
          strokeWidth="0.7"
          strokeDasharray="2 2"
        />
      )}

      {want("gesture") && construction.gesture.length > 1 && (
        <polyline
          points={pts(construction.gesture)}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      )}

      {want("proportion") &&
        construction.proportion_lines.map((ln, i) => (
          <g key={ln.label}>
            <line
              x1={construction.bbox.x - 4}
              y1={ln.y}
              x2={construction.bbox.x + construction.bbox.w + 4}
              y2={ln.y}
              stroke={stroke}
              strokeWidth={i === 0 || i === 9 ? 0.9 : 0.45}
              strokeDasharray={i === 0 || i === 9 ? undefined : "2 2"}
            />
            {showLabels && (
              <text
                x={6}
                y={ln.y - 1.5}
                fill={labelFill}
                fontSize="5.2"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              >
                {ln.label}
              </text>
            )}
          </g>
        ))}

      {want("blocks") &&
        construction.blocks.map((b, i) => {
          if (b.type === "ellipse" && b.cx != null && b.cy != null && b.rx != null && b.ry != null) {
            return (
              <g key={`b-${i}`}>
                <ellipse
                  cx={b.cx}
                  cy={b.cy}
                  rx={b.rx}
                  ry={b.ry}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="0.9"
                />
                {showLabels && (
                  <text
                    x={b.cx}
                    y={b.cy + 2}
                    textAnchor="middle"
                    fill={labelFill}
                    fontSize="5.5"
                    fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                  >
                    {b.label}
                  </text>
                )}
              </g>
            );
          }
          if (b.type === "line" && b.x1 != null && b.y1 != null && b.x2 != null && b.y2 != null) {
            return (
              <line
                key={`b-${i}`}
                x1={b.x1}
                y1={b.y1}
                x2={b.x2}
                y2={b.y2}
                stroke={stroke}
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.28"
              />
            );
          }
          return null;
        })}

      {want("contour") && contour && contour.length > 1 && (
        <polyline
          points={pts(contour)}
          fill="none"
          stroke={stroke}
          strokeWidth="0.9"
          strokeDasharray="3 2"
          strokeLinejoin="round"
        />
      )}

      {landmarks.map((lm) => (
        <g key={lm.id}>
          <circle cx={lm.x} cy={lm.y} r="2.1" fill="#2563eb" opacity={muted ? 0.55 : 0.9} />
          <circle cx={lm.x} cy={lm.y} r="3.4" fill="none" stroke={stroke} strokeWidth="0.5" />
          {showLabels && (
            <text
              x={lm.x + 5}
              y={lm.y - 3}
              fill={labelFill}
              fontSize="5"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
            >
              {lm.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
