import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Clock, Users, ArrowRight, Star, GraduationCap, 
  Search, ShieldCheck, Microscope, Landmark 
} from 'lucide-react';

import api from '../api/axios';

export default function Courses() {
  const [searchParams] = useSearchParams();
  const searchInput = searchParams.get('search') || '';
  const initialType = searchParams.get('type') || 'ug';
  const initialId = searchParams.get('id') || '';

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState(searchInput);
  const [expandedCourse, setExpandedCourse] = useState(initialId);

  const [feeStructures, setFeeStructures] = useState([]);
  const [dbCourses, setDbCourses] = useState([]);
  const [feesLoading, setFeesLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feesRes, coursesRes] = await Promise.all([
          api.get('/public/fee-structures'),
          api.get('/public/courses')
        ]);
        setFeeStructures(feesRes.data);
        setDbCourses(coursesRes.data);
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setFeesLoading(false);
        setCoursesLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCourseFee = (courseName) => {
    const match = feeStructures.find(f => 
      f.course_name.toLowerCase() === courseName.toLowerCase() ||
      courseName.toLowerCase().includes(f.course_name.toLowerCase()) ||
      f.course_name.toLowerCase().includes(courseName.toLowerCase())
    );
    if (match) return match;
    
    const fallbacks = [
      { course_name: 'BA', tuition_fee: 12000, lab_charges: 0, total_fee: 12000 },
      { course_name: 'BSc Mathematics', tuition_fee: 16500, lab_charges: 2000, total_fee: 18500 },
      { course_name: 'BSc Biology', tuition_fee: 16500, lab_charges: 3500, total_fee: 20000 },
      { course_name: 'BCA', tuition_fee: 22000, lab_charges: 4000, total_fee: 26000 },
      { course_name: 'BA BEd Integrated', tuition_fee: 25000, lab_charges: 2000, total_fee: 27000 },
      { course_name: 'BSc BEd Integrated', tuition_fee: 28000, lab_charges: 4000, total_fee: 32000 },
      { course_name: 'MSc Botany', tuition_fee: 28000, lab_charges: 6000, total_fee: 34000 },
      { course_name: 'MSc Chemistry', tuition_fee: 28000, lab_charges: 6000, total_fee: 34000 },
      { course_name: 'MSc Mathematics', tuition_fee: 28000, lab_charges: 0, total_fee: 28000 },
      { course_name: 'MSc Zoology', tuition_fee: 28000, lab_charges: 6000, total_fee: 34000 },
      { course_name: 'PhD in Chemistry', tuition_fee: 35000, lab_charges: 10000, total_fee: 45000 },
      { course_name: 'PhD in Botany', tuition_fee: 35000, lab_charges: 10000, total_fee: 45000 }
    ];
    return fallbacks.find(f => 
      f.course_name.toLowerCase() === courseName.toLowerCase() ||
      courseName.toLowerCase().includes(f.course_name.toLowerCase()) ||
      f.course_name.toLowerCase().includes(courseName.toLowerCase())
    );
  };

  useEffect(() => {
    if (initialId) {
      setExpandedCourse(initialId);
    }
  }, [initialId]);

  const coursesList = {
    ug: [
      {
        id: 'ba',
        name: 'Bachelor of Arts (BA)',
        duration: '3 Years',
        eligibility: '10+2 (Any Stream) with 45% marks',
        intake: '240 Seats',
        opportunities: 'Civil Services, Content Writing, Public Administration, Journalism, Mass Communication.',
        outcomes: 'Develop critical thinking, linguistic capability, and awareness of historical and social dynamics.',
        labs: 'Geography Lab equipped with GIS mapping software.',
        faculty: 'Prof. S. K. Dwivedi, Dr. Anupama Gupta',
        description: 'Comprehensive humanities foundation. Subjects include Hindi Literature, Geography, History, Economics, and Sociology.'
      },
      {
        id: 'bsc-math',
        name: 'BSc Mathematics',
        duration: '3 Years',
        eligibility: '10+2 (Science Maths) with 50% marks',
        intake: '120 Seats',
        opportunities: 'Data Analyst, Statistician, Banking Services, Research Associate, Technical Assistant.',
        outcomes: 'Develop mathematical problem-solving skills, logic modeling, and chemical compound properties validation.',
        labs: 'Advanced Physics and Chemistry experimental work cabinets.',
        faculty: 'Dr. C. P. Mittal, Mrs. Ruchi Saxena',
        description: 'Deep dive into pure and applied mathematics, physics, and inorganic chemistry.'
      },
      {
        id: 'bsc-bio',
        name: 'BSc Biology',
        duration: '3 Years',
        eligibility: '10+2 (Science Biology) with 50% marks',
        intake: '120 Seats',
        opportunities: 'Clinical Laboratories, Forester, Environmentalist, Pharmaceutical Sales, Teaching.',
        outcomes: 'Master taxonomic categorization, botany micro-sections, and zoology dissection simulators.',
        labs: 'Fully equipped Botany, Zoology, and Chemistry labs with microscopes.',
        faculty: 'Dr. Neha Chaturvedi, Dr. Vikas Meena',
        description: 'Broad base in life sciences covering plant physiology, cell biology, biochemistry, and animal diversity.'
      },
      {
        id: 'bca',
        name: 'Bachelor of Computer Applications (BCA)',
        duration: '3 Years',
        eligibility: '10+2 (Maths/Science/Commerce with Maths preferred) with 48% marks',
        intake: '80 Seats',
        opportunities: 'Software Developer, Web Designer, Network Support, Database Administrator.',
        outcomes: 'Learn Python programming, database designs (MySQL), and web development platforms.',
        labs: 'High-speed internet Computer Center with dedicated server desks.',
        faculty: 'Prof. Ramesh K. Verma, Mr. Ashish Sharma',
        description: 'Industry-aligned IT degree covering core coding structures, operating systems, and web architecture.'
      },
      {
        id: 'ba-bed',
        name: 'BA BEd Integrated',
        duration: '4 Years',
        eligibility: '10+2 (Any Stream) with 50% marks (BSTC/PTET clearance)',
        intake: '50 Seats',
        opportunities: 'Secondary School Teacher, Educational Consultant, Administrator, Curriculum Developer.',
        outcomes: 'Integrates degree with teacher training pedagogies approved by NCTE.',
        labs: 'Psychology lab and Educational Technology cabinets.',
        faculty: 'Dr. Sunita Sharma, Mrs. Kiran Rathore',
        description: 'Integrated dual degree saving one year, combining arts literature with teaching education.'
      },
      {
        id: 'bsc-bed',
        name: 'BSc BEd Integrated',
        duration: '4 Years',
        eligibility: '10+2 (Science) with 50% marks (BSTC/PTET clearance)',
        intake: '50 Seats',
        opportunities: 'Secondary Science Teacher, Lab Instructor, Educational Writer.',
        outcomes: 'Strong command over science practical teaching methodologies.',
        labs: 'Full access to core Physics, Chemistry, and Biological laboratories.',
        faculty: 'Dr. Sunita Sharma, Dr. Vikas Meena',
        description: 'Four-year dual degree integrating science curricula with school teaching methodologies.'
      }
    ],
    pg: [
      {
        id: 'msc-botany',
        name: 'MSc Botany',
        duration: '2 Years',
        eligibility: 'BSc Biology with 55% marks',
        intake: '30 Seats',
        opportunities: 'Plant Pathologist, Pharmacognosist, Greenhouse Manager, Research Fellow.',
        outcomes: 'Advanced understanding of taxonomy, plant genetics, pathology, and crop physiology.',
        labs: 'Dedicated Botany PG research lab with specimen archives.',
        faculty: 'Dr. Neha Chaturvedi, Prof. S. L. Maheshwari',
        description: 'Advanced plant science course covering biotechnology, molecular biology, and environmental sciences.'
      },
      {
        id: 'msc-chemistry',
        name: 'MSc Chemistry',
        duration: '2 Years',
        eligibility: 'BSc Chemistry with 55% marks',
        intake: '30 Seats',
        opportunities: 'Analytical Chemist, Quality Control Manager, Chemical Engineer, R&D Labs.',
        outcomes: 'Perform spectral validations, organic synthesis, and analytical lab testing.',
        labs: 'PG Chemistry lab with chromatography and spectrophotometers.',
        faculty: 'Dr. C. P. Mittal, Mrs. Megha Gupta',
        description: 'In-depth study of Organic, Inorganic, and Physical Chemistry with research projects.'
      },
      {
        id: 'msc-math',
        name: 'MSc Mathematics',
        duration: '2 Years',
        eligibility: 'BSc Mathematics with 55% marks',
        intake: '40 Seats',
        opportunities: 'Cryptographer, Operations Research Analyst, Actuarial Analyst, Lecturership.',
        outcomes: 'Expertise in real analysis, complex variables, topology, and numerical modeling.',
        labs: 'Computer lab with MATLAB and LaTeX software.',
        faculty: 'Prof. Ramesh K. Verma, Dr. S. K. Sen',
        description: 'Pure and applied mathematics postgraduate curriculum for advanced analytics.'
      },
      {
        id: 'msc-physics',
        name: 'MSc Physics',
        duration: '2 Years',
        eligibility: 'BSc Physics with 55% marks',
        intake: '30 Seats',
        opportunities: 'Research Assistant, Electronics Lab Engineer, Geophysicist, Physics Educator.',
        outcomes: 'Grasp quantum physics, electrodynamics, solid-state electronics, and nuclear reactions.',
        labs: 'Electronics and optics research laboratory setups.',
        faculty: 'Dr. Rajesh Bhartiya, Mr. Ashish Sharma',
        description: 'Theoretical and experimental physics master program for high-tech applications.'
      },
      {
        id: 'msc-zoology',
        name: 'MSc Zoology',
        duration: '2 Years',
        eligibility: 'BSc Biology with 55% marks',
        intake: '30 Seats',
        opportunities: 'Ecologist, Zoo Curator, Conservationist, Wildlife Biologist.',
        outcomes: 'Advanced cytology, physiology, entomology, and cell immunology expertise.',
        labs: 'Zoology PG lab with specimen museum and digital dissection boards.',
        faculty: 'Dr. Vikas Meena, Dr. Kiran Bhartiya',
        description: 'Advanced postgraduate course in animal behavior, physiology, genetics, and ecology.'
      }
    ],
    phd: [
      {
        id: 'phd-chemistry',
        name: 'PhD in Chemistry',
        duration: '3 - 5 Years',
        eligibility: 'MSc Chemistry with 55% marks + UGC NET / Entrance Clear',
        intake: '6 Seats',
        opportunities: 'Chemical Scientist, Professor, Regulatory Affairs Manager.',
        outcomes: 'Submit original chemical synthesis models and research findings.',
        labs: 'Inorganic & Organic Synthesis PG Research Cabinet.',
        faculty: 'Dr. C. P. Mittal (Research Supervisor)',
        description: 'Doctoral research in chemical structures, environmental toxicology, and catalysis.'
      },
      {
        id: 'phd-botany',
        name: 'PhD in Botany',
        duration: '3 - 5 Years',
        eligibility: 'MSc Botany with 55% marks + UGC NET / Entrance Clear',
        intake: '4 Seats',
        opportunities: 'Plant Scientist, Professor, Conservationist.',
        outcomes: 'Submit original botanical research findings.',
        labs: 'Advanced Botany PG Research Cabinet.',
        faculty: 'Dr. Neha Chaturvedi (Research Supervisor)',
        description: 'Doctoral research in plant pathology and ecology.'
      }
    ]
  };

  const getCourseTab = (course) => {
    if (course.type) {
      return course.type;
    }
    const name = course.name.toLowerCase();
    if (name.includes('phd') || name.includes('ph.d') || name.includes('doctor')) {
      return 'phd';
    }
    if (name.includes('msc') || name.includes('ma') || name.includes('m.sc') || name.includes('master')) {
      return 'pg';
    }
    return 'ug';
  };

  const allStaticCourses = [
    ...(coursesList.ug || []),
    ...(coursesList.pg || []),
    ...(coursesList.phd || [])
  ];

  const getDisplayCourses = () => {
    // Filter database courses for current active tab
    const filteredDb = dbCourses.filter(c => getCourseTab(c) === activeTab);
    
    // Merge database courses with rich static metadata if match exists
    return filteredDb.map(dbc => {
      const match = allStaticCourses.find(sc => 
        sc.name.toLowerCase() === dbc.name.toLowerCase() ||
        dbc.name.toLowerCase().includes(sc.name.toLowerCase()) ||
        sc.name.toLowerCase().includes(dbc.name.toLowerCase())
      );
      
      return {
        id: dbc.id,
        name: dbc.name,
        code: dbc.code,
        description: dbc.description || match?.description || 'No description available.',
        duration: match?.duration || (activeTab === 'phd' ? '3 - 5 Years' : activeTab === 'pg' ? '2 Years' : '3 Years'),
        eligibility: match?.eligibility || (activeTab === 'phd' ? 'Post Graduation with 55% marks' : activeTab === 'pg' ? 'Graduation with 50% marks' : '10+2 with 45% marks'),
        intake: match?.intake || '60 Seats',
        opportunities: match?.opportunities || 'Higher studies, research, private & public sector employment.',
        outcomes: match?.outcomes || 'Gain theoretical knowledge, practical skills, and analytical reasoning.',
        labs: match?.labs || 'Departmental computer and science labs.',
        faculty: dbc.faculty?.user?.name || dbc.faculty?.name || match?.faculty || 'To be assigned',
        credits: dbc.credits,
        semester: dbc.semester
      };
    });
  };

  const getFilteredCourses = () => {
    let list = getDisplayCourses();
    
    if (!searchQuery) return list;
    return list.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Title */}
      <div className="text-center space-y-3 mb-10">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-widest rounded">
          Courses Portal
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight">
          Offered Academic Courses
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Explore course duration, eligibility guidelines, and apply online to secure your admission.
        </p>
      </div>

      {/* Explorer Toggles */}
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8">
        <div className="flex gap-2 bg-slate-200/60 p-1.5 rounded-xl border border-slate-300/40">
          {[
            { id: 'ug', label: 'Undergraduate (UG)' },
            { id: 'pg', label: 'Postgraduate (PG)' },
            { id: 'phd', label: 'Doctoral (PhD)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedCourse('');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full md:w-72 shadow-sm">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full text-slate-700"
          />
        </div>
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getFilteredCourses().map((course) => (
          <div 
            key={course.id} 
            className={`bg-white border rounded-2xl p-6 transition-all duration-300 shadow-sm ${
              expandedCourse === course.id ? 'border-blue-900 ring-1 ring-blue-900/20' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div className="space-y-4">
              <div>
                <span className="text-[10px] bg-blue-50 text-blue-900 font-bold px-2 py-0.5 rounded uppercase">
                  {activeTab === 'ug' ? '3-4 Year Program' : activeTab === 'pg' ? '2 Year Program' : 'Research Program'}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-2">{course.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{course.description}</p>
              </div>

              {/* Core metrics */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{course.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Intake</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{course.intake}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Eligibility</p>
                  <p className="text-[10px] font-bold text-slate-700 mt-0.5 truncate" title={course.eligibility}>
                    {course.eligibility}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button 
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? '' : course.id)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  {expandedCourse === course.id ? 'Hide Details' : 'View Full Details'}
                </button>
                
                <button 
                  onClick={() => navigate('/admission?tab=apply')}
                  className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                >
                  Apply Online <ArrowRight size={14} />
                </button>
              </div>

              {/* Detailed Slide Down */}
              <AnimatePresence>
                {expandedCourse === course.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-slate-100 pt-4 mt-4 space-y-4 text-xs text-slate-600"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 flex items-center gap-1"><GraduationCap size={14} /> Career Opportunities</h4>
                      <p className="mt-1 leading-relaxed">{course.opportunities}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 flex items-center gap-1"><Star size={14} /> Course Outcomes (CO)</h4>
                      <p className="mt-1 leading-relaxed">{course.outcomes}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 flex items-center gap-1"><Microscope size={14} /> Laboratories & Resources</h4>
                      <p className="mt-1 leading-relaxed">{course.labs}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 flex items-center gap-1"><Users size={14} /> Key Faculty</h4>
                      <p className="mt-1 leading-relaxed">{course.faculty}</p>
                    </div>
                    {getCourseFee(course.name) && (
                      <div className="border-t border-dashed border-slate-200 pt-3 mt-3">
                        <h4 className="font-bold text-slate-850 flex items-center gap-1"><Landmark size={14} /> Course Fee Details</h4>
                        <div className="grid grid-cols-3 gap-2 mt-2 text-center bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Tuition Fee</p>
                            <p className="text-xs font-bold text-slate-700 mt-0.5">₹ {Number(getCourseFee(course.name).tuition_fee).toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Lab Charges</p>
                            <p className="text-xs font-bold text-slate-700 mt-0.5">
                              {Number(getCourseFee(course.name).lab_charges) > 0 ? `₹ ${Number(getCourseFee(course.name).lab_charges).toLocaleString('en-IN')}` : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase text-blue-900">Total Year Fee</p>
                            <p className="text-xs font-black text-blue-900 mt-0.5 font-bold">₹ {Number(getCourseFee(course.name).total_fee).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
