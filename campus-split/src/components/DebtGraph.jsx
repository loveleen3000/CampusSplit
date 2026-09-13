// src/components/DebtGraph.jsx
import React, { useState } from 'react';
import { ArrowRight, Layers, Zap } from 'lucide-react';

export default function DebtGraph({ members, rawEdges, settlements, netBalances }) {
  const [graphMode, setGraphMode] = useState('optimized'); // 'raw' | 'optimized'

  if (members.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
        Add members on Dashboard to visualize the settlement network graph.
      </div>
    );
  }

  // Generate dynamic circular coordinates for SVG nodes
  const radius = 130;
  const centerX = 220;
  const centerY = 180;
  const total = members.length;

  const nodePositions = {};
  members.forEach((m, idx) => {
    const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
    nodePositions[m.name] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const activeEdges = graphMode === 'optimized' ? settlements : rawEdges;

  return (
    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Zap size={14} className="text-amber-500" /> Interactive Debt Graph Topology
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Toggle between raw peer IOUs and the greedy-minimized transaction tree.
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start">
          <button
            onClick={() => setGraphMode('raw')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              graphMode === 'raw' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Raw Cyclic IOUs ({rawEdges.length})
          </button>
          <button
            onClick={() => setGraphMode('optimized')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              graphMode === 'optimized' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Greedy Min-Cash Flow ({settlements.length})
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner min-h-[380px]">
        <svg viewBox="0 0 440 360" className="w-full max-w-[440px] h-[340px]">
          <defs>
            <marker id="arrow-opt" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669" />
            </marker>
            <marker id="arrow-raw" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
          </defs>

          {/* Draw Edges */}
          {activeEdges.map((edge, idx) => {
            const start = nodePositions[edge.from];
            const end = nodePositions[edge.to];
            if (!start || !end) return null;

            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;

            return (
              <g key={idx} className="transition-all duration-300">
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={graphMode === 'optimized' ? '#10b981' : '#fb7185'}
                  strokeWidth="2.5"
                  strokeDasharray={graphMode === 'raw' ? '4 3' : 'none'}
                  markerEnd={`url(#${graphMode === 'optimized' ? 'arrow-opt' : 'arrow-raw'})`}
                />
                <rect
                  x={midX - 22}
                  y={midY - 10}
                  width="44"
                  height="20"
                  rx="6"
                  fill="white"
                  stroke={graphMode === 'optimized' ? '#059669' : '#f43f5e'}
                  strokeWidth="1"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={graphMode === 'optimized' ? '#047857' : '#e11d48'}
                >
                  ₹{edge.amount}
                </text>
              </g>
            );
          })}

          {/* Draw Member Nodes */}
          {members.map((m, idx) => {
            const pos = nodePositions[m.name];
            if (!pos) return null;
            const bal = netBalances[m.name] || 0;
            const isCreditor = bal > 0.01;
            const isDebtor = bal < -0.01;

            return (
              <g key={m.id} className="cursor-pointer">
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="24"
                  fill={isCreditor ? '#ecfdf5' : isDebtor ? '#fff1f2' : '#f1f5f9'}
                  stroke={isCreditor ? '#10b981' : isDebtor ? '#f43f5e' : '#cbd5e1'}
                  strokeWidth="2.5"
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill="#1e293b"
                >
                  {m.name.slice(0, 4)}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 36}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="bold"
                  fill={isCreditor ? '#059669' : isDebtor ? '#e11d48' : '#64748b'}
                >
                  {bal >= 0 ? `+₹${bal.toFixed(0)}` : `-₹${Math.abs(bal).toFixed(0)}`}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="w-full flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Green Node = Creditor (Gets money)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Red Node = Debtor (Owes money)
          </span>
        </div>
      </div>
    </div>
  );
}