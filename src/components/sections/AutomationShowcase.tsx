import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  ArrowRight,
  Sparkles,
  Database,
  Bell,
  Mail,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
  Bot,
  Layers,
  Activity
} from 'lucide-react';

interface WorkflowScenario {
  id: string;
  name: string;
  description: string;
  trigger: {
    label: string;
    subtext: string;
    icon: string;
    tag: string;
  };
  aiProcessing: {
    label: string;
    subtext: string;
    model: string;
    accuracy: string;
  };
  automation: {
    label: string;
    subtext: string;
    service: string;
    actions: string[];
  };
  result: {
    label: string;
    subtext: string;
    metric: string;
    outcome: string;
  };
}

const SCENARIOS: WorkflowScenario[] = [
  {
    id: 'support',
    name: 'Customer Support Triage',
    description: 'Autonomous resolution of tier-1 support queries with semantic knowledge retrieval and instant CRM routing.',
    trigger: {
      label: 'Customer Message',
      subtext: 'Inquiry received via web chat: "How do I map custom DNS domains?"',
      icon: 'Mail',
      tag: 'Webhook Trigger'
    },
    aiProcessing: {
      label: 'AI Embeddings & Intent Extraction',
      subtext: 'Analyzes technical terminology, queries RAG documentation, checks user plan entitlement.',
      model: 'Gemini 1.5 Flash (180ms)',
      accuracy: '99.4% confidence'
    },
    automation: {
      label: 'Multi-Step Execution Pipeline',
      subtext: 'Formats verified solution snippet, generates sandbox DNS sample record, updates ticket priority.',
      service: 'Supabase Edge Functions',
      actions: ['Query Vector DB', 'Check Stripe Subscription', 'Format Markdown Answer']
    },
    result: {
      label: 'Instant Resolution & Notification',
      subtext: 'Customer receives accurate solution in 1.4 seconds. Support rep notified only if follow-up required.',
      metric: '1.4s Latency',
      outcome: 'Ticket Closed Autonomously'
    }
  },
  {
    id: 'lead-enrichment',
    name: 'B2B Lead Qualification & Sync',
    description: 'Real-time prospective customer evaluation, company revenue scraping, and automated Slack notifications.',
    trigger: {
      label: 'New Website Inbound Form',
      subtext: 'Prospect submits project scope: "Enterprise AI chatbot for 500+ team agents"',
      icon: 'Zap',
      tag: 'Form Submission'
    },
    aiProcessing: {
      label: 'Contextual Lead Scoring',
      subtext: 'Evaluates domain authority, company funding stage, tech stack compatibility, and budget size.',
      model: 'AI Evaluation Engine',
      accuracy: 'Tier-A Qualified'
    },
    automation: {
      label: 'HubSpot & Calendar Orchestration',
      subtext: 'Appends verified LinkedIn decision-maker profiles, creates CRM deal stage, issues calendar invite.',
      service: 'Automated Webhooks',
      actions: ['Verify Company Domain', 'Create Deal in CRM', 'Generate Custom Proposal']
    },
    result: {
      label: 'High-Priority Alert & Follow-Up',
      subtext: 'Executive alerted via Slack with prepared brief and draft response awaiting one-click approval.',
      metric: 'Zero Manual Data Entry',
      outcome: 'Meeting Booked in < 5 mins'
    }
  },
  {
    id: 'content-pipeline',
    name: 'Design Token & Asset Pipeline',
    description: 'Auto-sync design changes from Figma variables into clean TypeScript tokens and production CSS.',
    trigger: {
      label: 'Figma Library Version Publish',
      subtext: 'Designer updates primary color tokens and component radii in Figma.',
      icon: 'Layers',
      tag: 'Figma Webhook'
    },
    aiProcessing: {
      label: 'Contrast & Code Validation',
      subtext: 'Checks all color combinations against WCAG AAA standard and detects breaking semantic changes.',
      model: 'Rule Engine + LLM Validator',
      accuracy: 'Passes 100% WCAG AA'
    },
    automation: {
      label: 'GitHub PR & Branch Deployment',
      subtext: 'Generates Tailwind theme extension, runs test suites, and opens pull request with visual changelog.',
      service: 'GitHub Actions CI/CD',
      actions: ['Parse Token JSON', 'Compile Tailwind Preset', 'Open Pull Request']
    },
    result: {
      label: 'Production-Ready Synchronized Code',
      subtext: 'Design tokens live in preview environment in under 45 seconds without engineer intervention.',
      metric: '45s End-to-End',
      outcome: 'Design-Code Parity'
    }
  }
];

export function AutomationShowcase() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [simulatingStep, setSimulatingStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const currentScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setSimulatingStep(1);

    setTimeout(() => setSimulatingStep(2), 1000);
    setTimeout(() => setSimulatingStep(3), 2200);
    setTimeout(() => setSimulatingStep(4), 3400);
    setTimeout(() => setIsRunning(false), 4200);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setSimulatingStep(0);
  };

  return (
    <section id="automation" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto relative">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill mb-4">
          <Cpu className="w-3.5 h-3.5 text-neutral-300" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-300">
            Intelligent Systems
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          How AI Automation Actually Works.
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          No vague buzzwords or exaggerated hype. Real workflow automation connects event triggers, intelligent AI context processing, and programmatic APIs to eliminate operational drag.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveScenarioId(s.id);
              resetSimulation();
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
              activeScenarioId === s.id
                ? 'bg-white text-black shadow-md'
                : 'glass-surface text-neutral-400 hover:text-white'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Interactive Simulation Dashboard Canvas */}
      <div className="glass-surface rounded-3xl p-6 sm:p-8 md:p-10 border border-white/10 relative overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.08]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{currentScenario.name}</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              {currentScenario.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isRunning
                  ? 'bg-emerald-500/20 text-emerald-300 cursor-not-allowed border border-emerald-500/30'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isRunning ? 'Processing Flow...' : 'Simulate Workflow'}</span>
            </button>

            {simulatingStep > 0 && (
              <button
                onClick={resetSimulation}
                className="p-2 rounded-full glass-pill text-neutral-400 hover:text-white"
                title="Reset simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4-Step Visual Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* STEP 1: TRIGGER */}
          <div
            className={`rounded-2xl p-5 transition-all duration-500 border ${
              simulatingStep === 1 || simulatingStep === 0
                ? 'bg-white/[0.04] border-white/20 shadow-lg'
                : 'bg-white/[0.01] border-white/[0.06] opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                01 Trigger
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {currentScenario.trigger.tag}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">
              {currentScenario.trigger.label}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {currentScenario.trigger.subtext}
            </p>
          </div>

          {/* STEP 2: AI PROCESSING */}
          <div
            className={`rounded-2xl p-5 transition-all duration-500 border ${
              simulatingStep === 2
                ? 'bg-purple-500/[0.08] border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.15)] ring-1 ring-purple-400/30'
                : simulatingStep > 2 || simulatingStep === 0
                ? 'bg-white/[0.04] border-white/20'
                : 'bg-white/[0.01] border-white/[0.06] opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300">
                02 AI Processing
              </span>
              <Bot className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">
              {currentScenario.aiProcessing.label}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              {currentScenario.aiProcessing.subtext}
            </p>
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-purple-300">
              <span>{currentScenario.aiProcessing.model}</span>
            </div>
          </div>

          {/* STEP 3: AUTOMATION */}
          <div
            className={`rounded-2xl p-5 transition-all duration-500 border ${
              simulatingStep === 3
                ? 'bg-blue-500/[0.08] border-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.15)] ring-1 ring-blue-400/30'
                : simulatingStep > 3 || simulatingStep === 0
                ? 'bg-white/[0.04] border-white/20'
                : 'bg-white/[0.01] border-white/[0.06] opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-300">
                03 Automation
              </span>
              <Zap className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">
              {currentScenario.automation.label}
            </h4>
            <div className="space-y-1 mb-3">
              {currentScenario.automation.actions.map((act, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                  <CheckCircle2 className="w-3 h-3 text-blue-400" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono text-neutral-400">
              {currentScenario.automation.service}
            </div>
          </div>

          {/* STEP 4: RESULT */}
          <div
            className={`rounded-2xl p-5 transition-all duration-500 border ${
              simulatingStep === 4
                ? 'bg-emerald-500/[0.08] border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/30'
                : simulatingStep === 0
                ? 'bg-white/[0.04] border-white/20'
                : 'bg-white/[0.01] border-white/[0.06] opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300">
                04 Outcome
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">
              {currentScenario.result.label}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              {currentScenario.result.subtext}
            </p>
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono font-semibold text-emerald-400">
              <span>{currentScenario.result.metric}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
