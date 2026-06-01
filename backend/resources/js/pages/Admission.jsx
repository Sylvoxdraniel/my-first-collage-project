import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, CheckCircle2, CreditCard, ShieldCheck, 
  Sparkles, Calendar, BookOpen, AlertCircle, HelpCircle, RefreshCw,
  Download, Printer, User, Hash, Clock, IndianRupee
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import logoImg from '../assets/logo.png';
import muLogo from '../assets/mu_logo.png';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Admission() {
  const { settings } = useSiteSettings();
  const collegeName = settings?.college_name || 'Gautam Budha Mahila College, Gaya';
  const collegeNameHindi = settings?.college_name_hindi || 'गौतम बुद्ध महिला महाविद्यालय, गयाजी';
  const collegeSubtitle = settings?.college_subtitle || 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001';
  const getBackendUrl = () => {
    if (window.location.port === '5173') {
      return `${window.location.protocol}//${window.location.hostname}:8000`;
    }
    return window.location.origin;
  };

  const backendUrl = getBackendUrl();

  const logoSrc = settings?.logo_path
    ? (settings.logo_path.startsWith('http') ? settings.logo_path : `${backendUrl}/api${settings.logo_path}`)
    : logoImg;

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
  const [selectedCourse, setSelectedCourse] = useState('BA');

  // Payment UI State
  const [paymentStep, setPaymentStep] = useState(1); // 1: Pay prompt, 2: Simulator, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [payAadhaar, setPayAadhaar] = useState('');
  const [payAmount, setPayAmount] = useState(1000);
  const [payStudentName, setPayStudentName] = useState('');
  const [payFatherName, setPayFatherName] = useState('');
  const [payCourse, setPayCourse] = useState('BA');
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [isFetchingStudent, setIsFetchingStudent] = useState(false);
  const [studentFetched, setStudentFetched] = useState(false); // true once DB/URL data loaded
  const [payEmail, setPayEmail] = useState('');
  const [payMobile, setPayMobile] = useState('');

  const [feeStructures, setFeeStructures] = useState([]);
  const [feesLoading, setFeesLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await api.get('/public/fee-structures');
        setFeeStructures(res.data);
      } catch (err) {
        console.error('Failed to load fee structures', err);
      } finally {
        setFeesLoading(false);
      }
    };
    fetchFees();
  }, []);

  // Auto-calculate payAmount whenever payCourse or feeStructures changes
  useEffect(() => {
    if (payCourse && feeStructures.length > 0) {
      const match = feeStructures.find(f => 
        f.course_name.toLowerCase() === payCourse.toLowerCase() ||
        payCourse.toLowerCase().includes(f.course_name.toLowerCase())
      );
      if (match) {
        setPayAmount(match.total_fee);
      } else {
        setPayAmount(1000);
      }
    }
  }, [payCourse, feeStructures]);

  useEffect(() => {
    if (feesLoading) return;
    const predefinedCourses = feeStructures.map(f => f.course_name);
    if (formData.course_selection) {
      if (predefinedCourses.includes(formData.course_selection)) {
        setSelectedCourse(formData.course_selection);
      } else {
        setSelectedCourse('Other');
      }
    } else if (feeStructures.length > 0) {
      setSelectedCourse(feeStructures[0].course_name);
    } else {
      setSelectedCourse('Other');
    }
  }, [formData.course_selection, feeStructures, feesLoading]);

  useEffect(() => {
    const aadhaarParam = searchParams.get('aadhaar');
    if (aadhaarParam) {
      setPayAadhaar(aadhaarParam);
      setPaymentStep(1);
      
      const fetchStudentDetails = async () => {
        setIsFetchingStudent(true);
        try {
          const res = await api.get(`/public/admissions/lookup?aadhaar=${encodeURIComponent(aadhaarParam.trim())}`);
          setPayStudentName(res.data.student_name);
          setPayFatherName(res.data.father_name || '');
          setPayEmail(res.data.email || '');
          setPayMobile(res.data.mobile_number || '');
          setPayCourse(res.data.course_selection || 'BA');
          setStudentFetched(true);
        } catch (err) {
          console.error(err);
          setStudentFetched(false);
        } finally {
          setIsFetchingStudent(false);
        }
      };
      
      fetchStudentDetails();
    } else {
      setPayAadhaar('');
      setPayStudentName('');
      setPayFatherName('');
      setPayEmail('');
      setPayMobile('');
      setStudentFetched(false);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleStep1Next = () => {
    if (!formData.student_name || !formData.father_name || !formData.mother_name || !formData.email || !formData.mobile_number || !formData.dob) {
      toast.error('Please fill out all required fields in Step 1.');
      return;
    }
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!formData.aadhaar_number || !formData.address) {
      toast.error('Please fill out all required fields in Step 2.');
      return;
    }
    setStep(3);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.student_name ||
      !formData.father_name ||
      !formData.mother_name ||
      !formData.email ||
      !formData.mobile_number ||
      !formData.dob ||
      !formData.aadhaar_number ||
      !formData.address
    ) {
      toast.error('Please fill out all required fields.');
      return;
    }

    if (!documentFile) {
      toast.error('Please upload your Aadhaar / Marksheet document.');
      return;
    }

    setIsSubmitting(true);
    const postData = new FormData();
    Object.keys(formData).forEach(key => {
      postData.append(key, formData[key]);
    });
    postData.append('document', documentFile);

    try {
      await api.post('/public/admissions', postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Save student info before resetting form, then redirect to payment
      const aadhaarForPayment = formData.aadhaar_number;
      const nameForPayment = formData.student_name;
      const fatherForPayment = formData.father_name;
      const courseForPayment = formData.course_selection;
      resetForm();
      toast.success('✅ Application submitted! Please complete the fee payment to finalise your admission.');
      // Redirect immediately to payment tab with aadhaar pre-filled
      setSearchParams({ tab: 'payment', aadhaar: aadhaarForPayment });
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Error submitting application form.';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate transaction ID
  const generateTxnId = () => {
    return 'GBMC-TXN-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
  };

  // Dynamically load Razorpay SDK script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Initiate Razorpay Checkout Payment Flow
  const handleRazorpayPayment = async () => {
    setPaymentLoading(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
      setPaymentLoading(false);
      return;
    }

    const txnId = generateTxnId();

    try {
      const orderRes = await api.post('/public/payments/razorpay/create-order', {
        amount: payAmount,
        receipt: txnId
      });

      const { order_id, key_id, currency, amount } = orderRes.data;

      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: collegeName,
        description: `Admission Fee - ${payCourse}`,
        image: logoSrc,
        order_id: order_id,
        handler: async function (response) {
          const verifyToast = toast.loading('Verifying payment signature...');
          try {
            const verifyRes = await api.post('/public/payments/razorpay/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.verified) {
              const now = new Date();
              const receipt = {
                txnId: response.razorpay_payment_id,
                studentName: payStudentName.trim() || 'N/A',
                fatherName: payFatherName.trim() || 'N/A',
                aadhaar: payAadhaar.trim() || 'N/A',
                amount: payAmount,
                paymentBy: 'Razorpay Online Gateway',
                date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
                time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
                college: collegeName,
                course: payCourse,
              };
              setPaymentReceipt(receipt);
              setPaymentStep(3);
              toast.success('✅ Payment Verified Successfully!', { id: verifyToast });
            } else {
              toast.error('Payment verification failed. Signature is invalid.', { id: verifyToast });
            }
          } catch (err) {
            console.error(err);
            toast.error('Error verifying payment with server.', { id: verifyToast });
          }
        },
        prefill: {
          name: payStudentName,
          email: payEmail,
          contact: payMobile
        },
        theme: {
          color: '#1e3a8a'
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment cancelled by user.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Failed to initialize payment with Razorpay.';
      toast.error(errMsg);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (settings?.razorpay_enabled === '1') {
      await handleRazorpayPayment();
    } else {
      setPaymentStep(2);
    }
  };

  // Simulate Payment & capture receipt
  const triggerSimulatePayment = () => {
    setPaymentLoading(true);
    setTimeout(() => {
      const now = new Date();
      const receipt = {
        txnId: generateTxnId(),
        studentName: payStudentName.trim() || 'N/A',
        fatherName: payFatherName.trim() || 'N/A',
        aadhaar: payAadhaar.trim() || 'N/A',
        amount: payAmount,
        paymentBy: paymentMethod === 'card' ? 'Credit / Debit Card' : 'UPI / QR Scan',
        date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
        college: collegeName,
        course: payCourse,
      };
      setPaymentReceipt(receipt);
      setPaymentLoading(false);
      setPaymentStep(3);
      toast.success('✅ Payment Verified Successfully!');
    }, 2000);
  };

  // Download receipt via browser print
  const handleDownloadReceipt = () => {
    if (!paymentReceipt) return;
    const logoUrl = logoSrc.startsWith('data:') ? logoSrc : (logoSrc.startsWith('http') ? logoSrc : window.location.origin + logoSrc);
    const receiptHtml = `
      <!DOCTYPE html>
      <html lang="hi">
      <head>
        <meta charset="UTF-8" />
        <title>Fee Payment Receipt - ${collegeName}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, 'Noto Sans Devanagari', sans-serif; background: #fff; color: #1e293b; padding: 36px; }

          /* ── College Header ── */
          .college-header {
            display: flex;
            align-items: center;
            gap: 18px;
            padding-bottom: 16px;
            border-bottom: 3px double #1e3a8a;
            margin-bottom: 8px;
          }
          .college-header img {
            width: 80px;
            height: 80px;
            object-fit: contain;
            border-radius: 50%;
            border: 2px solid #e2e8f0;
          }
          .college-header .info { flex: 1; }
          .college-header .hindi {
            font-size: 18px;
            font-weight: 900;
            color: #dc2626;
            letter-spacing: 0.3px;
            line-height: 1.3;
          }
          .college-header .english {
            font-size: 20px;
            font-weight: 900;
            color: #1e3a8a;
            line-height: 1.3;
            margin-top: 2px;
          }
          .college-header .address {
            font-size: 11px;
            color: #64748b;
            margin-top: 4px;
          }

          /* ── Receipt Badge ── */
          .receipt-label {
            text-align: center;
            margin: 14px 0 10px;
          }
          .receipt-label h2 {
            font-size: 15px;
            font-weight: 900;
            color: #1e3a8a;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .receipt-label .badge {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            padding: 3px 12px;
            margin-top: 5px;
          }

          /* ── Amount Box ── */
          .amount-box {
            background: #eff6ff;
            border: 2px solid #1e3a8a;
            border-radius: 8px;
            padding: 14px;
            text-align: center;
            margin: 14px 0;
          }
          .amount-box .amt { font-size: 30px; font-weight: 900; color: #1e3a8a; }
          .amount-box .amt-label { font-size: 11px; color: #64748b; margin-top: 3px; }

          /* ── Data Table ── */
          .section-title {
            font-size: 11px;
            font-weight: bold;
            color: #1e3a8a;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            border-left: 4px solid #1e3a8a;
            padding-left: 8px;
            margin: 16px 0 8px;
          }
          table { width: 100%; border-collapse: collapse; }
          tr { border-bottom: 1px dashed #e2e8f0; }
          td { padding: 8px 4px; font-size: 13px; }
          td.label { color: #64748b; font-weight: 600; width: 46%; }
          td.value { color: #0f172a; font-weight: 800; }

          /* ── Footer ── */
          .footer {
            text-align: center;
            margin-top: 28px;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 14px;
          }
          .txn {
            font-family: monospace;
            font-size: 11px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 5px 12px;
            display: inline-block;
            margin-top: 6px;
            color: #475569;
          }

          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>

        <!-- College Header (matches website) -->
        <div class="college-header">
          <img src="${logoUrl}" alt="College Logo" />
          <div class="info">
            <div class="hindi">${collegeNameHindi}</div>
            <div class="english">${collegeName}</div>
            <div class="address">&#9432; ${collegeSubtitle}</div>
          </div>
        </div>

        <!-- Receipt Title -->
        <div class="receipt-label">
          <h2>Fee Payment Receipt</h2>
          <span class="badge">&#10003; PAYMENT SUCCESSFUL</span>
        </div>

        <!-- Amount -->
        <div class="amount-box">
          <div class="amt">&#8377; ${paymentReceipt.amount.toLocaleString('en-IN')}</div>
          <div class="amt-label">Total Amount Paid</div>
        </div>

        <!-- Student Info -->
        <div class="section-title">Student Information</div>
        <table>
          <tr><td class="label">Student Name</td><td class="value">${paymentReceipt.studentName}</td></tr>
          <tr><td class="label">Father's Name</td><td class="value">${paymentReceipt.fatherName}</td></tr>
          <tr><td class="label">Aadhaar / Enrollment No.</td><td class="value">${paymentReceipt.aadhaar}</td></tr>
        </table>

        <!-- Payment Details -->
        <div class="section-title">Payment Details</div>
        <table>
          <tr><td class="label">Payment Date</td><td class="value">${paymentReceipt.date}</td></tr>
          <tr><td class="label">Payment Time</td><td class="value">${paymentReceipt.time}</td></tr>
          <tr><td class="label">Payment Method</td><td class="value">${paymentReceipt.paymentBy}</td></tr>
          <tr><td class="label">Transaction ID</td><td class="value" style="font-family:monospace;font-size:12px">${paymentReceipt.txnId}</td></tr>
        </table>

        <!-- Footer -->
        <div class="footer">
          <p>This is a computer-generated receipt and does not require a physical signature.</p>
          <div class="txn">TXN ID: ${paymentReceipt.txnId}</div>
          <p style="margin-top:10px">&copy; ${new Date().getFullYear()} ${collegeName} &mdash; All rights reserved.</p>
        </div>

      </body>
      </html>
    `;
    const win = window.open('', '_blank', 'width=720,height=960');
    win.document.write(receiptHtml);
    win.document.close();
    win.focus();
    
    // Trigger print when the window and its assets (images) are fully loaded
    win.onload = function() {
      win.print();
    };
    
    // Fallback timer in case onload doesn't fire
    setTimeout(() => {
      try {
        win.print();
      } catch (err) {
        console.error("Print dialog failed to open automatically", err);
      }
    }, 1500);
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
        <div className="lg:col-span-1 bg-white border border-slate-200 p-2 sm:p-4 rounded-2xl shadow-sm h-fit flex flex-row lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-x-visible scrollbar-none whitespace-nowrap lg:whitespace-normal">
          {[
            { id: 'process', label: 'Admission Process' },
            { id: 'apply', label: 'Apply Online Form' },
            { id: 'payment', label: 'Fee Payment UI' },
            { id: 'docs', label: 'Required Documents' },
            { id: 'fees', label: 'Fee Structure' },
            { id: 'eligibility', label: 'Eligibility Criteria' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 lg:w-full text-center lg:text-left ${
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
        <div className="lg:col-span-3 bg-white border border-slate-200 p-4 sm:p-6 md:p-8 rounded-3xl shadow-sm min-h-[550px]">
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
                            type="button" onClick={handleStep1Next}
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
                          <select 
                            value={selectedCourse} 
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedCourse(val);
                              if (val !== 'Other') {
                                setFormData({ ...formData, course_selection: val });
                              } else {
                                setFormData({ ...formData, course_selection: '' });
                              }
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:outline-none text-slate-700">
                            {feeStructures.map(f => (
                              <option key={f.id || f.course_name} value={f.course_name}>{f.course_name}</option>
                            ))}
                            <option value="Other">Other</option>
                          </select>
                          {selectedCourse === 'Other' && (
                            <div className="space-y-1 mt-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase block">Specify Course Name *</label>
                              <input 
                                type="text" 
                                required 
                                name="course_selection" 
                                value={formData.course_selection} 
                                onChange={handleInputChange}
                                placeholder="Enter custom course name"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700" 
                              />
                            </div>
                          )}
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
                            type="button" onClick={handleStep2Next}
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

                    {/* Step 4 is no longer shown — successful submission auto-redirects to ?tab=payment */}
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
                        {feesLoading ? (
                          <tr><td colSpan="4" className="p-4 text-center text-slate-400">Loading fee records...</td></tr>
                        ) : feeStructures.length === 0 ? (
                          [
                            { course_name: 'BA', tuition_fee: 12000, lab_charges: 0, total_fee: 12000 },
                            { course_name: 'BSc Mathematics', tuition_fee: 16500, lab_charges: 2000, total_fee: 18500 },
                            { course_name: 'BSc Biology', tuition_fee: 16500, lab_charges: 3500, total_fee: 20000 },
                            { course_name: 'BCA', tuition_fee: 22000, lab_charges: 4000, total_fee: 26000 },
                            { course_name: 'BA BEd Integrated', tuition_fee: 25000, lab_charges: 2000, total_fee: 27000 },
                            { course_name: 'BSc BEd Integrated', tuition_fee: 28000, lab_charges: 4000, total_fee: 32000 },
                            { course_name: 'MSc Botany', tuition_fee: 28000, lab_charges: 6000, total_fee: 34000 },
                            { course_name: 'MSc Chemistry', tuition_fee: 28000, lab_charges: 6000, total_fee: 34000 },
                            { course_name: 'MSc Mathematics', tuition_fee: 28000, lab_charges: 0, total_fee: 28000 },
                            { course_name: 'MSc Zoology', tuition_fee: 28000, lab_charges: 6000, total_fee: 34000 }
                          ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-slate-800">{row.course_name}</td>
                              <td className="p-3">₹ {row.tuition_fee.toLocaleString('en-IN')}</td>
                              <td className="p-3">{row.lab_charges > 0 ? `₹ ${row.lab_charges.toLocaleString('en-IN')}` : 'N/A'}</td>
                              <td className="p-3 text-blue-900 font-bold">₹ {row.total_fee.toLocaleString('en-IN')}</td>
                            </tr>
                          ))
                        ) : (
                          feeStructures.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-slate-800">{row.course_name}</td>
                              <td className="p-3">₹ {Number(row.tuition_fee || 0).toLocaleString('en-IN')}</td>
                              <td className="p-3">{Number(row.lab_charges || 0) > 0 ? `₹ ${Number(row.lab_charges).toLocaleString('en-IN')}` : 'N/A'}</td>
                              <td className="p-3 text-blue-900 font-bold">₹ {Number(row.total_fee || 0).toLocaleString('en-IN')}</td>
                            </tr>
                          ))
                        )}
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
                      <p className="text-xs text-slate-500">Enter your Aadhaar / Enrollment number to fetch your details and proceed to pay.</p>

                      <div className="space-y-3">
                        {/* Aadhaar field + Fetch button */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Aadhaar / Enrollment No. *</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={payAadhaar}
                              onChange={(e) => { setPayAadhaar(e.target.value); setStudentFetched(false); setPayStudentName(''); }}
                              placeholder="Enter Aadhaar number"
                              className="flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700"
                            />
                            <button
                              type="button"
                              disabled={isFetchingStudent || !payAadhaar.trim()}
                              onClick={async () => {
                                 if (!payAadhaar.trim()) { toast.error('Please enter Aadhaar number.'); return; }
                                 setIsFetchingStudent(true);
                                 try {
                                   const res = await api.get(`/public/admissions/lookup?aadhaar=${encodeURIComponent(payAadhaar.trim())}`);
                                   setPayStudentName(res.data.student_name);
                                   setPayFatherName(res.data.father_name || '');
                                   setPayEmail(res.data.email || '');
                                   setPayMobile(res.data.mobile_number || '');
                                   setStudentFetched(true);
                                   toast.success(`Student found: ${res.data.student_name}`);
                                   
                                   // Auto-fill course selection which triggers amount calculation
                                   const course = res.data.course_selection;
                                   if (course) {
                                     setPayCourse(course);
                                   }
                                 } catch (err) {
                                   const msg = err.response?.data?.error || 'Student not found. Please submit the admission form first.';
                                   toast.error(msg);
                                   setStudentFetched(false);
                                 } finally {
                                   setIsFetchingStudent(false);
                                 }
                               }}
                              className="bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-[10px] px-3 py-1.5 rounded whitespace-nowrap flex items-center gap-1"
                            >
                              {isFetchingStudent ? <><RefreshCw size={11} className="animate-spin" /> Fetching...</> : 'Fetch Details'}
                            </button>
                          </div>
                        </div>

                        {/* Student name — read-only, auto-filled from DB */}
                        {studentFetched && (
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">
                              Student Name <span className="text-emerald-600 ml-1">✓ Verified from records</span>
                            </label>
                            <input
                              type="text"
                              value={payStudentName}
                              readOnly
                              placeholder="Fetched automatically from your application"
                              className="w-full border rounded px-3 py-1.5 text-xs bg-emerald-50 border-emerald-300 text-emerald-800 font-bold cursor-not-allowed"
                            />
                          </div>
                        )}

                        {/* Amount */}
                        {studentFetched && (
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">
                              Amount (INR) <span className="text-slate-400 font-normal">(Auto-updated by course fee structure)</span>
                            </label>
                            <input
                              type="number"
                              value={payAmount}
                              readOnly
                              className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-500 font-bold cursor-not-allowed"
                            />
                          </div>
                        )}
                      </div>

                      {!studentFetched && (
                        <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                          ⚠️ Please enter your Aadhaar number and click <strong>Fetch Details</strong> to verify your identity before payment.
                        </p>
                      )}

                      <button
                        disabled={!studentFetched || paymentLoading}
                        onClick={handleProceedToPayment}
                        className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs py-2.5 rounded shadow flex items-center justify-center gap-2"
                      >
                        {paymentLoading ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" /> Processing...
                          </>
                        ) : settings?.razorpay_enabled === '1' ? (
                          'Pay Online (Razorpay)'
                        ) : (
                          'Proceed to Payment Gate'
                        )}
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

                  {paymentStep === 3 && paymentReceipt && (
                    <div className="border border-emerald-200 rounded-2xl bg-white shadow-lg max-w-lg overflow-hidden">
                      {/* Receipt Header */}
                      <div className="bg-blue-900 text-white px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <img src={logoSrc} alt="College Logo" className="w-12 h-12 object-contain rounded-full bg-white/20 p-1" />
                          <div className="text-left">
                            <h3 className="font-black text-base leading-tight">{paymentReceipt.college}</h3>
                            <p className="text-blue-200 text-[10px]">Fee Payment Receipt</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mt-2">
                          <CheckCircle2 size={16} className="text-emerald-300" />
                          <span className="text-emerald-300 font-bold text-sm">Payment Successful!</span>
                        </div>
                      </div>

                      {/* Receipt Body */}
                      <div className="p-6 space-y-4">
                        {/* Amount box */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Total Amount Paid</p>
                          <p className="text-3xl font-black text-emerald-700">₹ {paymentReceipt.amount.toLocaleString('en-IN')}</p>
                        </div>

                        {/* Details grid */}
                        <div className="space-y-0 border border-slate-100 rounded-xl overflow-hidden text-xs">
                          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100">
                            <User size={13} className="text-blue-900 shrink-0" />
                            <span className="text-slate-500 font-semibold w-36">Student Name</span>
                            <span className="font-bold text-slate-800">{paymentReceipt.studentName}</span>
                          </div>
                          <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100">
                            <User size={13} className="text-blue-900 shrink-0" />
                            <span className="text-slate-500 font-semibold w-36">Father's Name</span>
                            <span className="font-bold text-slate-800">{paymentReceipt.fatherName}</span>
                          </div>
                          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100">
                            <Hash size={13} className="text-blue-900 shrink-0" />
                            <span className="text-slate-500 font-semibold w-36">Aadhaar / Enrollment</span>
                            <span className="font-bold text-slate-800 font-mono">{paymentReceipt.aadhaar}</span>
                          </div>
                          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100">
                            <Calendar size={13} className="text-blue-900 shrink-0" />
                            <span className="text-slate-500 font-semibold w-36">Payment Date</span>
                            <span className="font-bold text-slate-800">{paymentReceipt.date}</span>
                          </div>
                          <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100">
                            <Clock size={13} className="text-blue-900 shrink-0" />
                            <span className="text-slate-500 font-semibold w-36">Payment Time</span>
                            <span className="font-bold text-slate-800">{paymentReceipt.time}</span>
                          </div>
                          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100">
                            <CreditCard size={13} className="text-blue-900 shrink-0" />
                            <span className="text-slate-500 font-semibold w-36">Payment By</span>
                            <span className="font-bold text-slate-800">{paymentReceipt.paymentBy}</span>
                          </div>
                          <div className="flex items-center gap-3 px-4 py-3 bg-white">
                            <FileText size={13} className="text-blue-900 shrink-0" />
                            <span className="text-slate-500 font-semibold w-36">Transaction ID</span>
                            <span className="font-bold text-slate-800 font-mono text-[10px]">{paymentReceipt.txnId}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={handleDownloadReceipt}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-lg shadow"
                          >
                            <Download size={14} /> Download Receipt
                          </button>
                          <button
                            onClick={() => { setPaymentStep(1); setPaymentReceipt(null); setPayStudentName(''); setPayFatherName(''); setPayAadhaar(''); setStudentFetched(false); }}
                            className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs py-2.5 rounded-lg"
                          >
                            Make Another Payment
                          </button>
                        </div>
                      </div>
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
