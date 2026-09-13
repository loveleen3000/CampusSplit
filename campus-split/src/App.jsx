import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Users,
  Receipt,
  ArrowRightLeft,
  PieChart as ChartIcon,
  CheckCircle2,
  QrCode,
  Trash2,
  Check,
  History,
  Coins,
  Repeat,
  Zap,
  Home,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Plus,
  RotateCcw,
  Camera,
  Sparkles,
  Loader2,
  ExternalLink
} from 'lucide-react';

const API_BASE = 'https://campussplit-api.onrender.com/api';

// --- INTEGRATED SVG DEBT GRAPH COMPONENT ---
function DebtGraphView({ members, rawEdges = [], settlements = [], netBalances = {} }) {
  const [graphMode, setGraphMode] = useState('optimized');

  if (members.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
        Add members on the Dashboard to plot and visualize the settlement network graph.
      </div>
    );
  }

  const radius = 125;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Zap size={14} className="text-amber-500" /> Interactive Debt Graph Topology
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Toggle between raw peer IOUs and the greedy-minimized transaction tree.
          </p>
        </div>

        <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start">
          <button
            onClick={() => setGraphMode('raw')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${graphMode === 'raw' ? 'bg-rose-50 text-rose-600 border border-rose-200 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Raw Cyclic IOUs ({rawEdges.length})
          </button>
          <button
            onClick={() => setGraphMode('optimized')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${graphMode === 'optimized' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Greedy Min-Cash Flow ({settlements.length})
          </button>
        </div>
      </div>

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

          {members.map((m) => {
            const pos = nodePositions[m.name];
            if (!pos) return null;
            const bal = netBalances[m.name] || 0;
            const isCreditor = bal > 0.01;
            const isDebtor = bal < -0.01;

            return (
              <g key={m._id || m.id || m.name} className="cursor-pointer">
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
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Green = Creditor (Gets money)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Red = Debtor (Owes money)
          </span>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APPLICATION ---
export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');

  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settlementData, setSettlementData] = useState({
    netBalances: {},
    settlements: [],
    rawEdges: [],
    activeExpensesCount: 0
  });

  // Expense Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberUpi, setNewMemberUpi] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Canteen');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('Monthly');
  const [selectedSplits, setSelectedSplits] = useState([]);
  const [customSplits, setCustomSplits] = useState({});

  // Modals & Simulator
  const [activeQr, setActiveQr] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [paymentTxnDetails, setPaymentTxnDetails] = useState(null);

  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [scanState, setScanState] = useState('idle');
  const [scannedBillDetails, setScannedBillDetails] = useState(null);

  // --- API DATA FETCHING ---
  const fetchData = async () => {
    try {
      const [mRes, eRes, sRes] = await Promise.all([
        fetch(`${API_BASE}/members`),
        fetch(`${API_BASE}/expenses`),
        fetch(`${API_BASE}/settlements/calculate`)
      ]);

      const mData = await mRes.json();
      const eData = await eRes.json();
      const sData = await sRes.json();

      setMembers(Array.isArray(mData) ? mData : []);
      setExpenses(Array.isArray(eData) ? eData : []);
      if (sData) setSettlementData(sData);

      if (mData.length > 0 && !paidBy) setPaidBy(mData[0].name);
      if (mData.length > 0 && selectedSplits.length === 0) {
        setSelectedSplits(mData.map(m => m.name));
      }
    } catch (err) {
      console.error('Backend connection failed:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- ADD MEMBER VIA API ---
  const handleAddMember = async (e) => {
    e.preventDefault();
    const clean = newMemberName.trim();
    if (!clean || members.some(m => m.name.toLowerCase() === clean.toLowerCase())) return;

    try {
      const res = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clean, upi: newMemberUpi })
      });
      if (res.ok) {
        setNewMemberName('');
        setNewMemberUpi('');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };


  const handleExportCSV = () => {
    if (expenses.length === 0) {
      alert('Export karne ke liye koi expenses nahi hain!');
      return;
    }

    const headers = 'Bill Title,Amount,Paid By,Category,Date\n';
    const rows = expenses.map(e =>
      `"${e.description || e.title || 'Expense'}",${e.amount},"${e.paidBy}","${e.category || 'General'}","${new Date(e.createdAt || Date.now()).toLocaleDateString()}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CampusSplit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- REMOVE MEMBER VIA API ---
  const removeMember = async (name) => {
    try {
      await fetch(`${API_BASE}/members/${name}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  // --- RESET ALL DATA VIA API ---
  const handleResetAll = async () => {
    if (window.confirm('Clear all MongoDB records and start clean?')) {
      try {
        await fetch(`${API_BASE}/expenses/reset/all`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Reset failed:', err);
      }
    }
  };

  // --- ADD EXPENSE VIA API ---
  const handleAddExpense = async (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!description.trim() || isNaN(val) || val <= 0 || !paidBy) return;

    if (splitType === 'exact') {
      const sum = Object.values(customSplits).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
      if (Math.abs(sum - val) > 0.5) {
        alert(`Sum of shares (₹${sum}) must equal total bill (₹${val})!`);
        return;
      }
    } else if (selectedSplits.length === 0) {
      alert('Select at least one member sharing this bill.');
      return;
    }

    const payload = {
      description,
      amount: val,
      category,
      paidBy,
      splitType,
      splitAmong: selectedSplits,
      customSplits: splitType === 'exact' ? customSplits : {},
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : null
    };

    try {
      const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setDescription('');
        setAmount('');
        setIsRecurring(false);
        setCustomSplits({});
        fetchData();
      }
    } catch (err) {
      console.error('Failed to post expense:', err);
    }
  };

  // --- TOGGLE SETTLE VIA API ---
  const toggleSettleExpense = async (id) => {
    try {
      await fetch(`${API_BASE}/expenses/${id}/settle`, { method: 'PATCH' });
      fetchData();
    } catch (err) {
      console.error('Failed to settle expense:', err);
    }
  };

  // --- DELETE EXPENSE VIA API ---
  const deleteExpense = async (id) => {
    try {
      await fetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  };

  // --- OCR BILL SCAN SIMULATION ---
  const startScanSimulation = (receiptPreset) => {
    setScannedBillDetails(receiptPreset);
    setScanState('scanning');

    setTimeout(() => {
      setScanState('success');

      setTimeout(() => {
        setDescription(receiptPreset.title);
        setAmount(receiptPreset.total.toString());
        setCategory(receiptPreset.category);
        setSplitType('exact');

        const newCustomSplits = {};
        members.forEach((m, idx) => {
          newCustomSplits[m.name] = receiptPreset.shares[idx % receiptPreset.shares.length] || 0;
        });

        const sharesTotal = Object.values(newCustomSplits).reduce((acc, v) => acc + v, 0);
        if (members.length > 0 && sharesTotal !== receiptPreset.total) {
          newCustomSplits[members[0].name] += (receiptPreset.total - sharesTotal);
        }

        setCustomSplits(newCustomSplits);
        setIsScanModalOpen(false);
        setScanState('idle');
      }, 1200);

    }, 2000);
  };

  // --- REAL-TIME UPI PAYMENT SIMULATION ---
  const handleSimulatePayment = () => {
    setPaymentStatus('processing');

    setTimeout(() => {
      const fakeUtr = 'UPI/' + Math.floor(100000000000 + Math.random() * 900000000000);
      setPaymentTxnDetails({
        utr: fakeUtr,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
      setPaymentStatus('success');

      // Auto settle related expenses via Backend
      expenses.forEach(exp => {
        if (exp.paidBy === activeQr.to && !exp.isSettled) {
          toggleSettleExpense(exp._id);
        }
      });
    }, 1800);
  };

  const closeQrModal = () => {
    setActiveQr(null);
    setPaymentStatus('idle');
    setPaymentTxnDetails(null);
  };

  const { netBalances, settlements, rawEdges, activeExpensesCount } = settlementData;
  const totalSpend = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const categoryStats = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            onClick={() => setActiveScreen('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-100 group-hover:bg-indigo-700 transition">
              <Coins size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Campus<span className="text-indigo-600">Split</span>
                </span>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">Min-Cash Flow Engine</span>
              </div>
              <p className="text-[11px] text-slate-500">Autonomous Debt Settlement Engine</p>
            </div>
          </div>

          <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveScreen('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition ${activeScreen === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Home size={14} /> Dashboard
            </button>

            <button
              onClick={() => setActiveScreen('graph')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition ${activeScreen === 'graph' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Zap size={14} className="text-amber-500" /> Graph Engine
            </button>

            <button
              onClick={() => setActiveScreen('ledger')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition ${activeScreen === 'ledger' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <History size={14} /> Ledger
            </button>

            <button
              onClick={() => setActiveScreen('analytics')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition ${activeScreen === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <ChartIcon size={14} /> Analytics
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <span>📊</span> Export CSV
            </button>
            <button
              onClick={handleResetAll}
              title="Clear all MongoDB data"
              className="text-xs bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-slate-600 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <RotateCcw size={13} /> Reset data
            </button>
          </div>
        </div>
      </header>

      {/* Sub-header Breadcrumb */}
      {activeScreen !== 'dashboard' && (
        <div className="bg-white border-b border-slate-200 px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveScreen('dashboard')}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold transition"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
              <span>Home</span>
              <ChevronRight size={12} />
              <span className="text-slate-700 uppercase font-semibold">{activeScreen}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">

        {/* VIEW 1: DASHBOARD */}
        {activeScreen === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column (5 cols) */}
            <div className="lg:col-span-5 space-y-5">

              {/* Member Registration */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Users size={16} className="text-indigo-600" /> Group Roster ({members.length})
                </h3>
                <form onSubmit={handleAddMember} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Enter name (e.g. Rahul)"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-600"
                  />
                  <input
                    type="text"
                    placeholder="UPI ID (optional)"
                    value={newMemberUpi}
                    onChange={(e) => setNewMemberUpi(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs outline-none font-mono focus:bg-white focus:border-indigo-600"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl text-xs font-bold transition">
                    <Plus size={14} />
                  </button>
                </form>

                {members.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No members in database. Add names above to begin.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {members.map(m => (
                      <span key={m._id || m.name} className="text-xs bg-slate-50 border border-slate-200 text-slate-700 pl-2.5 pr-1 py-1 rounded-full font-medium flex items-center gap-1.5">
                        {m.name}
                        <button onClick={() => removeMember(m.name)} className="text-slate-400 hover:text-rose-600 p-0.5 font-bold">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Log Expense Card With OCR Scanner */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Receipt size={16} className="text-indigo-600" /> Log Expense
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      if (members.length === 0) {
                        alert('Please add at least 1 member first to scan receipt.');
                        return;
                      }
                      setIsScanModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg font-bold transition shadow-sm"
                  >
                    <Camera size={13} className="text-indigo-600" /> Scan Bill (OCR)
                  </button>
                </div>

                <form onSubmit={handleAddExpense} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Bill Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Canteen Coffee / Wi-Fi Bill"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 outline-none text-slate-900 mt-1 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Amount (₹)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-slate-50 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 outline-none text-slate-900 font-bold mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 outline-none text-slate-700 mt-1"
                      >
                        <option value="Canteen">🍕 Canteen & Meals</option>
                        <option value="Project Lab">⚡ Lab Hardware</option>
                        <option value="Hostel">🏠 Hostel Utilities</option>
                        <option value="Other">📚 Other / General</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Paid By</label>
                      <select
                        value={paidBy}
                        onChange={(e) => setPaidBy(e.target.value)}
                        disabled={members.length === 0}
                        className="w-full bg-slate-50 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 outline-none text-slate-700 mt-1 disabled:bg-slate-100"
                      >
                        {members.length === 0 && <option value="">Add member first</option>}
                        {members.map(m => (
                          <option key={m._id || m.name} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Split Method</label>
                      <select
                        value={splitType}
                        onChange={(e) => setSplitType(e.target.value)}
                        className="w-full bg-slate-50 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 outline-none text-indigo-700 font-bold mt-1"
                      >
                        <option value="equal">Equal Split (1 / N)</option>
                        <option value="exact">Uneven / Itemized (₹)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <Repeat size={14} className="text-indigo-600" /> Recurring Expense
                    </label>
                    {isRecurring && (
                      <select
                        value={recurringFrequency}
                        onChange={(e) => setRecurringFrequency(e.target.value)}
                        className="text-xs bg-white text-indigo-700 border border-slate-200 rounded-lg px-2 py-0.5 font-semibold"
                      >
                        <option value="Weekly">Weekly (Mess)</option>
                        <option value="Monthly">Monthly (Hostel Wi-Fi)</option>
                      </select>
                    )}
                  </div>

                  {/* Split Allocations */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                      {splitType === 'equal' ? 'Split Consumers' : 'Uneven Individual Share (₹)'}
                    </label>

                    {members.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No members available to split.</p>
                    ) : splitType === 'equal' ? (
                      <div className="grid grid-cols-2 gap-2">
                        {members.map(m => (
                          <label key={m._id || m.name} className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                            <input
                              type="checkbox"
                              checked={selectedSplits.includes(m.name)}
                              onChange={() => setSelectedSplits(selectedSplits.includes(m.name) ? selectedSplits.filter(n => n !== m.name) : [...selectedSplits, m.name])}
                              className="rounded text-indigo-600"
                            />
                            <span className="font-semibold text-slate-700">{m.name}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        {members.map(m => (
                          <div key={m._id || m.name} className="flex items-center justify-between text-xs px-2 py-1">
                            <span className="text-slate-700 font-semibold">{m.name}</span>
                            <div className="flex items-center gap-1 font-mono">
                              <span className="text-slate-400">₹</span>
                              <input
                                type="number"
                                placeholder="0"
                                value={customSplits[m.name] || ''}
                                onChange={(e) => setCustomSplits({ ...customSplits, [m.name]: e.target.value })}
                                className="w-24 bg-white border border-slate-200 px-2 py-1 rounded-lg text-right text-slate-800 font-bold outline-none focus:border-indigo-600"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={members.length === 0}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 active:scale-[0.99] text-white text-xs font-bold py-3 rounded-xl shadow-md transition"
                  >
                    Save Expense to Data
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Settlements (7 cols) */}
            <div className="lg:col-span-7 space-y-5">

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Total Outlay</span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">₹{totalSpend.toFixed(0)}</p>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Active Debts</span>
                  <p className="text-2xl font-black text-rose-500 mt-0.5">{activeExpensesCount}</p>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Optimized Hops</span>
                  <p className="text-2xl font-black text-emerald-600 mt-0.5">{settlements.length}</p>
                </div>
              </div>

              {/* Optimal Settlements Cards */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <ArrowRightLeft size={16} className="text-indigo-600" /> Optimal Settlement Flow
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Calculated by Backend Greedy Algorithm Service.</p>
                  </div>
                  <button
                    onClick={() => setActiveScreen('graph')}
                    className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition"
                  >
                    <Zap size={13} className="text-amber-500" /> Open Graph Engine
                  </button>
                </div>

                {settlements.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
                    All accounts balanced. Zero pending debts!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {settlements.map((s) => {
                      const creditorObj = members.find(m => m.name === s.to);
                      const upiId = creditorObj?.upi || `${s.to.toLowerCase()}@upi`;
                      const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(s.to)}&am=${s.amount}&cu=INR`;

                      return (
                        <div key={s.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between hover:border-slate-300 transition">
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                              <span className="text-rose-600 font-extrabold">{s.from}</span>
                              <span className="text-slate-400 font-normal">transfers to</span>
                              <span className="text-indigo-600 font-extrabold">{s.to}</span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">
                              UPI: {upiId}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-lg font-black text-emerald-600">₹{s.amount}</span>
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(
                                `Hey ${s.from}, CampusSplit reminder: You have a pending settlement of ₹${s.amount} to ${s.to}. Please settle it via UPI: ${upiId}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                              title="Remind on WhatsApp"
                            >
                              <span>📲</span> Remind
                            </a>
                            <button
                              onClick={() => {
                                setActiveQr({ ...s, upiId, upiUrl });
                                setPaymentStatus('idle');
                              }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                            >
                              <QrCode size={14} /> Settle via UPI
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>


              {/* Net Position Grid */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Live Peer Net Balances</h3>
                {Object.keys(netBalances).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No members to calculate balance.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {Object.entries(netBalances).map(([name, bal]) => (
                      <div key={name} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">{name}</span>
                        <span className={`text-xs font-bold ${bal >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {bal >= 0 ? `+₹${Number(bal).toFixed(2)}` : `-₹${Math.abs(Number(bal)).toFixed(2)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: GRAPH ENGINE */}
        {activeScreen === 'graph' && (

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Zap size={20} className="text-indigo-600" /> Optimal Settlement Flow Engine
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Visualizing minimized cash flow transactions computed via Greedy Algorithm.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-xl">
                {settlements.length} Active Hops
              </span>
            </div>

            {/* Theme-Matched Flow Container */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Direct Net Settlement Channels
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Min-Cash Flow Reduction</span>
              </div>

              {settlements.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg border border-emerald-100">
                    ✓
                  </div>
                  All accounts balanced. Zero pending debt cycles in group!
                </div>
              ) : (
                <div className="space-y-3">
                  {settlements.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 border border-slate-200 hover:border-indigo-300 p-4 rounded-xl transition duration-150"
                    >
                      {/* Debtor */}
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-black flex items-center justify-center text-sm shadow-sm">
                          {s.from[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-tight">{s.from}</p>
                          <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Pays</span>
                        </div>
                      </div>

                      {/* Pathway with Amount Pill */}
                      <div className="flex-1 flex flex-col items-center px-6">
                        <span className="text-xs font-mono font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full mb-1 shadow-sm">
                          ₹{Number(s.amount).toFixed(2)}
                        </span>
                        <div className="w-full flex items-center gap-1">
                          <div className="h-[2px] w-full bg-gradient-to-r from-rose-300 via-indigo-300 to-emerald-400 rounded-full"></div>
                          <span className="text-emerald-600 text-xs font-bold">▶</span>
                        </div>
                      </div>

                      {/* Creditor */}
                      <div className="flex items-center gap-3 min-w-[140px] justify-end text-right">
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-tight">{s.to}</p>
                          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Receives</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 font-black flex items-center justify-center text-sm shadow-sm">
                          {s.to[0]?.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: LEDGER */}
        {activeScreen === 'ledger' && (
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <History size={16} className="text-indigo-600" /> MongoDB Transaction Ledger ({expenses.length})
              </h2>
              <button
                onClick={() => setActiveScreen('dashboard')}
                className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold text-slate-700 flex items-center gap-1.5"
              >
                <ArrowLeft size={13} /> Back to Dashboard
              </button>
            </div>

            <div className="space-y-2">
              {expenses.length === 0 ? (
                <p className="text-center py-10 text-xs text-slate-400">No transactions recorded in database.</p>
              ) : (
                expenses.map((exp) => (
                  <div key={exp._id} className={`p-4 rounded-xl border flex items-center justify-between text-xs transition ${exp.isSettled ? 'bg-slate-50 opacity-60 border-slate-200 line-through' : 'bg-white border-slate-200'
                    }`}>
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        {exp.description}
                        {exp.isRecurring && (
                          <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-bold no-underline">
                            Recurring ({exp.recurringFrequency})
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 mt-1 no-underline">
                        Paid by <b className="text-slate-700">{exp.paidBy}</b> • {exp.category} • Split: {exp.splitType}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 no-underline">
                      <span className="text-base font-black text-slate-900">₹{exp.amount.toFixed(2)}</span>
                      <button
                        onClick={() => toggleSettleExpense(exp._id)}
                        className={`p-2 rounded-lg font-bold transition ${exp.isSettled ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                      >
                        <Check size={14} />
                      </button>
                      <button onClick={() => deleteExpense(exp._id)} className="text-slate-400 hover:text-rose-600 p-1">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: ANALYTICS */}
        {activeScreen === 'analytics' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Outlay</span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  ₹{expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toFixed(2)}
                </p>
                <span className="text-[11px] text-indigo-600 font-semibold mt-1 inline-block">Total campus spend</span>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bills</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{expenses.length}</p>
                <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">Logged across roster</span>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Debts</span>
                <p className="text-2xl font-black text-rose-600 mt-1">{settlements.length}</p>
                <span className="text-[11px] text-rose-500 font-medium mt-1 inline-block">Pending transactions</span>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hops Reduced</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {Math.max(0, (members.length * (members.length - 1)) / 2 - settlements.length)}
                </p>
                <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">Min-Cash Flow saved</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Breakdown Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
                  Category Distribution
                  <span className="text-xs font-normal text-slate-400">By total volume</span>
                </h3>

                {expenses.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">No transactions logged yet.</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(
                      expenses.reduce((acc, curr) => {
                        const cat = curr.category || 'General';
                        acc[cat] = (acc[cat] || 0) + Number(curr.amount || 0);
                        return acc;
                      }, {})
                    ).map(([cat, amt], idx) => {
                      const total = expenses.reduce((a, b) => a + Number(b.amount || 0), 0) || 1;
                      const pct = Math.round((amt / total) * 100);
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-700">{cat}</span>
                            <span className="text-slate-500 font-mono">₹{amt.toFixed(2)} ({pct}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Member Contributions & Ledger Balances */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
                  Peer Balance Position
                  <span className="text-xs font-normal text-slate-400">Real-time Net Standings</span>
                </h3>

                {members.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">No group members registered.</p>
                ) : (
                  <div className="space-y-3">
                    {members.map((m, idx) => {
                      // Net balance calculation
                      const paid = expenses
                        .filter((e) => e.payer === m.name)
                        .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs">
                              {m.name[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 leading-tight">{m.name}</p>
                              <span className="text-[11px] text-slate-400">Paid ₹{paid.toFixed(2)} total</span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-sm">
                            {m.upi || 'No UPI ID'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- MODAL 1: HIGH-TECH LIVE OCR SCANNER SIMULATION --- */}
      {isScanModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={16} className="text-indigo-600" /> Smart Receipt Scanner (OCR)
              </h3>
              {scanState === 'idle' && (
                <button
                  onClick={() => setIsScanModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {scanState === 'scanning' && (
              <div className="text-center py-6 space-y-4">
                <div className="relative w-48 h-48 mx-auto bg-slate-900 rounded-2xl border-2 border-dashed border-indigo-500 overflow-hidden flex flex-col items-center justify-center p-4 shadow-inner">
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce"></div>
                  <div className="w-full bg-white/10 rounded p-2 text-left space-y-1 font-mono text-[9px] text-indigo-200">
                    <div className="w-3/4 h-2 bg-white/30 rounded animate-pulse"></div>
                    <div className="w-1/2 h-2 bg-white/20 rounded"></div>
                    <div className="w-full h-px bg-white/20 my-1"></div>
                    <div className="flex justify-between">
                      <span>ITEM 01</span>
                      <span className="text-cyan-300">DETECTED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ITEM 02</span>
                      <span className="text-cyan-300">DETECTED</span>
                    </div>
                  </div>
                  <span className="absolute bottom-2 text-[10px] font-mono font-bold text-cyan-400 tracking-wider animate-pulse">
                    AI OCR SCANNING...
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin text-indigo-600" /> Processing Receipt Texture...
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">Parsing itemized prices & uneven distribution</p>
                </div>
              </div>
            )}

            {scanState === 'success' && (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100 scale-110 transition-transform">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900">Receipt Scanned & Parsed!</h4>
                  <p className="text-xs text-emerald-600 font-bold font-mono">✓ {scannedBillDetails?.title} (₹{scannedBillDetails?.total})</p>
                  <p className="text-[11px] text-slate-400">Auto-filling itemized shares into Form...</p>
                </div>
              </div>
            )}

            {scanState === 'idle' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Select a campus bill to activate the camera viewfinder and scan itemized lines:
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => startScanSimulation({
                      title: 'Canteen Dosa & Oreo Shake',
                      total: 380,
                      category: 'Canteen',
                      shares: [220, 160]
                    })}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/50 transition group flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                        🍕 Canteen Food Invoice #402
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        1x Masala Dosa (₹220), 2x Shake (₹160)
                      </p>
                    </div>
                    <span className="text-xs font-black font-mono text-emerald-600">₹380</span>
                  </button>

                  <button
                    onClick={() => startScanSimulation({
                      title: 'Robotics Sensors & Microcontroller',
                      total: 850,
                      category: 'Project Lab',
                      shares: [450, 400]
                    })}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/50 transition group flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                        ⚡ Lab Components Slip #109
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        1x NodeMCU (₹450), Sensors (₹400)
                      </p>
                    </div>
                    <span className="text-xs font-black font-mono text-emerald-600">₹850</span>
                  </button>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-600 shrink-0" />
                  Triggers computer vision OCR simulation with live feedback.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL 2: INTERACTIVE DYNAMIC UPI MODAL WITH REAL-TIME GPAY/PHONEPE SUCCESS FLOW --- */}
      {activeQr && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl border border-slate-100 relative overflow-hidden transition-all">

            {/* 1. PROCESSING PAYMENT STATE */}
            {paymentStatus === 'processing' && (
              <div className="py-8 space-y-4">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <Coins size={24} className="text-indigo-600 absolute" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Connecting to Bank...</h4>
                  <p className="text-xs text-slate-500 mt-1 font-mono">Authorizing ₹{activeQr.amount} via UPI NPCI</p>
                </div>
              </div>
            )}

            {/* 2. PAYMENT SUCCESSFUL SCREEN (Real GPay / PhonePe Receipt) */}
            {paymentStatus === 'success' && (
              <div className="py-3 space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100 scale-110">
                  <CheckCircle2 size={38} className="text-emerald-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full">
                    Payment Successful
                  </span>
                  <div className="text-3xl font-black font-mono text-slate-900 mt-2">₹{activeQr.amount}</div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Paid to <span className="font-bold text-slate-800">{activeQr.to}</span>
                  </p>
                </div>

                {/* Digital Bank Receipt */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-left space-y-1 text-[11px] font-mono text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">UPI Ref / UTR:</span>
                    <span className="font-bold text-slate-800">{paymentTxnDetails?.utr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Timestamp:</span>
                    <span>{paymentTxnDetails?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Debited from:</span>
                    <span className="font-semibold text-rose-600">{activeQr.from}</span>
                  </div>
                </div>

                <button
                  onClick={closeQrModal}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl shadow-md shadow-emerald-200 transition"
                >
                  ✓ Done & Auto-Settle Debt
                </button>
              </div>
            )}

            {/* 3. DEFAULT QR CODE VIEW */}
            {paymentStatus === 'idle' && (
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UPI NPCI Gateway</span>
                  <button onClick={closeQrModal} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
                </div>

                <div className="mt-2.5">
                  <h3 className="text-sm font-bold text-slate-900">Scan via Any UPI App</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    <span className="text-rose-600 font-bold">{activeQr.from}</span> pays <span className="text-indigo-600 font-bold">{activeQr.to}</span>
                  </p>
                </div>

                <div className="my-3 flex justify-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <QRCodeSVG value={activeQr.upiUrl} size={155} />
                </div>

                <div className="text-2xl font-black text-emerald-600">₹{activeQr.amount}</div>
                <div className="text-[11px] text-slate-400 font-mono mb-3">{activeQr.upiId}</div>

                <div className="space-y-2">
                  {/* MAIN SIMULATOR BUTTON */}
                  <button
                    onClick={handleSimulatePayment}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-md shadow-emerald-200 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 size={15} /> Simulate Successful Pay
                  </button>

                  <div className="flex gap-2">
                    <a
                      href={activeQr.upiUrl}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition"
                    >
                      Launch App
                    </a>
                    <button
                      onClick={closeQrModal}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2 rounded-xl transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}