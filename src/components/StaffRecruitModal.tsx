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
  HeartHandshake,
  Info
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
        setAssignedId(editStaff.id || '');
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
        setSalary('');
        setPhone('');
        setEmail('');
        setDob('');
        setGender('Male');
        setTelephone('');
        setNid('');
        setPresentAddress('');
        setPermanentAddress('');
        setEmergencyName('');
        setEmergencyPhone('');
        setEmergencyRelation('');
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

    // Clean values (no forced requirements!)
    const cleanId = assignedId.trim() || (isEditMode && editStaff ? editStaff.id : generateNextStaffId());
    const uName = uniqueName.trim();

    // Validate Unique Name ONLY if user provided one
    if (uName) {
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
    }

    if (isEditMode && editStaff) {
      // Edit existing staff: update any provided information seamlessly without blocking on blank fields
      updateAdminProfile(editStaff.id, {
        name: name.trim() || editStaff.name,
        username: uName || editStaff.username || '',
        role: role || editStaff.role || 'Moderator',
        salary: salary.trim() !== '' ? salary.trim() : (editStaff.salary ? String(editStaff.salary) : ''),
        phone: phone.trim() !== '' ? phone.trim() : (editStaff.phone || ''),
        email: email.trim() !== '' ? email.trim() : (editStaff.email || ''),
        dob: dob.trim() !== '' ? dob.trim() : (editStaff.dob || ''),
        gender: gender || editStaff.gender || 'Male',
        telephone: telephone.trim() !== '' ? telephone.trim() : (editStaff.telephone || ''),
        nid: nid.trim() !== '' ? nid.trim() : (editStaff.nid || ''),
        presentAddress: presentAddress.trim() !== '' ? presentAddress.trim() : (editStaff.presentAddress || ''),
        permanentAddress: permanentAddress.trim() !== '' ? permanentAddress.trim() : (editStaff.permanentAddress || ''),
        emergencyContact: {
          name: emergencyName.trim() !== '' ? emergencyName.trim() : (editStaff.emergencyContact?.name || ''),
          phone: emergencyPhone.trim() !== '' ? emergencyPhone.trim() : (editStaff.emergencyContact?.phone || ''),
          relation: emergencyRelation.trim() !== '' ? emergencyRelation.trim() : (editStaff.emergencyContact?.relation || '')
        },
        password: password.trim() || editStaff.password || 'staff'
      });
      if (onSuccess) onSuccess(`কর্মী "${name.trim() || editStaff.name}" এর তথ্য সফলভাবে সংরক্ষণ ও হালনাগাদ করা হয়েছে!`);
      onClose();
    } else {
      // Recruit new staff: allow flexible input without blocking
      const finalName = name.trim() || 'নতুন কর্মী';
      const finalUName = uName || `Staff${cleanId}@`;
      const finalPhone = phone.trim() || '০১৭০০-০০০০০০';

      const res = recruitStaff({
        id: cleanId,
        username: finalUName,
        name: finalName,
        role: role || 'Moderator',
        salary: salary.trim() || 'নির্ধারিত নয়',
        phone: finalPhone,
        email: email.trim(),
        dob: dob.trim(),
        gender: gender || 'Male',
        telephone: telephone.trim(),
        nid: nid.trim(),
        presentAddress: presentAddress.trim(),
        permanentAddress: permanentAddress.trim(),
        emergencyContact: {
          name: emergencyName.trim(),
          phone: emergencyPhone.trim(),
          relation: emergencyRelation.trim()
        },
        password: password.trim() || 'staff'
      });
      if (onSuccess) onSuccess(res.message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-hidden animate-in fade-in">
      <div className="bg-white w-full max-w-2xl max-h-[88vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header (Sticky Top) */}
        <div className="bg-[#007460] text-white px-4 sm:px-5 py-3 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-amber-300 font-bold shrink-0">
              {isEditMode ? <Edit3 className="w-4 h-4 text-amber-300" /> : <UserPlus className="w-4 h-4 text-amber-300" />}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-tight">
                {isEditMode ? 'কর্মীর তথ্য পরিবর্তন ও সম্পাদনা' : 'নতুন কর্মী নিয়োগ ফরম (New Staff Recruitment)'}
              </h2>
              <p className="text-[11px] text-emerald-100">
                {isEditMode 
                  ? 'যেকোনো তথ্য প্রয়োজনমতো পরিবর্তন বা সংশোধন করুন' 
                  : 'নিয়োগের পর তথ্যটি মালিকের কাছে অনুমোদনের জন্য যাবে'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container with Flex-1 Scrollable Body and Sticky Bottom Actions */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-3 text-xs text-slate-700">
            
            {/* Helpful Notice */}
            <div className="p-2.5 bg-emerald-50/90 border border-emerald-200 text-emerald-950 rounded-lg text-[11px] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#007460] shrink-0" />
              <span>
                <strong>সহজ সম্পাদনা:</strong> সকল ঘর বাধ্যতামূলক নয়। যেকোনো তথ্য সংশোধন করে নিচে "সংরক্ষণ" বাটনে ক্লিক করুন।
              </span>
            </div>

            {/* Error Alert */}
            {formError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Section 1: ID, Unique Name & Designation */}
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3 space-y-2.5">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-200/80 pb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#007460]" />
                <span>১. অফিশিয়াল আইডি, পদবী ও ইউনিক নেম</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Auto 5-digit ID */}
                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">
                    আইডি নম্বর (৫ সংখ্যার)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={assignedId}
                      onChange={(e) => setAssignedId(e.target.value)}
                      placeholder="00005"
                      maxLength={10}
                      className="w-full pl-2.5 pr-8 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                    />
                    {!isEditMode && (
                      <button
                        type="button"
                        onClick={handleRegenerateId}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#007460] p-1 cursor-pointer"
                        title="অটো আইডি পুনরায় জেনারেট করুন"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Unique Name */}
                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">
                    ইউনিক নেম (Unique Name)
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={uniqueName}
                    onChange={(e) => setUniqueName(e.target.value)}
                    placeholder="StaffName2026@"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>

                {/* Role / Designation */}
                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">
                    পদবী (Designation)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  >
                    <option value="Moderator">Moderator (বিজ্ঞাপন নিরীক্ষক)</option>
                    <option value="Quality Officer">Quality Officer (এসক্রো ও কোয়ালিটি)</option>
                    <option value="Account Manager">Account Manager (হিসাব ব্যবস্থাপক)</option>
                    <option value="Support Executive">Support Executive (গ্রাহক সেবা)</option>
                    <option value="Super Admin">Super Admin (ঊর্ধ্বতন কর্মকর্তা)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Personal Details, Phone, Salary, DOB & NID */}
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3 space-y-2.5">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-200/80 pb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#007460]" />
                <span>২. ব্যক্তিগত তথ্য, বেতন ও পরিচয়পত্র</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">কর্মীর পুরো নাম</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="মো. কায়সার আহমেদ"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712-334455"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">মাসিক বেতন (টাকা)</label>
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="২৫,০০০"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">জন্ম তারিখ</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">টেলিফোন (ল্যান্ডফোন)</label>
                  <input
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="০২-৯৮৭৬৫৪৩"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">জাতীয় পরিচয়পত্র (NID)</label>
                  <input
                    type="text"
                    value={nid}
                    onChange={(e) => setNid(e.target.value)}
                    placeholder="১৯৯৫৯৮৭৬৫৪২১৩"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">অফিশিয়াল ইমেইল</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@bikroymela.com"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">লগইন পাসওয়ার্ড</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="staff"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Addresses */}
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3 space-y-2.5">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-200/80 pb-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#007460]" />
                <span>৩. বর্তমান ও স্থায়ী ঠিকানা</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">বর্তমান ঠিকানা</label>
                  <textarea
                    rows={2}
                    value={presentAddress}
                    onChange={(e) => setPresentAddress(e.target.value)}
                    placeholder="উত্তরা সেক্টর ৪, রোড ৭, ঢাকা"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">স্থায়ী ঠিকানা</label>
                  <textarea
                    rows={2}
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    placeholder="চাটখিল, নোয়াখালী"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Emergency Contact */}
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3 space-y-2.5">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-200/80 pb-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                <span>৪. জরুরী যোগাযোগকৃত ব্যক্তি</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">ব্যক্তির নাম</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="মোবারক হোসেন"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">জরুরী ফোন নম্বর</label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="01811-998877"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-0.5 text-[11px]">সম্পর্ক</label>
                  <input
                    type="text"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    placeholder="পিতা / মাতা / স্ত্রী / ভাই"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#007460]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#007460] hover:bg-[#005e4e] text-white font-bold rounded-lg text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'তথ্য সংরক্ষণ / হালনাগাদ করুন' : 'নিয়োগ সম্পন্ন ও সংরক্ষণ করুন'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
