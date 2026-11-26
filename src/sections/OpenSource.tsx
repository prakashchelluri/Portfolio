import { ArrowUpRight, Github } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

const GH = 'https://github.com/prakashchelluri';

const REPOS = [
  { name: 'webex-triage-bot', what: 'Matches issues to team rules, proposes fixes, learns from feedback.', tags: 'Python · Webex · AIOps' },
  { name: 'slo-burn-rate-alerts', what: 'Prometheus multi-window burn-rate alerts and error budgets from an SLO spec.', tags: 'Prometheus · SLOs' },
  { name: 'k8s-health-report', what: 'Read-only cluster report: probes, limits, PDBs, crash loops, node pressure.', tags: 'Kubernetes · OpenShift' },
  { name: 'etcd-disk-check', what: 'Is this disk fast enough for etcd? fio and metrics, PASS/WARN/FAIL.', tags: 'etcd · Storage' },
  { name: 'zram-container-logs', what: 'Container logs on a compressed RAM disk to cut node disk I/O.', tags: 'Linux · systemd · Ansible' },
  { name: 'artifact-replication-check', what: 'Verify registry replication and DNS before a cut-over.', tags: 'Registry · DNS' },
  { name: 'gitlab-ci-k8s-templates', what: 'Kaniko build, gitleaks and Trivy scans, gated deploy with auto-rollback.', tags: 'GitLab CI · DevSecOps' },
  { name: 'incident-postmortem-kit', what: 'Blameless postmortem template with render and lint CLI.', tags: 'Incident management' },
  { name: 'ansible-k8s-node-baseline', what: 'Kubernetes-ready Linux node baseline and hardening.', tags: 'Ansible · Linux' },
  { name: 'terraform-azure-aks-lab', what: 'A small, observable AKS cluster as Terraform.', tags: 'Terraform · Azure' },
];

const OpenSource = () => (
  <div className="mt-14">
    <Reveal>
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Open-source labs</h3>
        <a href={GH} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-xs text-terminal-muted hover:text-neon-green">
          <Github className="w-4 h-4" /> github.com/prakashchelluri
        </a>
      </div>
      <p className="mb-5 text-terminal-muted max-w-2xl">
        Clean-room versions of patterns I use at work, each with tests and CI. No employer code or data.
      </p>
    </Reveal>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {REPOS.map((r, i) => (
        <Reveal key={r.name} delay={i % 3}>
          <a href={`${GH}/${r.name}`} target="_blank" rel="noopener noreferrer"
            className="group block h-full rounded-xl border border-dashboard-border bg-dashboard-panel p-4 hover:border-neon-green/60 transition-colors">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-mono text-sm text-terminal-text group-hover:text-neon-green truncate">{r.name}</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 text-terminal-muted group-hover:text-neon-green" />
            </div>
            <p className="text-sm text-terminal-muted leading-snug">{r.what}</p>
            <p className="mt-2 font-mono text-[11px] text-terminal-muted/70">{r.tags}</p>
          </a>
        </Reveal>
      ))}
    </div>
  </div>
);

export default OpenSource;
