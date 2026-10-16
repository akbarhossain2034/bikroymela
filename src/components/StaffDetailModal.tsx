import React from 'react';
import { AdminUser } from '../types';
import { 
  X, 
  ShieldCheck, 
  User, 
  Phone, 
  MapPin, 
  DollarSign, 
  Calendar, 
  HeartHandshake, 
  FileText, 
  Lock, 
  CheckCircle, 
  XCircle,
  Crown,
  Edit3
} from 'lucide-react';

interface StaffDetailModalProps {
  staff: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleApproval?: (staffId: string, currentApproved: boolean) => void;
  onEditStaff?: (staff: AdminUser) => void;
}

export const StaffDetailModal: React.FC<StaffDetailModalProps> = ({
  staff,
  isOpen,
  onClose,
  onToggleApproval,
  onEditStaff
}) => {
  if (!isOpen || !staff) return null;

  const isApproved = staff.isApprovedByOwner ?? true;
  const isOwner = staff.isOwner || staff.role === 'Super Admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#007460] to-[#005e4e] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/20 text-white font-black text-xl flex items-center justify-center border border-white/20 shadow-md">
              {staff.name ? staff.name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">{staff.name}</h2>
                {isOwner && (
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Crown className="w-3 h-3" />
                    <span>মালিক (Owner)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100 mt-0.5 font-medium">
                আইডি: <strong className="font-mono text-amber-300">{staff.id}</strong> | ইউনিক নেম: <span className="font-mono text-emerald-200">{staff.username || 'N/A'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          
          {/* Owner Approval Status & Checkbox Bar */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
            isApproved 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <div className="flex items-center gap-2.5">
              {isApproved ? (
                <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-700 shrink-0" />
              )}
              <div>
                <span className="font-bold text-sm block">
                  {isApproved ? 'নিয়োগ অনুমোদিত (Active & Approved)' : 'মালিকের অনুমোদন অপেক্ষমাণ (Pending Approval)'}
                </span>
                <span className="text-[11px] opacity-85 block">
                  {isApproved 
                    ? 'এই কর্মী তার আইডি, ইউনিক নেম ও পাসওয়ার্ড দিয়ে সিস্টেমে লগইন করতে পারবেন।' 
                    : 'মালিক অনুমোদন দেওয়ার আগ পর্যন্ত এই কর্মী আইডিতে প্রবেশ করতে পারবেন না।'}
                </span>
              </div>
            </div>

            {/* Interactive Approval Checkbox */}
            {onToggleApproval && !isOwner && (
              <label className="inline-flex items-center gap-2.5 px-3 py-2 bg-white rounded-lg border border-slate-300 shadow-2xs cursor-pointer select-none self-start sm:self-auto hover:border-[#007460] transition-colors">
                <input
                  type="checkbox"
                  checked={isApproved}
                  onChange={() => onToggleApproval(staff.id, isApproved)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span className={`text-xs font-bold ${isApproved ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {isApproved ? 'অনুমোদন নিশ্চিত করা হয়েছে' : 'অনুমোদন প্রদান করুন (Approve)'}
                </span>
              </label>
            )}
          </div>

          {/* Section: Official & Appointment Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-[#007460]" />
              <span>অফিশিয়াল নিয়োগ ও পদবী বিবরণ</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">অফিশিয়াল আইডি:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{staff.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">ইউনিক নেম:</span>
                <span className="font-mono font-bold text-emerald-800">{staff.username || 'সেট করা নেই'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">পদবী (Role):</span>
                <span className="font-bold text-slate-900 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] inline-block">
                  {staff.role}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">মাসিক বেতন:</span>
                <span className="font-bold text-emerald-700 text-sm font-mono">৳ {staff.salary || 'নির্ধারিত নয়'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200/60">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">ডিপার্টমেন্ট / কাজের ক্ষেত্র:</span>
                <span className="font-semibold text-slate-800">{staff.department || 'এডমিন স্টাফ ও কাস্টমার সাপোর্ট'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">নিয়োগের তারিখ:</span>
                <span className="font-semibold text-slate-800">{staff.registeredAt || '০১ অক্টোবর ২০২৬'}</span>
              </div>
            </div>
          </div>

          {/* Section: Personal Information & Contact */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <User className="w-4 h-4 text-[#007460]" />
              <span>ব্যক্তিগত তথ্য ও যোগাযোগ</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">মোবাইল নম্বর:</span>
                <span className="font-mono font-bold text-slate-900">{staff.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">টেলিফোন (ল্যান্ডফোন):</span>
                <span className="font-mono text-slate-800">{staff.telephone || 'উপলব্ধ নয়'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">ইমেইল ایڈ্রেস:</span>
                <span className="text-slate-800 font-mono text-[11px] break-all">{staff.email || 'উপলব্ধ নয়'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-200/60">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">জাতীয় পরিচয়পত্র (NID):</span>
                <span className="font-mono font-bold text-slate-900">{staff.nid || 'নির্ধারিত নয়'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">জন্ম তারিখ (DOB):</span>
                <span className="text-slate-800 font-semibold">{staff.dob || 'নির্ধারিত নয়'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">লিঙ্গ:</span>
                <span className="text-slate-800 font-semibold">{staff.gender || 'Male'}</span>
              </div>
            </div>
          </div>

          {/* Section: Addresses */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <MapPin className="w-4 h-4 text-[#007460]" />
              <span>বর্তমান ও স্থায়ী ঠিকানা</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold uppercase mb-1">বর্তমান ঠিকানা:</span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {staff.presentAddress || 'উপলব্ধ নয়'}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold uppercase mb-1">স্থায়ী ঠিকানা:</span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {staff.permanentAddress || 'উপলব্ধ নয়'}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Emergency Contact */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              <span>জরুরী যোগাযোগকৃত ব্যক্তির বিবরণ (Emergency Contact)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">নাম:</span>
                <span className="font-bold text-slate-900">{staff.emergencyContact?.name || 'নির্ধারিত নয়'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">ফোন নম্বর:</span>
                <span className="font-mono font-bold text-slate-900">{staff.emergencyContact?.phone || 'নির্ধারিত নয়'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">সম্পর্ক:</span>
                <span className="font-semibold text-slate-800 bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 inline-block text-[11px]">
                  {staff.emergencyContact?.relation || 'অভিভাবক'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {onEditStaff && !isOwner && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditStaff(staff);
              }}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>তথ্য সম্পাদনা / পরিবর্তন করুন</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#007460] hover:bg-[#005e4e] text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer ml-auto"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
