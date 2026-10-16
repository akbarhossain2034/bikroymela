import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdminUser } from '../types';
import { 
  X, 
  UserPlus, 
  Edit3, 
  ShieldCheck, 
  RefreshCw, 
  Phone, 
  MapPin, 
  DollarSign, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  Lock,
  HeartHandshake
} from 'lucide-react';

interface StaffRecruitModalProps {
  isOpen: boolean;
  onClose: () => void;
  editStaff?: AdminUser | null;
  onSuccess?: (msg: string) => void;
}

export const StaffRecruitModal: React.FC<StaffRecruitModalProps> = ({
  isOpen,
  onClose,
  editStaff,
  onSuccess
}) => {
  const { recruitStaff, updateAdminProfile, generateNextStaffId } = useApp();

  const isEditMode = !!editStaff;

  // Form states
  const [assignedId, setAssignedId] = useState('');
  const [uniqueName, setUniqueName] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Moderator');
  const [salary, setSalary] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [telephone, setTelephone] = useState('');
  const [nid, setNid] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [password, setPassword] = useState('staff');

  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form when modal opens or editStaff changes
  useEffect(() => {
    if (isOpen) {
      setFormError(null);
      if (editStaff) {
        setAssignedId(editStaff.id);
        setUniqueName(editStaff.username || '');
        setName(editStaff.name || '');
        setRole(editStaff.role || 'Moderator');
        setSalary(editStaff.salary ? String(editStaff.salary) : '');
        setPhone(editStaff.phone || '');
        setEmail(editStaff.email || '');
        setDob(editStaff.dob || '');
        setGender(editStaff.gender || 'Male');
        setTelephone(editStaff.telephone || '');
        setNid(editStaff.nid || '');
        setPresentAddress(editStaff.presentAddress || '');
        setPermanentAddress(editStaff.permanentAddress || '');
        setEmergencyName(editStaff.emergencyContact?.name || '');
        setEmergencyPhone(editStaff.emergencyContact?.phone || '');
        setEmergencyRelation(editStaff.emergencyContact?.relation || '');
        setPassword(editStaff.password || 'staff');
      } else {
        // Auto-generate 5-digit ID (e.g. 00002, 00003, 00005, 12345)
        const nextId = generateNextStaffId();
        setAssignedId(nextId);
        setUniqueName('');
        setName('');
        setRole('Moderator');
        setSalary('২৫,০০০');
        setPhone('');
        setEmail('');
        setDob('১৯৯৮-০১-০১');
        setGender('Male');
        setTelephone('');
        setNid('');
        setPresentAddress('');
        setPermanentAddress('');
        setEmergencyName('');
        setEmergencyPhone('');
        setEmergencyRelation('পিতা');
        setPassword('staff');
      }
    }
  }, [isOpen, editStaff]);

  if (!isOpen) return null;

  const handleRegenerateId = () => {
    const nextId = generateNextStaffId();
    setAssignedId(nextId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Validate ID
    const cleanId = assignedId.trim();
    if (!cleanId) {
      setFormError('অনুগ্রহ করে ৫ সংখ্যার কর্মী আইডি দিন (যেমন: 00005, 12345)।');
      return;
    }

    // 2. Validate Unique Name
    const uName = uniqueName.trim();
    if (!uName) {
      setFormError('অনুগ্রহ করে কর্মীর ইউনিক নেম দিন (যেমন: Kaysar2026! বা Arifhossain388@)।');
      return;
    }
    if (uName.length > 20) {
      setFormError('ইউনিক নেম সর্বোচ্চ ২০ অক্ষরের হতে হবে।');
      return;
    }
    const disallowedRegex = /[.,<>?/:;'"[\]{}ৎঃ\-_=+() ]/;
    if (disallowedRegex.test(uName)) {
      setFormError('ইউনিক নামে স্পেস বা .,<>?/:;\'"[]{}ৎঃ-_=+() চিহ্ন ব্যবহার করা যাবে না।');
      return;
    }
    const validCharsetRegex = /^[A-Za-z0-9!@#$^&*]+$/;
    if (!validCharsetRegex.test(uName)) {
      setFormError('ইউনিক নামে শুধুমাত্র বড়/ছোট হাতের অক্ষর, সংখ্যা এবং !@#$^&* চিহ্ন ব্যবহার করুন।');
      return;
    }

    // 3. Validate Basic Info
    if (!name.trim()) {
      setFormError('অনুগ্রহ করে কর্মীর পূর্ণ নাম দিন।');
      return;
    }
    if (!phone.trim()) {
      setFormError('অনুগ্রহ করে কর্মীর ফোন নম্বর দিন।');
      return;
    }
    if (!salary.trim()) {
      setFormError('অনুগ্রহ করে কর্মীর বেতন নির্ধারণ করুন।');
      return;
    }
    if (!nid.trim()) {
      setFormError('অনুগ্রহ করে কর্মীর জাতীয় পরিচয়পত্র (NID) নম্বর দিন।');
      return;
    }
    if (!presentAddress.trim()) {
      setFormError('অনুগ্রহ করে কর্মীর বর্তমান ঠিকানা দিন।');
      return;
    }
    if (!permanentAddress.trim()) {
      setFormError('অনুগ্রহ করে কর্মীর স্থায়ী ঠিকানা দিন।');
      return;
    }
    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      setFormError('অনুগ্রহ করে জরুরী যোগাযোগকৃত ব্যক্তির নাম ও ফোন নম্বর দিন।');
      return;
    }

    if (isEditMode && editStaff) {
      // Edit existing staff
      updateAdminProfile(editStaff.id, {
        name: name.trim(),
        username: uName,
        role,
        salary: salary.trim(),
        phone: phone.trim(),
        email: email.trim() || `${phone.replace(/[^0-9]/g, '')}@staff.bikroymela.com`,
        dob: dob.trim(),
        gender,
        telephone: telephone.trim(),
        nid: nid.trim(),
        presentAddress: presentAddress.trim(),
        permanentAddress: permanentAddress.trim(),
        emergencyContact: {
          name: emergencyName.trim(),
          phone: emergencyPhone.trim(),
          relation: emergencyRelation.trim() || 'অভিভাবক'
        },
        password: password.trim() || editStaff.password || 'staff'
      });
      if (onSuccess) onSuccess(`কর্মী "${name}" এর তথ্য সফলভাবে পরিবর্তন ও সংরক্ষণ করা হয়েছে!`);
      onClose();
    } else {
      // Recruit new staff (Pending Owner Approval)
      const res = recruitStaff({
        id: cleanId,
        username: uName,
        name: name.trim(),
        role,
        salary: salary.trim(),
        phone: phone.trim(),
        email: email.trim(),
        dob: dob.trim(),
        gender,
        telephone: telephone.trim(),
        nid: nid.trim(),
        presentAddress: presentAddress.trim(),
        permanentAddress: permanentAddress.trim(),
        emergencyContact: {
          name: emergencyName.trim(),
          phone: emergencyPhone.trim(),
          relation: emergencyRelation.trim() || 'অভিভাবক'
        },
        password: password.trim() || 'staff'
      });
      if (onSuccess) onSuccess(res.message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-[#007460] text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-300 font-bold">
              {isEditMode ? <Edit3 className="w-5 h-5 text-amber-300" /> : <UserPlus className="w-5 h-5 text-amber-300" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {isEditMode ? 'কর্মীর তথ্য পরিবর্তন ও সম্পাদনা' : 'নতুন কর্মী নিয়োগ ফরম (New Staff Recruitment)'}
              </h2>
              <p className="text-xs text-emerald-100">
                {isEditMode 
                  ? 'এডমিন কর্তৃক কর্মীর প্রোফাইল ও অফিশিয়াল তথ্য পরিবর্তন' 
                  : 'নিয়োগের পর মালিকের কাছে অনুমোদন চেকবক্স যাবে, মালিক অনুমোদন দিলে কর্মী লগইন করতে পারবে'}
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

        {/* Error Alert */}
        {formError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-xs text-slate-700">
          
          {/* Section 1: ID, Unique Name & Designation */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-[#007460]" />
              <span>১. অফিশিয়াল আইডি, পদবী ও ইউনিক নেম (সিস্টেম অটো-জেনারেটেড)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Auto 5-digit ID */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  আইডি নম্বর (৫ সংখ্যার) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={assignedId}
                    onChange={(e) => setAssignedId(e.target.value)}
                    placeholder="00005"
                    maxLength={10}
                    className="w-full pl-3 pr-9 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:border-[#007460]"
                    required
                  />
                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={handleRegenerateId}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#007460] p-1 cursor-pointer"
                      title="অটো আইডি পুনরায় জেনারেট করুন"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">যেমন: 00002, 00003, 12345</span>
              </div>

              {/* Unique Name (Requirement A) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  ইউনিক নেম (Unique Name) *
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={uniqueName}
                  onChange={(e) => setUniqueName(e.target.value)}
                  placeholder="Kaysar2026!"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:border-[#007460]"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">সর্বোচ্চ ২০ অক্ষর (A-Z, a-z, 0-9 এবং !@#$^&*)</span>
              </div>

              {/* Role / Designation */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  পদবী (Designation) *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#007460]"
                >
                  <option value="Moderator">Moderator (বিজ্ঞাপন নিরীক্ষক)</option>
                  <option value="Quality Officer">Quality Officer (এসক্রো ও কোয়ালিটি)</option>
                  <option value="Account Manager">Account Manager (হিসাব ব্যবস্থাপক)</option>
                  <option value="Support Executive">Support Executive (গ্রাহক সেবা)</option>
                  <option value="Super Admin">Super Admin (ঊর্ধ্বতন কর্মকর্তা)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-0.5 block">কর্মীর দায়িত্ব ও অনুমতি স্তর</span>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Details, Phone, Salary, DOB & NID */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Calendar className="w-4 h-4 text-[#007460]" />
              <span>২. নতুন কর্মীর ব্যক্তিগত তথ্য, বেতন ও জাতীয় পরিচয়পত্র</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">কর্মীর পুরো নাম *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="মো. কায়সার আহমেদ"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#007460]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">মোবাইল ফোন নম্বর *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01712-334455"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:border-[#007460]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">মাসিক বেতন (টাকা) *</label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="২৫,০০০"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-900 focus:outline-none focus:border-[#007460]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-slate-700 font-bold mb-1">জন্ম তারিখ (DOB) *</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#007460]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">টেলিফোন (ল্যান্ডফোন / অপশনাল)</label>
                <input
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="০২-৯৮৭৬৫৪৩"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:border-[#007460]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">জাতীয় পরিচয়পত্র (NID) নম্বর *</label>
                <input
                  type="text"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  placeholder="১৯৯৫৯৮৭৬৫৪২১৩"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:border-[#007460]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-700 font-bold mb-1">অফিশিয়াল ইমেইল (ঐচ্ছিক)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kaysar@staff.bikroymela.com"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#007460]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">লগইন পাসওয়ার্ড (ডিফল্ট) *</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="staff"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:border-[#007460]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Addresses */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <MapPin className="w-4 h-4 text-[#007460]" />
              <span>৩. বর্তমান ও স্থায়ী ঠিকানা</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">বর্তমান ঠিকানা (Present Address) *</label>
                <textarea
                  rows={2}
                  value={presentAddress}
                  onChange={(e) => setPresentAddress(e.target.value)}
                  placeholder="উত্তরা সেক্টর ৪, রোড ৭, বাসা ১২, ঢাকা"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#007460]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">স্থায়ী ঠিকানা (Permanent Address) *</label>
                <textarea
                  rows={2}
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  placeholder="গ্রাম: চাটখিল, ডাকঘর: রামনারায়ণপুর, নোয়াখালী"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#007460]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Emergency Contact */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              <span>৪. জরুরী যোগাযোগকৃত ব্যক্তি (Emergency Contact Details)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">ব্যক্তির নাম *</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="মোবারক হোসেন"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#007460]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">জরুরী ফোন নম্বর *</label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="01811-998877"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:border-[#007460]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ব্যক্তির সাথে সম্পর্ক *</label>
                <input
                  type="text"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  placeholder="পিতা / মাতা / স্ত্রী / ভাই"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#007460]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Notice about owner approval */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>নিয়োগ পরবর্তী অনুমোদন প্রক্রিয়া:</strong> নিয়োগ দেওয়ার সাথে সাথেই এটি মালিকের প্যানেলে 
              <strong> 'মালিকের অনুমোদন চেকবক্স (Approval)'</strong> হিসেবে প্রেরিত হবে। 
              মালিক উক্ত নামের উপর ক্লিক করে সকল তথ্য যাচাই-বাছাই করে অনুমোদন দেওয়ার পরেই কেবল কর্মী তার আইডিতে লগইন করতে পারবেন।
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#007460] hover:bg-[#005e4e] text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isEditMode ? 'তথ্য হালনাগাদ ও সংরক্ষণ করুন' : 'নিয়োগ সম্পন্ন করুন ও মালিকের অনুমোদনে পাঠান'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
