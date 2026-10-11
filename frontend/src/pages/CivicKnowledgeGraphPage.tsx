import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { KnowledgeGraphData, KnowledgeGraphNode } from '../types';
import {
  Network, Eye, RefreshCw, Filter, Sparkles, Layers,
  Shield, Building2, UserCheck, AlertTriangle, MapPin
} from 'lucide-react';

export const CivicKnowledgeGraphPage: React.FC = () => {
  const [graphData, setGraphData] = useState<KnowledgeGraphData>({ nodes: [], links: [] });
  const [activeNode, setActiveNode] = useState<KnowledgeGraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    setIsLoading(true);
    try {
      const data = await api.getKnowledgeGraphData();
      setGraphData(data);
      if (data.nodes.length > 0) setActiveNode(data.nodes[0]);
    } catch (err) {
      console.error('Failed to load knowledge graph', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNodes = graphData.nodes.filter(
    (n) => filterType === 'All' || n.type === filterType
  );

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'location':
        return '#0d9488'; // teal
      case 'issue':
        return '#f43f5e'; // rose
      case 'department':
        return '#6366f1'; // indigo
      case 'contractor':
        return '#f59e0b'; // amber
      default:
        return '#64748b';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/30 flex items-center gap-1">
              <Network className="w-3.5 h-3.5" /> Feature #20 · AI Intelligence
            </span>
            <span className="text-xs text-slate-400 font-medium">Systemic Relationship Topology</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Civic Knowledge Graph & Entity Network
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Explore topological relationships between geographic locations, chronic recurring failures, municipal departments, and contracted maintenance agencies.
          </p>
        </div>

        <button
          onClick={loadGraph}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Graph
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Entities:
        </span>
        {['All', 'location', 'issue', 'department', 'contractor'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all capitalize ${
              filterType === type
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {type === 'All' ? 'All Entities (12)' : `${type}s`}
          </button>
        ))}
      </div>

      {/* Interactive Graph Canvas + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Graph Canvas */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4 shadow-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-600" />
              Node-Link Entity Diagram
            </h2>
            <div className="text-xs text-slate-500">
              Click any node to inspect systemic links
            </div>
          </div>

          <div className="relative w-full h-[480px] rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
            {/* SVG Connecting Links */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 450">
              <defs>
                <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.7" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#graph-grid)" />

              {graphData.links.map((link, idx) => {
                const sourceNode = graphData.nodes.find((n) => n.id === link.source);
                const targetNode = graphData.nodes.find((n) => n.id === link.target);

                if (!sourceNode || !targetNode) return null;

                const isConnected =
                  activeNode && (activeNode.id === link.source || activeNode.id === link.target);

                return (
                  <g key={idx}>
                    <line
                      x1={`${sourceNode.x}%`}
                      y1={`${sourceNode.y}%`}
                      x2={`${targetNode.x}%`}
                      y2={`${targetNode.y}%`}
                      stroke={isConnected ? '#2dd4bf' : '#334155'}
                      strokeWidth={isConnected ? 3 : 1.5}
                      strokeDasharray={isConnected ? 'none' : '4 4'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Interactive Graph Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = activeNode?.id === node.id;
              const color = getNodeColor(node.type);

              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group transition-transform duration-200 hover:scale-125"
                >
                  {isSelected && (
                    <span
                      style={{ backgroundColor: color }}
                      className="absolute -inset-2 rounded-full animate-ping opacity-50"
                    />
                  )}
                  <div
                    style={{
                      backgroundColor: color,
                      borderColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.4)',
                    }}
                    className={`px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-xl border-2 flex items-center gap-1.5 whitespace-nowrap ${
                      isSelected ? 'ring-4 ring-teal-400/50 scale-110' : ''
                    }`}
                  >
                    <span>{node.label}</span>
                  </div>
                </div>
              );
            })}

            {/* Canvas Legend */}
            <div className="absolute bottom-3 left-3 bg-navy-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white text-xs space-y-1.5 shadow-lg">
              <div className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Entity Types</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]" />
                <span>Geographic Location</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />
                <span>Civic Issue / Chronic Hazard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                <span>Municipal Department</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span>Contractor / Agency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Node Inspector Dossier */}
        <div className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200 bg-white flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Eye className="w-4 h-4 text-teal-600" />
              Entity Inspector
            </h3>

            {activeNode ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span
                    style={{ backgroundColor: getNodeColor(activeNode.type) }}
                    className="px-2.5 py-0.5 rounded-full text-white text-[10px] font-extrabold uppercase tracking-wider"
                  >
                    {activeNode.type}
                  </span>
                  <h4 className="font-bold text-navy-900 text-base">{activeNode.label}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{activeNode.details}</p>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-700 text-xs">Connected Relationships:</div>
                  <div className="space-y-2">
                    {graphData.links
                      .filter((l) => l.source === activeNode.id || l.target === activeNode.id)
                      .map((link, i) => {
                        const otherId = link.source === activeNode.id ? link.target : link.source;
                        const otherNode = graphData.nodes.find((n) => n.id === otherId);

                        return (
                          <div
                            key={i}
                            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                          >
                            <span className="font-semibold text-slate-800">{otherNode?.label}</span>
                            <span className="font-mono text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                              {link.relationship}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-400 text-sm">
                Click any node on the graph canvas to inspect its relationships.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-400">
            Powered by Neo4j-compatible semantic graph schema.
          </div>
        </div>
      </div>
    </div>
  );
};
