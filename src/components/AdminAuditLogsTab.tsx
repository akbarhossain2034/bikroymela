import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileCheck, 
  Search, 
  Filter, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  ShieldCheck, 
  Layers, 
  Download,
  AlertCircle
} from 'lucide-react';

export const AdminAuditLogsTab: React.FC = () => {
  const { lang, adModerationLogs, adminList } = useApp();

  const [selectedAdminFilter, setSelectedAdminFilter] = useState<string>('all');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = adModerationLogs.filter((log) => {
    // Admin filter
    if (selectedAdminFilter !== 'all' && log.adminId !== selectedAdminFilter) return false;

    // Action filter
    if (selectedActionFilter !== 'all' && log.action !== selectedActionFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = log.adTitle.toLowerCase().includes(q);
      const matchId = log.adId.toLowerCase().includes(q);
      const matchAdmin = log.adminName.toLowerCase().includes(q) || log.adminId.toLowerCase().includes(q);
      const matchNote = (log.note || '').toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchAdmin && !matchNote) return false;
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5 text-xs">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#007460]" />
            <span>এডমিন অডিট ও অ্যাকশন হিস্ট্রি লগ (Moderation Audit Trail)</span>
          </h3>
          <p className="text-slate-500 text-[11px] mt-0.5">
            কোন কর্মকর্তা কোন বিজ্ঞাপনে কি অনুমোদন বা বাতিল করেছেন, তার এডমিন আইডি নম্বর ও তারিখ সহ স্থায়ী রেকর্ড।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold font-mono text-[11px]">
            মোট রেকর্ড: {filteredLogs.length} টি
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বিজ্ঞাপন নাম, এডমিন আইডি, বা কারণ দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Filter by Admin ID (Requirement 04 & 05) */}
        <div className="flex items-center gap-2 shrink-0">
          <User className="w-4 h-4 text-slate-500" />
          <select
            value={selectedAdminFilter}
            onChange={(e) => setSelectedAdminFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">সকল এডমিন কর্মকর্তা (All Admins)</option>
            {adminList.map((adm) => (
              <option key={adm.id} value={adm.id}>
                {adm.id} — {adm.name} ({adm.role})
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Action */}
        <div className="shrink-0">
          <select
            value={selectedActionFilter}
            onChange={(e) => setSelectedActionFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">সকল অ্যাকশন (All Actions)</option>
            <option value="Approved">অনুমোদিত (Approved)</option>
            <option value="Rejected">বাতিল (Rejected)</option>
            <option value="Verified">যাচাইকৃত (Verified)</option>
            <option value="Processed">প্রক্রিয়াধীন (Processed)</option>
            <option value="Deleted">মুছে ফেলা (Deleted)</option>
          </select>
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-3">সময় ও তারিখ</th>
              <th className="p-3">এডমিন আইডি ও কর্মকর্তা</th>
              <th className="p-3">বিজ্ঞাপন তথ্য</th>
              <th className="p-3 text-center">সম্পাদিত অ্যাকশন</th>
              <th className="p-3">স্ট্যাটাস পরিবর্তন</th>
              <th className="p-3">অফিসিয়াল মন্তব্য / বাতিলের কারণ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  কোনো অডিট রেকর্ড পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const isApproved = log.action === 'Approved';
                const isRejected = log.action === 'Rejected' || log.action === 'Deleted';

                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Timestamp */}
                    <td className="p-3 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>

                    {/* Admin ID & Name (Requirements 04 & 05) */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-900 text-amber-300 font-mono font-bold rounded text-[11px] shadow-2xs">
                          {log.adminId}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block">{log.adminName}</span>
                          <span className="text-[10px] text-slate-400">{log.adminRole || 'অফিসার'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Ad Info */}
                    <td className="p-3">
                      <span className="font-bold text-slate-900 line-clamp-1 block">{log.adTitle}</span>
                      <span className="text-[10px] font-mono text-slate-500">ID: #{log.adId}</span>
                    </td>

                    {/* Action */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        isApproved ? 'bg-emerald-100 text-emerald-800' :
                        isRejected ? 'bg-rose-100 text-rose-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {isApproved && <CheckCircle className="w-3 h-3 text-emerald-700" />}
                        {isRejected && <XCircle className="w-3 h-3 text-rose-700" />}
                        <span>{log.action}</span>
                      </span>
                    </td>

                    {/* Status Change */}
                    <td className="p-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      <span>{log.previousStatus || 'Initial'}</span>
                      <span className="mx-1.5 text-slate-400">➔</span>
                      <strong className="text-slate-900">{log.newStatus}</strong>
                    </td>

                    {/* Notes / Reason */}
                    <td className="p-3 text-slate-700 max-w-xs">
                      <p className="line-clamp-2 leading-relaxed text-[11px]">
                        {log.note || 'স্ট্যান্ডার্ড ভেলিডেশন সম্পন্ন হয়েছে।'}
                      </p>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
