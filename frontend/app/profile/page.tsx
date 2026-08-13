import Link from "next/link";

export default function Profile() {
  return (
    <div className="min-h-screen bg-ivory-bg text-on-surface font-body-md flex items-center justify-center">
      <div className="bg-white p-12 rounded-3xl shadow-soft text-center max-w-md w-full mx-4">
        <div className="w-24 h-24 rounded-full bg-deep-olive flex items-center justify-center mx-auto mb-6 shadow-float">
          <span className="material-symbols-outlined text-4xl text-white">person</span>
        </div>
        <h2 className="font-headline-sm font-bold text-primary mb-2">Anonymous Profile</h2>
        <p className="text-muted-sage mb-8">Your identity is ephemeral and secure.</p>
        <Link href="/" className="bg-surface-variant text-on-surface-variant px-6 py-3 rounded-full font-label-md hover:bg-soft-clay transition-colors inline-flex items-center space-x-2">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
