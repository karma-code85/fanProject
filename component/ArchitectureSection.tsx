// component/ArchitectureSection.tsx
import {
  Cpu,
  Wifi,
  Cloud,
  Zap as Lambda,
  Database,
  BrainCircuit,
  LayoutDashboard,
} from "lucide-react";

const STAGES = [
  { label: "Smart Sensors", icon: Cpu },
  { label: "ESP32 Microcontroller", icon: Cpu },
  { label: "Wi-Fi", icon: Wifi },
  { label: "AWS IoT Core", icon: Cloud },
  { label: "AWS Lambda", icon: Lambda },
  { label: "Amazon S3 / RDS", icon: Database },
  { label: "Amazon SageMaker", icon: BrainCircuit },
  { label: "Dashboard & Alerts", icon: LayoutDashboard },
];

export default function ArchitectureSection() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <h3 className="text-sm font-semibold text-white">
        Proposed Future Architecture
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        This dashboard currently runs on simulated data only. The diagram
        below shows the real-world pipeline this prototype is designed to
        plug into once physical sensors and cloud services are connected.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
        {STAGES.map((stage, i) => (
          <div key={stage.label} className="flex items-center gap-2">
            <div className="flex min-w-[132px] flex-col items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-3 text-center">
              <stage.icon className="h-5 w-5 text-emerald-400" />
              <span className="text-[11px] font-medium leading-tight text-slate-300">
                {stage.label}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <span className="text-slate-600">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}