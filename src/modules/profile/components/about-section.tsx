import { Info, ExternalLink, FileText } from 'lucide-react'

export function AboutSection() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 backdrop-blur-[12px]">
      <h3 className="mb-4 text-sm font-semibold text-primary">About</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-secondary" />
            <span className="text-sm text-primary">App Version</span>
          </div>
          <span className="text-sm text-secondary">2.0.0</span>
        </div>
        <button className="flex w-full items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <ExternalLink className="h-5 w-5 text-secondary" />
            <span className="text-sm text-primary">Support</span>
          </div>
        </button>
        <button className="flex w-full items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-secondary" />
            <span className="text-sm text-primary">Terms of Service</span>
          </div>
        </button>
      </div>
    </div>
  )
}
