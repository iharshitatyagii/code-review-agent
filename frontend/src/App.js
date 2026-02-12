import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AlertTriangle, 
  Code2, 
  Loader2, 
  Wand2, 
  History, 
  ExternalLink, 
  Upload, 
  FileJson,
  CheckCircle2
} from 'lucide-react';

function App() {
  const [code, setCode] = useState('');
  const [customRules, setCustomRules] = useState('');
  const [rulesFile, setRulesFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/history');
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const handleReview = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      const formData = new FormData();
      formData.append('code', code);
      formData.append('customRules', customRules);
      if (rulesFile) {
        formData.append('rules', rulesFile);
      }

      const response = await axios.post('http://localhost:5000/api/review/analyze', formData);
      const analysisData = response.data;
      setResults(analysisData);

      // Labeling for History Dashboard
      const isGitHub = code.includes('github.com');
      const displayName = isGitHub 
        ? code.split('github.com/')[1]?.split('/pull')[0] 
        : "Manual Snippet Analysis";

      await axios.post('http://localhost:5000/api/history/save', {
        repoName: displayName,
        prLink: isGitHub ? code : "#",
        summary: analysisData.summary,
        rating: analysisData.rating,
        issues: analysisData.issues
      });
      
      fetchHistory();

    } catch (err) {
      alert("Analysis failed. Please check if the backend is running.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <header className="mb-8 max-w-6xl mx-auto border-b border-gray-800 pb-6">
        <h1 className="text-4xl font-black flex items-center gap-3 tracking-tight">
          <Code2 className="text-blue-500" size={40} /> 
          Code Review Agent
        </h1>
        <p className="text-gray-400 mt-2 text-lg font-medium">Full-Stack AI Agent by Virat Sirohi</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* --- INPUT SECTION --- */}
        <section className="flex flex-col gap-4">
          
          <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-2xl space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-2">
                <Wand2 size={18} className="text-purple-400"/> Custom Instructions
              </label>
              <input 
                type="text"
                placeholder="e.g., 'Focus on security' or 'Roast my code'"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={customRules}
                onChange={(e) => setCustomRules(e.target.value)}
              />
            </div>

            <div className="border-t border-gray-700 pt-4">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-2">
                <FileJson size={18} className="text-green-400"/> Knowledge Base (rules.json)
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 px-5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all">
                  <Upload size={16} />
                  {rulesFile ? "Update rules.json" : "Upload rules.json"}
                  <input 
                    type="file" 
                    accept=".json"
                    className="hidden"
                    onChange={(e) => setRulesFile(e.target.files[0])}
                  />
                </label>
                {rulesFile && (
                  <span className="text-sm text-green-400 flex items-center gap-1 font-medium">
                     <CheckCircle2 size={16} /> {rulesFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <textarea
            className="w-full h-[350px] p-4 bg-gray-800 border border-gray-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-inner"
            placeholder="// Paste code or GitHub PR URL here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          
          <button 
            onClick={handleReview}
            disabled={loading || !code}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 p-4 rounded-xl font-black text-xl flex justify-center items-center gap-3 transition-all shadow-lg hover:scale-[1.01]"
          >
            {loading ? <><Loader2 className="animate-spin" /> RUNNING AUDIT...</> : "ANALYZE CODE"}
          </button>
        </section>

        {/* --- RESULTS SECTION --- */}
        <section className="bg-gray-800 p-6 rounded-xl border border-gray-700 overflow-y-auto max-h-[700px] shadow-2xl relative">
          {!results && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 italic">
              <Code2 size={80} className="mb-4 opacity-20" />
              <p>Ready for analysis. Awaiting input...</p>
            </div>
          )}
          
          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-blue-400">
              <Loader2 size={60} className="animate-spin mb-4" />
              <p className="text-lg font-bold tracking-widest animate-pulse uppercase">Consulting Gemini...</p>
            </div>
          )}

          {results && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-start mb-6 border-b border-gray-700 pb-5">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Audit Report</h2>
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 text-center min-w-[100px]">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Health</span>
                  <div className={`text-3xl font-black ${
                    results.rating >= 8 ? 'text-green-400' :
                    results.rating >= 5 ? 'text-yellow-400' : 'text-red-500'
                  }`}>
                    {results.rating}/10
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/10 p-5 rounded-lg mb-8 border-l-4 border-blue-500 shadow-lg">
                <p className="text-gray-200 leading-relaxed font-medium italic">"{results.summary}"</p>
              </div>
              
              <div className="space-y-5">
                {results.issues.map((issue, index) => (
                  <div key={index} className="p-5 bg-gray-900/50 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${
                        issue.type.toLowerCase().includes('critical') ? 'bg-red-900/50 text-red-400 border border-red-900' : 'bg-yellow-900/50 text-yellow-400 border border-yellow-900'
                      }`}>
                        <AlertTriangle size={12} /> Line {issue.line}: {issue.type}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">{issue.message}</p>
                    <div className="bg-black/40 p-3 rounded-lg text-green-400 text-xs font-mono border border-green-900/20">
                      <span className="text-gray-600 font-bold mr-2 uppercase">Fix:</span>
                      {issue.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* --- DASHBOARD SECTION --- */}
      <section className="max-w-6xl mx-auto mt-20 pt-10 border-t border-gray-800">
        <h2 className="text-3xl font-black flex items-center gap-3 text-white uppercase tracking-tighter mb-8">
          <History className="text-blue-500" size={32} /> Recent Reviews
        </h2>
        
        {history.length === 0 ? (
          <p className="text-gray-500 font-medium">No audit history found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((review) => (
              <div key={review.id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-blue-400 truncate text-sm uppercase tracking-wider">{review.repoName}</h3>
                    <div className="text-xs font-black text-white">{review.rating}/10</div>
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-2 italic mb-4">"{review.summary}"</p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-600 font-bold border-t border-gray-700 pt-4">
                  <span>{new Date(review.timestamp).toLocaleDateString()}</span>
                  <a href={review.prLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-500">
                    PR LINK <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;