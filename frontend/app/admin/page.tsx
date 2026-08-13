"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Report {
  id: string;
  message_id: string;
  reporter_id: string;
  reason: string;
  created_at: string;
  message_content: string;
  message_author_id: string;
}

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/v1/admin/reports");
        if (res.status === 401) {
          setError("Unauthorized. Please ensure you have an active session.");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setReports(data || []);
        } else {
          setError("Failed to fetch reports.");
        }
      } catch (err) {
        setError("Network error fetching reports.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchReports();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-12 min-h-screen max-w-7xl mx-auto"
    >
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-soft-clay/40 rounded-2xl flex items-center justify-center text-deep-olive">
          <span className="material-symbols-outlined text-[24px]">gavel</span>
        </div>
        <div>
          <h1 className="font-headline-lg text-primary font-bold">Admin Dashboard</h1>
          <p className="font-label-md text-muted-sage">Moderation & Reports Overview</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-muted-sage">
          <span className="material-symbols-outlined animate-spin text-4xl mb-4">sync</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center space-x-3">
          <span className="material-symbols-outlined">error</span>
          <span className="font-label-md">{error}</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-soft p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-soft-clay/30 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-muted-sage">done_all</span>
          </div>
          <h2 className="font-headline-md text-primary mb-2">No Pending Reports</h2>
          <p className="font-body-md text-on-surface-variant/80 max-w-sm">
            All systems normal. There are currently no flagged messages requiring administrative review.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden border border-soft-clay/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory-bg border-b border-soft-clay/50">
                  <th className="p-5 font-label-md text-muted-sage uppercase tracking-wider text-[12px]">Date</th>
                  <th className="p-5 font-label-md text-muted-sage uppercase tracking-wider text-[12px]">Report ID</th>
                  <th className="p-5 font-label-md text-muted-sage uppercase tracking-wider text-[12px]">Flagged Content</th>
                  <th className="p-5 font-label-md text-muted-sage uppercase tracking-wider text-[12px]">Reason</th>
                  <th className="p-5 font-label-md text-muted-sage uppercase tracking-wider text-[12px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-soft-clay/20 hover:bg-ivory-bg/50 transition-colors">
                    <td className="p-5 font-label-sm text-on-surface-variant whitespace-nowrap">
                      {new Date(report.created_at).toLocaleString()}
                    </td>
                    <td className="p-5 font-label-sm text-primary font-mono text-[12px]">
                      {report.id.substring(0, 12)}...
                    </td>
                    <td className="p-5">
                      <div className="font-body-sm text-primary bg-soft-clay/20 p-3 rounded-xl border border-soft-clay/30 max-w-sm">
                        "{report.message_content}"
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="font-label-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                        {report.reason}
                      </span>
                    </td>
                    <td className="p-5">
                      <button className="text-muted-sage hover:text-deep-olive hover:bg-soft-clay/40 p-2 rounded-lg transition-colors flex items-center space-x-2">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                        <span className="font-label-sm">Delete Msg</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
