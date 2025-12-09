import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { 
  Activity, Mountain, AlertTriangle, Target, Battery, Wifi, Signal, Zap,
  ShieldAlert, CheckCircle2, Navigation, BookOpen, Settings, Plus, Save,
  Brain, Dumbbell, Coffee, History, Trash2, Share
} from 'lucide-react';

// --- TYPES & INTERFACES ---

type RadarState = {
  inner: number;
  peers: number;
  family: number;
  media: number;
  professors: number;
  fog: number;
};

type GoalState = {
  title: string;
  date: string;
  carb_cognitive: string;
  carb_physical: string;
  carb_recovery: string;
};

type LogEntry = {
  id: number;
  date: string;
  domain: string;
};

type CrisisState = {
  supportPerson: string;
  booster: string;
};

// --- CUSTOM HOOK FOR LOCAL STORAGE ---
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// --- COMPONENTS UTILS ---

const Header = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-6 pt-2">
    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</h2>
    {subtitle && <h1 className="text-2xl font-black text-white leading-tight">{subtitle}</h1>}
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5 shadow-lg ${className}`}>
    {children}
  </div>
);

const SliderControl = ({ label, value, onChange, colorClass = "accent-emerald-500" }: { label: string, value: number, onChange: (v: number) => void, colorClass?: string }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono text-slate-200">{value}%</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer ${colorClass}`}
    />
  </div>
);

const InputField = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) => (
  <div className="mb-3">
    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{label}</label>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-600"
    />
  </div>
);

// --- PAGE 1: RADAR (Module A) ---
const PageRadar = ({ data, updateData }: { data: RadarState, updateData: (k: keyof RadarState, v: number) => void }) => {
  
  const chartData = [
    { subject: 'Voix Int.', A: data.inner, fullMark: 100 },
    { subject: 'Pairs/Amis', A: data.peers, fullMark: 100 },
    { subject: 'Famille', A: data.family, fullMark: 100 },
    { subject: 'Médias', A: data.media, fullMark: 100 },
    { subject: 'Profs', A: data.professors, fullMark: 100 },
  ];

  // Logique mise à jour pour les 3 niveaux de brouillard
  const analyzeSignal = () => {
    // Niveau 1 : Brouillard Faible (0-30%)
    if (data.fog <= 30) {
        return { 
            status: "OPTIMAL", 
            color: "text-emerald-400", 
            borderColor: "border-emerald-500",
            msg: "Visibilité excellente. Conditions de vol idéales." 
        };
    }
    // Niveau 2 : Brouillard Moyen (31-70%)
    else if (data.fog <= 70) {
        return { 
            status: "INTERMÉDIAIRE", 
            color: "text-orange-400", 
            borderColor: "border-orange-500",
            msg: "Visibilité réduite. Soyez vigilant aux interférences." 
        };
    }
    // Niveau 3 : Brouillard Élevé (71-100%)
    else {
        return { 
            status: "CRITIQUE", 
            color: "text-red-500", 
            borderColor: "border-red-500",
            msg: "Visibilité nulle. Arrêt immédiat conseillé." 
        };
    }
  };

  const analysis = analyzeSignal();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Header title="Système de Navigation" subtitle="Calibrage des Capteurs" />
      
      <Card className="relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm font-mono">DENSITÉ BROUILLARD</span>
          <span className={`font-bold animate-pulse ${analysis.color}`}>{analysis.status}</span>
        </div>
        <input 
          type="range" min="0" max="100" value={data.fog} 
          onChange={(e) => updateData('fog', parseInt(e.target.value))}
          className="w-full h-4 bg-slate-900 rounded-full appearance-none cursor-pointer accent-slate-400 opacity-80 hover:opacity-100 transition-opacity"
        />
        <div className="mt-2 text-right text-3xl font-mono font-bold text-white">{data.fog}%</div>
      </Card>

      <Card>
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Influences" dataKey="A" stroke="#38bdf8" strokeWidth={2} fill="#38bdf8" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2 bg-black/20 p-3 rounded-xl border border-white/5">
<>
  <SliderControl 
    label="Voix Intérieure (Moi)" 
    value={data.inner} 
    onChange={(v) => updateData('inner', v)} 
    colorClass="accent-sky-500" 
  />

  <div className="grid grid-cols-2 gap-x-4">
    <SliderControl label="Pairs/Amis" value={data.peers} onChange={(v) => updateData('peers', v)} colorClass="accent-red-400" />
    <SliderControl label="Famille" value={data.family} onChange={(v) => updateData('family', v)} colorClass="accent-red-400" />
    <SliderControl label="Médias" value={data.media} onChange={(v) => updateData('media', v)} colorClass="accent-red-400" />
    <SliderControl label="Profs" value={data.professors} onChange={(v) => updateData('professors', v)} colorClass="accent-red-400" />
  </div>
</>

        </div>
      </Card>

      <div className={`bg-slate-800 border-l-4 rounded-r-xl p-4 flex gap-3 items-start ${analysis.borderColor}`}>
        <Activity className="text-slate-400 shrink-0 mt-1" size={20} />
        <div>
          <h3 className={`font-bold text-sm mb-1 ${analysis.color}`}>ANALYSE SYSTÈME</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{analysis.msg}</p>
        </div>
      </div>
    </div>
  );
};

// --- PAGE 2: ASCENSION (Module B) ---
const PageAscension = ({ data, updateData }: { data: GoalState, updateData: (k: keyof GoalState, v: string) => void }) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Header title="Déploiement Stratégique" subtitle="Altitude & Matériel" />

      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <div className="flex gap-4">
            <div className="flex-1">
                <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Objectif Sommet</label>
                <input 
                    type="text" 
                    value={data.title}
                    onChange={(e) => updateData('title', e.target.value)}
                    placeholder="Mon objectif..."
                    className="w-full bg-transparent border-b border-emerald-500/50 text-xl font-black text-white focus:outline-none focus:border-emerald-500 mt-1 placeholder:text-slate-600"
                />
            </div>
            <div className="w-24">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date Cible</label>
                <input 
                    type="text" 
                    value={data.date}
                    onChange={(e) => updateData('date', e.target.value)}
                    className="w-full bg-transparent border-b border-slate-600 text-right text-lg font-mono text-slate-300 focus:outline-none focus:border-emerald-500 mt-1"
                />
            </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2">Configuration Mousquetons</h3>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
            <Brain size={18} />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-purple-400 font-bold">COGNITIF (Deep Work)</label>
            <input 
                type="text" 
                value={data.carb_cognitive}
                onChange={(e) => updateData('carb_cognitive', e.target.value)}
                placeholder="Ex: Lecture"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center gap-3">
          <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400">
            <Dumbbell size={18} />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-orange-400 font-bold">PHYSIQUE (Activation)</label>
            <input 
                type="text" 
                value={data.carb_physical}
                onChange={(e) => updateData('carb_physical', e.target.value)}
                placeholder="Ex: 20 Pompes au réveil"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
            <Coffee size={18} />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-blue-400 font-bold">RÉCUPÉRATION (Off)</label>
            <input 
                type="text" 
                value={data.carb_recovery}
                onChange={(e) => updateData('carb_recovery', e.target.value)}
                placeholder="Ex: Sieste 15min"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PAGE 3: COCKPIT (Module C) ---
const PageCockpit = ({ 
    logs, 
    addLog, 
    clearLogs,
    crisisData, 
    updateCrisis 
}: { 
    logs: LogEntry[], 
    addLog: (val: string) => void,
    clearLogs: () => void,
    crisisData: CrisisState,
    updateCrisis: (k: keyof CrisisState, v: string) => void
}) => {
  const [crisisMode, setCrisisMode] = useState(false);
  const [newLog, setNewLog] = useState("");

  const handleAddLog = () => {
    if(newLog.trim()) {
        addLog(newLog);
        setNewLog("");
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Header title="Protocole de Résilience" subtitle="Journal & Urgences" />

      {!crisisMode ? (
        <button 
          onClick={() => setCrisisMode(true)}
          className="w-full py-8 bg-gradient-to-b from-red-900 to-red-950 rounded-2xl border border-red-800/50 active:scale-95 transition-all flex items-center justify-center gap-4 group"
        >
          <div className="bg-red-600 p-3 rounded-full animate-pulse group-hover:scale-110 transition-transform">
             <ShieldAlert size={24} className="text-white" />
          </div>
          <div className="text-left">
            <span className="block text-xl font-black text-red-100 tracking-wider">SOS CRASH</span>
            <span className="text-red-400 text-xs">Protocole d'urgence</span>
          </div>
        </button>
      ) : (
        <Card className="border-red-500/50 bg-red-950/30 animate-in zoom-in duration-300 relative">
            <button onClick={() => setCrisisMode(false)} className="absolute top-4 right-4 text-xs text-slate-400 underline">Fermer</button>
            <h3 className="font-bold text-red-400 flex items-center gap-2 mb-4">
                <AlertTriangle size={18}/> MODE SURVIE ACTIVÉ
            </h3>
            
            <div className="space-y-4">
                <div className="bg-black/40 p-3 rounded border-l-2 border-red-500">
                    <p className="text-xs text-slate-400 mb-1">Ne réfléchis pas. Exécute :</p>
                    <p className="text-white font-mono font-bold">N'oublie pas ton objectif, ouvre ton sac et accroche toi à tes mousquetons.</p>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">Ancrages de Sécurité</p>
                    <InputField 
                        label="Qui est ma personne ressource ?" 
                        value={crisisData.supportPerson} 
                        onChange={(v) => updateCrisis('supportPerson', v)}
                        placeholder="Ex: Meilleur Pote..."
                    />
                    <InputField 
                        label="Qu'est ce qui est ridicule mais me booste ?" 
                        value={crisisData.booster} 
                        onChange={(v) => updateCrisis('booster', v)}
                        placeholder="Ex: Chanter Céline Dion..."
                    />
                </div>
            </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-3">
             <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History size={16} className="text-sky-400"/> Historique +1%
             </h3>
             <div className="flex items-center gap-2">
                <span className="text-xs bg-sky-900 text-sky-200 px-2 py-0.5 rounded-full">{logs.length} entrées</span>
                {logs.length > 0 && (
                    <button onClick={clearLogs} className="text-slate-600 hover:text-red-400 p-1">
                        <Trash2 size={14} />
                    </button>
                )}
             </div>
        </div>
        
        <div className="flex gap-2 mb-4">
            <input 
                type="text" 
                value={newLog}
                onChange={(e) => setNewLog(e.target.value)}
                placeholder="Aujourd'hui, j'ai..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-sky-500 outline-none"
            />
            <button 
                onClick={handleAddLog}
                className="bg-sky-600 hover:bg-sky-500 text-white p-2 rounded-lg transition-colors"
            >
                <Plus size={20} />
            </button>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
            {logs.length === 0 && <p className="text-xs text-slate-500 italic text-center py-2">Aucune progression enregistrée.</p>}
            {logs.slice().reverse().map((log) => (
                <div key={log.id} className="text-xs flex gap-3 text-slate-300 border-b border-slate-700/50 pb-2 last:border-0">
                    {/* Date format updated to include both day name and day number as requested */}
                    <span className="font-mono text-slate-500 shrink-0 w-12">{log.date}</span>
                    <span className="truncate">{log.domain}</span>
                </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

// --- PAGE 4: MISSION (Module D) ---
const PageMission = ({ 
    radar, 
    goal, 
    logCount 
}: { 
    radar: RadarState, 
    goal: GoalState, 
    logCount: number 
}) => {

  const calculateMatrix = useMemo(() => {
    const externalNoise = (radar.peers + radar.media + radar.family + radar.professors) / 4;
    const masteryScore = (
        (radar.inner * 0.5) + 
        ((100 - radar.fog) * 0.3) + 
        ((100 - externalNoise) * 0.2)
    ) / 10;

    const carbCount = [goal.carb_cognitive, goal.carb_physical, goal.carb_recovery].filter(c => c.length > 2).length;
    const goalSet = goal.title.length > 2 ? 1 : 0;
    const impactScore = (
        ((carbCount / 3) * 10 * 0.4) +
        (goalSet * 10 * 0.2) +
        (Math.min(logCount, 10) / 10 * 10 * 0.4)
    );

    return { x: masteryScore, y: impactScore };
  }, [radar, goal, logCount]);

  const { x, y } = calculateMatrix;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Header title="Le Manifeste de Gravité" subtitle="Autorisation de Vol" />

      <Card className="aspect-square relative p-6 bg-slate-800 overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 tracking-widest uppercase font-bold">Zone d'Impact</div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-400 tracking-widest uppercase font-bold">Niveau Maîtrise</div>
        
        <div className="w-full h-full border border-slate-600/50 bg-[linear-gradient(rgba(51,65,85,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(51,65,85,0.1)_1px,transparent_1px)] bg-[size:20px_20px] relative">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-500/10 border-l border-b border-emerald-500/30 flex items-center justify-center">
                <span className="text-[10px] text-emerald-500/50 font-mono absolute top-2 right-2">GRAVITÉ</span>
            </div>

            <div 
                className="absolute w-4 h-4 -ml-2 -mt-2 transition-all duration-1000 ease-out"
                style={{ 
                    left: `${Math.min(Math.max(x * 10, 5), 95)}%`, 
                    bottom: `${Math.min(Math.max(y * 10, 5), 95)}%` 
                }}
            >
                <div className="animate-ping absolute h-full w-full rounded-full bg-white opacity-50"></div>
                <div className="relative rounded-full h-full w-full bg-white shadow-[0_0_15px_white] border-2 border-slate-900"></div>
            </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border-t-4 border-purple-500">
          <div className="text-xs text-slate-400 mb-1">MAÎTRISE (X)</div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-mono font-bold text-white">{x.toFixed(1)}</div>
            <div className="text-[10px] text-slate-500">/10</div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border-t-4 border-sky-500">
          <div className="text-xs text-slate-400 mb-1">IMPACT (Y)</div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-mono font-bold text-white">{y.toFixed(1)}</div>
            <div className="text-[10px] text-slate-500">/10</div>
          </div>
        </div>
      </div>
      
      {x > 7 && y > 7 && (
        <div className="bg-emerald-900/30 border border-emerald-500/50 p-3 rounded-xl flex items-center gap-3 animate-pulse">
            <CheckCircle2 className="text-emerald-400" size={20}/>
            <div className="text-sm text-emerald-100 font-bold">Autorisation de Vol Validée</div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP SHELL ---

const App = () => {
  const [activeTab, setActiveTab] = useState('radar');

  // --- PERSISTENT STATE ---
  
  const [radarData, setRadarData] = useLocalStorage<RadarState>('pilot_radar', {
    inner: 30, peers: 90, family: 50, media: 70, professors: 60, fog: 75
  });

  // Suppression des valeurs par défaut pour title et carb_cognitive, et date fixée au 15 mai
  const [goalData, setGoalData] = useLocalStorage<GoalState>('pilot_goal', {
    title: "",
    date: "15 Mai",
    carb_cognitive: "",
    carb_physical: "",
    carb_recovery: ""
  });

  const [plusOneLogs, setPlusOneLogs] = useLocalStorage<LogEntry[]>('pilot_logs', []);

  const [crisisData, setCrisisData] = useLocalStorage<CrisisState>('pilot_crisis', {
    supportPerson: "",
    booster: ""
  });

  // --- HANDLERS ---
  const updateRadar = (key: keyof RadarState, val: number) => {
    setRadarData(prev => ({ ...prev, [key]: val }));
  };

  const updateGoal = (key: keyof GoalState, val: string) => {
    setGoalData(prev => ({ ...prev, [key]: val }));
  };

  const addPlusOneLog = (domain: string) => {
    // Format de date demandé : "Lun 1" (Jour court + Numéro)
    const now = new Date();
    // Get day name, e.g., "Lun."
    const dayName = now.toLocaleDateString('fr-FR', { weekday: 'short' });
    const dayNum = now.getDate();
    // The previous format was `dayName.charAt(0).toUpperCase() + dayName.slice(1)` which is correct for capitalizing the first letter.
    // However, French short day names already contain a period, e.g. "lun.". We should remove the period if present.
    // Also, ensure the day name is fully lowercase before capitalizing the first letter, to handle variations.
    
    // Clean and format day name: e.g., "lun" -> "Lun"
    let cleanDayName = dayName.replace('.', '').toLowerCase();
    cleanDayName = cleanDayName.charAt(0).toUpperCase() + cleanDayName.slice(1);
    
    const formattedDate = `${cleanDayName} ${dayNum}`; 

    const newEntry = { id: Date.now(), date: formattedDate, domain };
    setPlusOneLogs(prev => [...prev, newEntry]);
  };

  const clearLogs = () => {
    if(window.confirm("Réinitialiser l'historique de vol ?")) {
        setPlusOneLogs([]);
    }
  };

  const updateCrisis = (key: keyof CrisisState, val: string) => {
    setCrisisData(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-sans p-4 sm:p-8">
      <div className="w-full max-w-sm h-[850px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header UI */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50"></div>
        <div className="px-6 pt-3 pb-2 flex justify-between items-center text-white z-40 bg-slate-900">
          <div className="text-xs font-medium w-12 text-center pl-2">09:41</div>
          <div className="flex gap-2 items-center pr-2">
            <Signal size={14} /> <Wifi size={14} /> <Battery size={16} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-24 scrollbar-hide">
          {activeTab === 'radar' && <PageRadar data={radarData} updateData={updateRadar} />}
          {activeTab === 'ascension' && <PageAscension data={goalData} updateData={updateGoal} />}
          {activeTab === 'cockpit' && <PageCockpit logs={plusOneLogs} addLog={addPlusOneLog} clearLogs={clearLogs} crisisData={crisisData} updateCrisis={updateCrisis} />}
          {activeTab === 'mission' && <PageMission radar={radarData} goal={goalData} logCount={plusOneLogs.length} />}
        </div>

        {/* Tab Bar */}
        <div className="absolute bottom-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-8 pt-4 px-6 flex justify-between items-end z-40">
          {[
            { id: 'radar', icon: Navigation, label: 'Radar' },
            { id: 'ascension', icon: Mountain, label: 'Topo' },
            { id: 'cockpit', icon: Activity, label: 'Cockpit' },
            { id: 'mission', icon: Target, label: 'Mission' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === tab.id ? 'text-emerald-400 scale-110' : 'text-slate-600'}`}
            >
              <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700 rounded-full z-50"></div>
      </div>
    </div>
  );
};

export default App;
