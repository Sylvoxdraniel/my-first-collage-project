import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Microscope, Users, Star, Trophy, Beaker, Library, 
  Sparkles, GraduationCap, LayoutGrid 
} from 'lucide-react';
import axios from 'axios';

export default function Departments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [dbDepartments, setDbDepartments] = useState([]);
  const [activeDeptData, setActiveDeptData] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    axios.get('/api/public/departments')
      .then(res => {
        setDbDepartments(res.data || []);
        setLoadingList(false);
      })
      .catch(err => {
        console.error("Error loading departments:", err);
        setLoadingList(false);
      });
  }, []);

  const getActiveDeptId = () => {
    const param = searchParams.get('dept');
    if (!param) {
      return dbDepartments[0]?.id || 'computer';
    }
    if (!isNaN(param)) {
      return param;
    }
    const matched = dbDepartments.find(d => {
      const dbName = d.name.toLowerCase();
      const paramLower = param.toLowerCase();
      return dbName.includes(paramLower) || paramLower.includes(dbName);
    });
    return matched ? matched.id : (dbDepartments[0]?.id || 'computer');
  };

  const activeDeptId = getActiveDeptId();

  useEffect(() => {
    if (loadingList) return;
    if (dbDepartments.length === 0) {
      setActiveDeptData(null);
      return;
    }

    setLoadingDetail(true);
    axios.get(`/api/public/departments/${activeDeptId}`)
      .then(res => {
        setActiveDeptData(res.data);
        setLoadingDetail(false);
      })
      .catch(err => {
        console.error("Error loading department details:", err);
        setLoadingDetail(false);
        const found = dbDepartments.find(d => String(d.id) === String(activeDeptId));
        if (found) {
          setActiveDeptData(found);
        }
      });
  }, [activeDeptId, dbDepartments, loadingList]);

  const departmentsList = {
    arts: {
      name: 'Department of Arts',
      intro: 'The Department of Arts cultivates critical thinking, linguistic capability, and social awareness. Offering subjects like Hindi Literature, Geography, History, and Sociology, the department holds an active academic legacy.',
      faculty: [
        { name: 'Prof. S. K. Dwivedi', role: 'Head of Department', degree: 'PhD in Hindi Literature' },
        { name: 'Dr. Anupama Gupta', role: 'Assistant Professor', degree: 'PhD in Geography' }
      ],
      labs: 'Geography Lab containing detailed topographic sheets, globes, surveying chains, and digital GIS mapping software.',
      outcomes: 'Students gain comprehensive skills in civil administration methodologies, social ethics, and journalism workflows.',
      careers: 'Civil Services, Journalism, Content Development, Academic Lecturership.',
      achievements: 'Highest numbers of university toppers in Geography and History streams.',
      activities: 'NSS Social Awareness Camps, Nukkad Natak, Hindi Divas Debates.'
    },
    computer: {
      name: 'Department of Computer Applications',
      intro: 'Fostering IT leadership, coding techniques, and software architectures. The department hosts modern classrooms, coding labs, and conducts workshops in Python, Database systems, and cloud deployments.',
      faculty: [
        { name: 'Prof. Ramesh K. Verma', role: 'Head of Department', degree: 'MCA, MTech in Computer Science' },
        { name: 'Mr. Ashish Sharma', role: 'Assistant Professor', degree: 'MCA, NET Qualified' }
      ],
      labs: 'High-speed Computer Center with 120+ desktop nodes, equipped with Linux, MySQL databases, and Python packages.',
      outcomes: 'Develop database queries, custom web applications, algorithm optimizations, and technical system administration.',
      careers: 'Software Developer, Web Designer, IT Administrator, Database Programmer.',
      achievements: '100% placements for MCA/BCA toppers in local software firms.',
      activities: 'College Coding Hackathon, Tech-Fest, Seminar on Cyber Security.'
    },
    education: {
      name: 'Department of Education (BEd)',
      intro: 'Accredited by NCTE, the Department of Education prepares secondary school educators. Integrating dual integrated BA BEd and BSc BEd degrees, we emphasize teaching methodologies and classroom management.',
      faculty: [
        { name: 'Dr. Sunita Sharma', role: 'Principal & HOD Education', degree: 'MEd, PhD in Education' },
        { name: 'Mrs. Kiran Rathore', role: 'Lecturer', degree: 'MEd, Net Qualified' }
      ],
      labs: 'Psychology Lab with teaching aids, intelligence tests, and classroom technology boards.',
      outcomes: 'Develop lesson plans, psychological child evaluations, and advanced secondary school lecturing strategies.',
      careers: 'School Teacher (Grade I, II, III), Education Counsellor, Curriculum Architect.',
      achievements: 'State board merit ranks secured by integrated education graduates.',
      activities: 'School Internship Programs, Micro-teaching Workshops, Art in Education Fest.'
    },
    botany: {
      name: 'Department of Botany',
      intro: 'Fostering botanical exploration, PG research, and taxonomic identification. We analyze plant genetics, tissue culture, and molecular plant pathology.',
      faculty: [
        { name: 'Dr. Neha Chaturvedi', role: 'Head of Department', degree: 'MSc, PhD in Botany' },
        { name: 'Prof. S. L. Maheshwari', role: 'Professor', degree: 'PhD in Plant Physiology' }
      ],
      labs: 'Botanical Research Lab containing high-magnification microscopes, centrifuges, and preserved specimen museum archives.',
      outcomes: 'Acquire botany specimen sectioning, plant pathology tracking, and biochemistry assay skills.',
      careers: 'Plant Pathologist, Forester, Nursery Consultant, PG Botanist Researcher.',
      achievements: 'Secured UGC Research Grant for local flora cataloging.',
      activities: 'Botanical Excursion tours to Mount Abu, Herbal Garden development.'
    },
    chemistry: {
      name: 'Department of Chemistry',
      intro: 'Fostering original molecular synthesis, analytical validations, and chemical science principles. The department is a recognized PhD research hub.',
      faculty: [
        { name: 'Dr. C. P. Mittal', role: 'Head of Department', degree: 'MSc, PhD in Organic Chemistry' },
        { name: 'Mrs. Megha Gupta', role: 'Assistant Professor', degree: 'MSc in Chemistry' }
      ],
      labs: 'Advanced PG Chemistry lab with spectrophotometers, analytical balances, and safety fume hoods.',
      outcomes: 'Perform chromatography separations, organic chemical synthesis, and pH metric validations.',
      careers: 'Industrial Chemist, QA Analyst, Pharmacy R&D Researcher, Chemistry Educator.',
      achievements: '6 PhD theses successfully submitted under Magadh University guidelines.',
      activities: 'Seminar on Green Chemistry, Lab Safety training modules.'
    },
    mathematics: {
      name: 'Department of Mathematics',
      intro: 'Delivering logic formulation, numerical modeling, and statistics curricula. The department covers complex numbers, differential algebra, and real analysis.',
      faculty: [
        { name: 'Dr. S. K. Sen', role: 'Assistant Professor', degree: 'PhD in Applied Mathematics' }
      ],
      labs: 'Math computational desk equipped with MATLAB and LaTeX document layouts.',
      outcomes: 'Apply algebra formulations to numerical physics problems and statistics tracking.',
      careers: 'Data Modeler, Actuarial Specialist, Statistical Analyst, Lecturer.',
      achievements: 'High success rate of students clearing CSIR NET and IIT JAM exams.',
      activities: 'National Mathematics Day Quiz, Symposium on Vedic Mathematics.'
    },
    physics: {
      name: 'Department of Physics',
      intro: 'Teaching thermodynamics, quantum theory, wave optics, and solid-state electronics. We nurture experimental physics validations.',
      faculty: [
        { name: 'Dr. Rajesh Kumar', role: 'Associate Prof', degree: 'MSc, PhD in Physics' }
      ],
      labs: 'Optics and solid-state electronics lab cabinets containing spectrometers, lasers, and breadboard kits.',
      outcomes: 'Verify semiconductor traits, logic gate models, and laser diffraction patterns.',
      careers: 'Lab Instructor, Technical Analyst, Physics Researcher, Teacher.',
      achievements: 'Zoology and Physics combined interdisciplinary paper published in international index.',
      activities: 'Science Day Working Models Display, Industrial visits.'
    },
    zoology: {
      name: 'Department of Zoology',
      intro: 'Exploring cellular physiology, entomology, and animal ecology. The department features dynamic practical labs and animal specimen archives.',
      faculty: [
        { name: 'Dr. Vikas Meena', role: 'Assistant Professor', degree: 'MSc, PhD in Zoology' },
        { name: 'Dr. Kiran Kumari', role: 'Lecturer', degree: 'PhD in Cell Biology' }
      ],
      labs: 'Spacious Zoology Lab with micro-tomes, digital projection screens, and a rich specimen museum.',
      outcomes: 'Grasp cell structures, comparative animal anatomy, and taxonomic keys cataloging.',
      careers: 'Wild Life Biologist, Clinical Lab Assistant, Zoo Officer, Research Fellow.',
      achievements: 'Topper Gold Medalist in Magadh University Zoology Board.',
      activities: 'Nature Club outings, Wildlife Week posters competition.'
    }
  };

  const getSidebarList = () => {
    if (dbDepartments.length === 0) {
      return Object.keys(departmentsList).map(key => ({
        key: key,
        label: key === 'arts' || key === 'computer' || key === 'education'
          ? departmentsList[key].name.replace('Department of ', '')
          : key.charAt(0).toUpperCase() + key.slice(1)
      }));
    }
    return dbDepartments.map(d => ({
      key: String(d.id),
      label: d.name.replace('Department of ', '')
    }));
  };

  const getMergedDept = () => {
    if (dbDepartments.length === 0 || !activeDeptData) {
      const key = searchParams.get('dept') || 'computer';
      return departmentsList[key] || departmentsList.computer;
    }

    const dbDept = activeDeptData;
    const staticMatchKey = Object.keys(departmentsList).find(key => {
      const staticName = departmentsList[key].name.toLowerCase();
      const dbName = dbDept.name.toLowerCase();
      return dbName.includes(staticName) || staticName.includes(dbName) ||
             dbDept.code?.toLowerCase() === key.toLowerCase();
    });

    const preset = staticMatchKey ? departmentsList[staticMatchKey] : null;

    let faculty = [];
    if (dbDept.faculty && dbDept.faculty.length > 0) {
      faculty = dbDept.faculty.map(f => ({
        name: f.user?.name || 'Faculty Member',
        role: f.designation || (f.id === dbDept.head_id ? 'Head of Department' : 'Faculty'),
        degree: f.qualification || 'M.Tech / PhD'
      }));
    } else if (dbDept.head) {
      faculty = [
        {
          name: dbDept.head.user?.name || 'HOD',
          role: dbDept.head.designation || 'Head of Department',
          degree: dbDept.head.qualification || 'PhD'
        }
      ];
    } else if (preset) {
      faculty = preset.faculty;
    } else {
      faculty = [
        { name: 'Dr. Head of Department', role: 'Head of Department', degree: 'PhD' }
      ];
    }

    const defaultLabs = dbDept.code === 'CSE'
      ? 'Advanced Computer Laboratories with high-speed internet, modern IDEs, databases, and programming frameworks.'
      : dbDept.code === 'ECE'
      ? 'Electronics Lab equipped with microprocessors, digital logic design kits, oscilloscopes, and signal generators.'
      : dbDept.code === 'ME'
      ? 'Thermal Engineering and Machine Design labs with mechanical testing rigs, engines, and CAD software tools.'
      : dbDept.code === 'CE'
      ? 'Structural Engineering and Surveying labs equipped with surveying instruments, UTM machines, and concrete testing equipment.'
      : 'Modern department labs equipped with practical tools and computing resources for experiments.';

    const defaultOutcomes = `Graduates will gain strong competencies in ${dbDept.name} theory, practices, and applications.`;
    const defaultCareers = dbDept.code === 'CSE'
      ? 'Software Engineer, Systems Analyst, IT consultant, Web Developer.'
      : dbDept.code === 'ECE'
      ? 'Telecom Engineer, Embedded Systems Engineer, Network Administrator.'
      : dbDept.code === 'ME'
      ? 'Mechanical Engineer, Design Engineer, QA Engineer, Production Manager.'
      : dbDept.code === 'CE'
      ? 'Civil Engineer, Project Manager, Site Engineer, Structural Designer.'
      : 'Higher education research, industry specialist, educator, or technical consultant.';

    const defaultAchievements = 'High placement rates in top technical and engineering firms, with students participating in state-level hackathons and competitions.';
    const defaultActivities = 'Departmental tech-fests, coding competitions, industrial site visits, and research seminars.';

    return {
      name: dbDept.name,
      intro: dbDept.description || preset?.intro || `Explore academic programs, facilities, and research opportunities in the Department of ${dbDept.name}.`,
      faculty: faculty,
      labs: dbDept.labs || preset?.labs || defaultLabs,
      outcomes: dbDept.outcomes || preset?.outcomes || defaultOutcomes,
      careers: dbDept.careers || preset?.careers || defaultCareers,
      achievements: dbDept.achievements || preset?.achievements || defaultAchievements,
      activities: dbDept.activities || preset?.activities || defaultActivities
    };
  };

  const handleDeptChange = (deptId) => {
    setSearchParams({ dept: deptId });
  };

  const dept = getMergedDept();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center space-y-3 mb-10">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-widest rounded">
          Academic Departments
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight">
          Explore Our Departments
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Learn about our faculty directories, laboratory infrastructures, and program outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-2 sm:p-4 rounded-2xl shadow-sm h-fit flex flex-row lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-x-visible scrollbar-none whitespace-nowrap lg:whitespace-normal">
          {getSidebarList().map((item) => (
            <button
              key={item.key}
              onClick={() => handleDeptChange(item.key)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all capitalize shrink-0 lg:w-full text-center lg:text-left ${
                String(activeDeptId) === String(item.key)
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="lg:col-span-3 bg-white border border-slate-200 p-4 sm:p-6 md:p-8 rounded-3xl shadow-sm min-h-[500px] space-y-8">
          {loadingDetail ? (
            <div className="animate-pulse space-y-6">
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-32" />
                <div className="h-8 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-28 bg-slate-100 rounded-xl border border-slate-200/50" />
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDeptId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded uppercase">
                    Gautam Budha Mahila College
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">{dept.name}</h2>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{dept.intro}</p>
                </div>

                {/* Core metrics details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Labs & Equipments */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <h4 className="font-bold text-xs text-blue-900 uppercase flex items-center gap-1.5">
                      <Microscope size={16} /> Labs & Infrastructure
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{dept.labs}</p>
                  </div>

                  {/* Outcomes */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <h4 className="font-bold text-xs text-emerald-800 uppercase flex items-center gap-1.5">
                      <Star size={16} /> Course Outcomes
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{dept.outcomes}</p>
                  </div>

                  {/* Careers */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <h4 className="font-bold text-xs text-[#cc0000] uppercase flex items-center gap-1.5">
                      <GraduationCap size={16} /> Career Pathways
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{dept.careers}</p>
                  </div>

                  {/* Achievements */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <h4 className="font-bold text-xs text-yellow-600 uppercase flex items-center gap-1.5">
                      <Trophy size={16} /> Major Achievements
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{dept.achievements}</p>
                  </div>
                </div>

                {/* Faculty Members */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Users size={20} className="text-blue-900" />
                    Department Faculty Directory
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dept.faculty.map((teacher, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-4 flex gap-3 items-center bg-white shadow-sm hover:shadow transition-shadow">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center border border-blue-200 shrink-0">
                          {teacher.name.split(' ').slice(-1)[0][0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800">{teacher.name}</h4>
                          <p className="text-[10px] text-blue-900 font-semibold">{teacher.role}</p>
                          <p className="text-[9px] text-slate-400">{teacher.degree}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Activities */}
                <div className="border border-slate-200 rounded-xl p-5 bg-blue-50/50 space-y-2">
                  <h4 className="font-bold text-xs text-blue-900 uppercase">Student Activities & Club Events</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{dept.activities}</p>
                </div>

              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
