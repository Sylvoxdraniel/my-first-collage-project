import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, CheckCircle2, CreditCard, ShieldCheck, 
  Sparkles, Calendar, BookOpen, AlertCircle, HelpCircle, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Admission() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'process';

  // Apply Form State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    student_name: '',
    father_name: '',
    mother_name: '',
    email: '',
    mobile_number: '',
    gender: 'Male',
    dob: '',
    address: '',
    course_selection: 'BA',
    category: 'General',
    aadhaar_number: '',
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment UI State
  const [paymentStep, setPaymentStep] = useState(1); // 1: Pay prompt, 2: Simulator, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_name || !formData.email || !formData.mobile_number || !formData.aadhaar_number) {
      toast.error('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    const postData = new FormData();
    Object.keys(formData).forEach(key => {
      postData.append(key, formData[key]);
    });
    if (documentFile) {
      postData.append('document', documentFile);
    }

    try {
      const res = await axios.post('/api/public/admissions', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      toast.success(res.data.message || 'Application submitted successfully!');
      setStep(4); // Success step
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error submitting application form.';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate Payment
  const triggerSimulatePayment = () => {
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      setPaymentStep(3);
      toast.success('Simulation: Payment Verified Successfully!');
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      student_name: '',
      father_name: '',
      mother_name: '',
      email: '',
      mobile_number: '',
      gender: 'Male',
      dob: '',
      address: '',
      course_selection: 'BA',
      category: 'General',
      aadhaar_number: '',
    });
    setDocumentFile(null);
    setStep(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center space-y-3 mb-10">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-widest rounded">
          Admission Desk
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight">
          Admissions & Enrollments
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Start your academic journey at Gautam Budha Mahila College. Submit application forms and view syllabus structure online.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm h-fit space-y-1">
          {[
            { id: 'process', label: 'Admission Process' },
            { id: 'apply', label: 'Apply Online Form' },
            { id: 'fees', label: 'Fee Structure' },
            { id: 'docs', label: 'Required Documents' },
            { id: 'eligibility', label: 'Eligibility Criteria' },
            { id: 'payment', label: 'Fee Payment UI' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="lg:col-span-3 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm min-h-[550px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* ADMISSION PROCESS */}
              {activeTab === 'process' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-black text-slate-900">Admission Process</h2>
                  <p className="text-sm text-slate-600">
                    Applying to Gautam Budha Mahila College is simple. Review our 4-step workflow:
                  </p>
                  
                  {/* Workflow Stepper */}
                  <div className="relative border-l-2 border-blue-100 pl-6 space-y-8">
                    {[
                      { step: '1', title: 'Fill Registration Form', desc: 'Enter student and educational details in our online admission form, selecting your preferred course.' },
                      { step: '2', title: 'Upload Required Documents', desc: 'Upload scanned copies of Aadhaar, marksheets, and category certificates.' },
                      { step: '3', title: 'Submit Form & Pay Admission Fee', desc: 'Verify form contents and complete payment using our secure simulated gateway UI.' },
                      { step: '4', title: 'Admissions Approval', desc: 'Admins will evaluate your documents. Once approved, you will receive an enrollment confirmation email.' }
                    ].map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute top-0 -left-10 w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow">
                          {item.step}
                        </div>
                        <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* APPLY ONLINE MULTI-STEP FORM */}
              {activeTab === 'apply' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Online Admission Form</h2>
                  
                  {/* Stepper indicators */}
                  <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    {['Personal Details', 'Education & Course', 'Upload & Confirm', 'Success'].map((label, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          step > idx + 1 ? 'bg-emerald-500 text-white' : step === idx + 1 ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`text-[10px] font-bold hidden md:inline ${step === idx + 1 ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-6 pt-4">
                    {step === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Student Name *</label>
                          <input 
                            type="text" required name="student_name" value={formData.student_name} onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Father Name *</label>
                          <input 
                            type="text" required name="father_name" value={formData.father_name} onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Mother Name *</label>
                          <input 
                            type="text" required name="mother_name" value={formData.mother_name} onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address *</label>
                          <input 
                            type="email" required name="email" value={formData.email} onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Mobile Number *</label>
                          <input 
                            type="text" required name="mobile_number" value={formData.mobile_number} onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Gender</label>
                          <select name="gender" value={formData.gender} onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:outline-none text-slate-700">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Date of Birth *</label>
                          <input 
                            type="date" required name="dob" value={formData.dob} onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:outline-none text-slate-700" 
                          />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                          <button 
                            type="button" onClick={() => setStep(2)}
                            className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-6 py-2 rounded shadow"
                          >
                            Next Step
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Aadhaar Number *</label>
                          <input 
                            type="text" required name="aadhaar_number" value={formData.aadhaar_number} onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Course Selection *</label>
                          <select name="course_selection" value={formData.course_selection} onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:outline-none text-slate-700">
                            <option>BA</option>
                            <option>BSc Mathematics</option>
                            <option>BSc Biology</option>
                            <option>BCA</option>
                            <option>BA BEd Integrated</option>
                            <option>BSc BEd Integrated</option>
                            <option>MSc Botany</option>
                            <option>MSc Chemistry</option>
                            <option>MSc Mathematics</option>
                            <option>MSc Zoology</option>
                            <option>PhD Botany</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                          <select name="category" value={formData.category} onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:outline-none text-slate-700">
                            <option>General</option>
                            <option>OBC</option>
                            <option>SC</option>
                            <option>ST</option>
                            <option>EWS</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Address *</label>
                          <textarea 
                            required name="address" value={formData.address} onChange={handleInputChange} rows={3}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700"
                          />
                        </div>
                        <div className="md:col-span-2 flex justify-between">
                          <button 
                            type="button" onClick={() => setStep(1)}
                            className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-6 py-2 rounded text-xs"
                          >
                            Back
                          </button>
                          <button 
                            type="button" onClick={() => setStep(3)}
                            className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-6 py-2 rounded shadow"
                          >
                            Next Step
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <div className="border border-dashed border-slate-300 rounded-xl p-8 bg-slate-50 text-center space-y-3">
                          <Upload className="mx-auto text-slate-400" size={32} />
                          <h4 className="font-bold text-sm text-slate-700">Upload Aadhaar / Marksheet *</h4>
                          <p className="text-[10px] text-slate-400">PDF, JPG, JPEG or PNG format. Maximum file size: 5MB.</p>
                          <input 
                            type="file" onChange={handleFileChange} required
                            className="mx-auto text-xs block file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100" 
                          />
                          {documentFile && (
                            <p className="text-xs text-emerald-600 font-bold">Selected: {documentFile.name}</p>
                          )}
                        </div>

                        <div className="border border-blue-100 bg-blue-50/50 p-4 rounded-xl space-y-2 text-xs text-slate-600">
                          <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                            <AlertCircle size={14} /> Confirmation Summary
                          </h4>
                          <p>**Student**: {formData.student_name} ({formData.gender})</p>
                          <p>**Applied Program**: {formData.course_selection}</p>
                          <p>**Aadhaar Number**: {formData.aadhaar_number}</p>
                        </div>

                        <div className="flex justify-between">
                          <button 
                            type="button" onClick={() => setStep(2)}
                            className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-6 py-2 rounded text-xs"
                          >
                            Back
                          </button>
                          <button 
                            type="submit" disabled={isSubmitting}
                            className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-6 py-2 rounded shadow disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isSubmitting ? 'Uploading...' : 'Submit Application Form'}
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="text-center p-8 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                          <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Application Submitted!</h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                          Thank you! Your online admission form has been received and saved. Our administrative team will evaluate your credentials shortly. You can track this status using your email.
                        </p>
                        <button 
                          type="button" onClick={resetForm}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-2 rounded"
                        >
                          Submit Another Application
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* FEE STRUCTURE */}
              {activeTab === 'fees' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Fee Structure 2026-27</h2>
                  <p className="text-sm text-slate-600">
                    Annual college tuition and laboratory support fees. Scholarships are available for SC/ST/OBC and merit toppers.
                  </p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs font-semibold">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                        <tr>
                          <th className="p-3">Course / Stream</th>
                          <th className="p-3">Yearly Tuition Fee</th>
                          <th className="p-3">Lab Charges</th>
                          <th className="p-3">Total Fee</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {[
                          { course: 'Bachelor of Arts (BA)', tuition: '₹ 12,000', lab: 'N/A', total: '₹ 12,000' },
                          { course: 'BSc Mathematics', tuition: '₹ 16,500', lab: '₹ 2,000', total: '₹ 18,500' },
                          { course: 'BSc Biology', tuition: '₹ 16,500', lab: '₹ 3,500', total: '₹ 20,000' },
                          { course: 'BCA (Computer App)', tuition: '₹ 22,000', lab: '₹ 4,000', total: '₹ 26,000' },
                          { course: 'MSc Botany / Zoology / Chemistry', tuition: '₹ 28,000', lab: '₹ 6,000', total: '₹ 34,000' },
                          { course: 'PhD programs', tuition: '₹ 45,000', lab: '₹ 10,000', total: '₹ 55,000' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-800">{row.course}</td>
                            <td className="p-3">{row.tuition}</td>
                            <td className="p-3">{row.lab}</td>
                            <td className="p-3 text-blue-900 font-bold">{row.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* REQUIRED DOCUMENTS */}
              {activeTab === 'docs' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Required Documents Section</h2>
                  <p className="text-sm text-slate-600">
                    Ensure you have digital scans of these files before applying:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                    {[
                      'Class 10th Marksheet (for age proof)',
                      'Class 12th Marksheet (qualifying exam)',
                      'Aadhaar Card (identifying document)',
                      'Passport Size Photograph',
                      'Transfer Certificate (TC)',
                      'Migration Certificate (for outside state)',
                      'Caste Certificate (if claiming reservations)',
                      'Income Certificate (for fee concessions)'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-3.5 rounded-lg font-bold">
                        <CheckCircle2 className="text-blue-900 shrink-0" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ELIGIBILITY CRITERIA */}
              {activeTab === 'eligibility' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Course Eligibility</h2>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs font-semibold">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                        <tr>
                          <th className="p-3">Program</th>
                          <th className="p-3">Qualifying Exam</th>
                          <th className="p-3">Minimum Marks Required</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {[
                          { program: 'BA', exam: '10+2 (Any Stream)', marks: '45% for general, 40% for reserve' },
                          { program: 'BSc Math', exam: '10+2 (Science Math)', marks: '50% marks in Math' },
                          { program: 'BSc Biology', exam: '10+2 (Science Biology)', marks: '50% marks in Science' },
                          { program: 'BCA', exam: '10+2 (Maths or Computer Science preferred)', marks: '48% aggregate' },
                          { program: 'MSc Programs', exam: 'BSc Graduation in relevant subject', marks: '55% aggregate' },
                          { program: 'PhD Programs', exam: 'Postgraduation / MSc with UGC NET', marks: '55% aggregate marks' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-800">{row.program}</td>
                            <td className="p-3">{row.exam}</td>
                            <td className="p-3 text-slate-500">{row.marks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ONLINE PAYMENT INTEGRATION UI */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Online Fee Payment Desk</h2>
                  
                  {paymentStep === 1 && (
                    <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-4 max-w-md">
                      <h3 className="font-bold text-sm text-slate-800">Quick Academic Fee Pay</h3>
                      <p className="text-xs text-slate-500">Pay your admissions application processing fee or tuition fees online.</p>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Student Enrollment No / Aadhaar</label>
                          <input type="text" placeholder="e.g. GBMC-2026-45" className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Amount (INR)</label>
                          <input type="number" defaultValue={1000} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700" />
                        </div>
                      </div>

                      <button 
                        onClick={() => setPaymentStep(2)}
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs py-2 rounded shadow"
                      >
                        Proceed to Payment Gate
                      </button>
                    </div>
                  )}

                  {paymentStep === 2 && (
                    <div className="border border-blue-200 rounded-2xl p-6 bg-white space-y-6 max-w-md shadow-lg">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-700">Secure Payment Simulation</span>
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                          <ShieldCheck size={12} /> SSL Secured
                        </div>
                      </div>

                      {/* Payment Methods */}
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setPaymentMethod('card')}
                          className={`flex-1 border p-3 rounded-lg flex flex-col items-center gap-1.5 focus:outline-none ${paymentMethod === 'card' ? 'border-blue-900 bg-blue-50/50' : 'border-slate-200'}`}
                        >
                          <CreditCard size={20} className={paymentMethod === 'card' ? 'text-blue-900' : 'text-slate-400'} />
                          <span className="text-[10px] font-bold">Credit/Debit Card</span>
                        </button>
                        <button 
                          onClick={() => setPaymentMethod('upi')}
                          className={`flex-1 border p-3 rounded-lg flex flex-col items-center gap-1.5 focus:outline-none ${paymentMethod === 'upi' ? 'border-blue-900 bg-blue-50/50' : 'border-slate-200'}`}
                        >
                          <RefreshCw size={20} className={paymentMethod === 'upi' ? 'text-blue-900' : 'text-slate-400'} />
                          <span className="text-[10px] font-bold">UPI / QR Scan</span>
                        </button>
                      </div>

                      {paymentMethod === 'card' ? (
                        <div className="space-y-3">
                          <input type="text" placeholder="Cardholder Name" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700" />
                          <input type="text" placeholder="16 Digit Card Number" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700" />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="MM/YY" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700" />
                            <input type="password" placeholder="CVV" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700" />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {/* Simulated QR Code */}
                          <div className="w-32 h-32 bg-slate-300 mx-auto flex items-center justify-center rounded border border-slate-400">
                            <span className="text-[10px] font-bold text-slate-500">QR Code Scanner</span>
                          </div>
                          <p className="text-[10px] text-slate-400">Scan this QR code using any UPI app (GPay/PhonePe) to pay.</p>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <button 
                          onClick={() => setPaymentStep(1)}
                          className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 py-2 rounded text-xs"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={triggerSimulatePayment} disabled={paymentLoading}
                          className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs py-2 rounded shadow disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          {paymentLoading ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" /> Verifying...
                            </>
                          ) : 'Simulate Pay'}
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentStep === 3 && (
                    <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50 text-center space-y-4 max-w-md shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                        <CheckCircle2 size={24} />
                      </div>
                      <h3 className="font-bold text-base text-slate-800">Fee Payment Successful</h3>
                      <p className="text-xs text-slate-500">Transaction ID: GBMC_TXN_56214875. Receipt has been simulated. Check your portal logs for approval updates.</p>
                      <button 
                        onClick={() => {
                          setPaymentStep(1);
                        }}
                        className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded"
                      >
                        Make Another Payment
                      </button>
                    </div>
                  )}

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
