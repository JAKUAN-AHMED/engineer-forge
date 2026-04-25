import { notFound } from 'next/navigation';
import { API_BASE } from '@/lib/api';

interface CertDto {
  verificationId: string;
  userName: string;
  courseTitle: string;
  skills: string[];
  issuedAt: string;
}

async function fetchCert(id: string): Promise<CertDto | null> {
  try {
    const res = await fetch(`${API_BASE}/api/certificates/verify/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = (await res.json()) as { certificate: CertDto };
    return json.certificate;
  } catch {
    return null;
  }
}

export default async function VerifyPage({ params }: { params: { id: string } }) {
  const cert = await fetchCert(params.id);
  if (!cert) notFound();

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="rounded-2xl border-2 border-brand-500/60 bg-gradient-to-br from-ink-900 to-ink-950 p-10 shadow-xl">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-brand-400 mb-4">Engineer Forge · Certificate</div>
          <div className="text-sm text-ink-400 mb-8">This certifies that</div>
          <h1 className="text-4xl font-bold text-white">{cert.userName}</h1>
          <div className="text-sm text-ink-400 mt-6 mb-1">has successfully completed</div>
          <h2 className="text-xl text-brand-300 font-semibold">{cert.courseTitle}</h2>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {cert.skills.map((s) => (
              <span key={s} className="text-xs px-3 py-1 rounded-full border border-ink-700 text-ink-200">{s}</span>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-ink-800 text-xs text-ink-500 grid grid-cols-2 gap-4">
            <div>
              <div className="uppercase tracking-wide">Issued</div>
              <div className="text-ink-300 mt-1">{new Date(cert.issuedAt).toLocaleDateString()}</div>
            </div>
            <div className="text-right">
              <div className="uppercase tracking-wide">Verification ID</div>
              <div className="text-ink-300 mt-1 font-mono">{cert.verificationId}</div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-ink-500 text-center mt-4">
        Verify at {typeof window !== 'undefined' ? window.location.origin : ''}/verify/{cert.verificationId}
      </p>
    </div>
  );
}
