import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineDocumentText, 
  HiOutlineOfficeBuilding, 
  HiOutlineInformationCircle, 
  HiOutlineSave, 
  HiOutlineUpload, 
  HiOutlinePlus, 
  HiOutlineTrash 
} from 'react-icons/hi';

// Section schemas and default structures
const INFRASTRUCTURE_SECTIONS = {
  classrooms: {
    label: 'Smart Classrooms',
    fields: [
      { key: 'name', label: 'Facility Name', type: 'text', default: 'Smart Classrooms' },
      { key: 'desc', label: 'Description', type: 'textarea', default: 'Spacious, well-ventilated classrooms equipped with modern training systems.' },
      { key: 'highlights', label: 'Highlights List', type: 'array', default: ['Intercom Connectivity', 'Full Projector Facilities', 'Comfortable Seating Desk Units', 'High-speed Wi-Fi Access'] }
    ]
  },
  library: {
    label: 'College Library',
    fields: [
      { key: 'name', label: 'Facility Name', type: 'text', default: 'College Library' },
      { key: 'desc', label: 'Description', type: 'textarea', default: 'Our spacious central library holds a rich collection of books, textbooks, reference materials, journals, and electronic databases.' },
      { key: 'highlights', label: 'Highlights List', type: 'array', default: ['Digital Cataloging (OPAC)', 'CSIR UGC Reference Guides', 'Journals and Newspapers cabinets', 'E-Library access center'] }
    ]
  },
  labs: {
    label: 'Scientific Laboratories',
    fields: [
      { key: 'name', label: 'Facility Name', type: 'text', default: 'Scientific Laboratories' },
      { key: 'desc', label: 'Description', type: 'textarea', default: 'Fully loaded practical cabinets with calibrated apparatus for Botany, Chemistry, Physics, and Zoology experimental research.' },
      { key: 'highlights', label: 'Highlights List', type: 'array', default: ['PG Research Cabinets', 'Spectrophotometer Units', 'Microscope setups for every student', 'Chemical safety cabinets and fire drills'] }
    ]
  },
  complabs: {
    label: 'High-speed Computer Center',
    fields: [
      { key: 'name', label: 'Facility Name', type: 'text', default: 'High-speed Computer Center' },
      { key: 'desc', label: 'Description', type: 'textarea', default: 'Modern computer lab equipped with high-speed internet, development tools, and software resources to assist all branches of learning.' },
      { key: 'highlights', label: 'Highlights List', type: 'array', default: ['Broadband 100 Mbps Line', 'Dedicated MySQL & Web Servers', 'UPS Battery backup systems', 'Fitted central air cooling systems'] }
    ]
  },
  seminar: {
    label: 'Audio-Visual Seminar Hall',
    fields: [
      { key: 'name', label: 'Facility Name', type: 'text', default: 'Audio-Visual Seminar Hall' },
      { key: 'desc', label: 'Description', type: 'textarea', default: 'Designed for guest lectures, workshops, conferences, and student presentation events.' },
      { key: 'highlights', label: 'Highlights List', type: 'array', default: ['Acoustic wood paneling', 'Modern microphone setups', 'Full Air Conditioning', 'A/V live feed recording cabinet'] }
    ]
  },
  water: {
    label: 'Central RO Water Plant',
    fields: [
      { key: 'name', label: 'Facility Name', type: 'text', default: 'Central RO Water Plant' },
      { key: 'desc', label: 'Description', type: 'textarea', default: 'A central reverse osmosis water treatment system serving chilled, pure drinking water across multiple points.' },
      { key: 'highlights', label: 'Highlights List', type: 'array', default: ['Micro-biological filtering', 'Chilled drinking desks', 'Continuous quality monitoring', '2,000 Litres hourly capacity'] }
    ]
  },
  sports: {
    label: 'Sports & NSS Grounds',
    fields: [
      { key: 'name', label: 'Facility Name', type: 'text', default: 'Sports & NSS Grounds' },
      { key: 'desc', label: 'Description', type: 'textarea', default: 'Large sports grounds and court setups promoting physical fitness, games, and active student NSS community schemes.' },
      { key: 'highlights', label: 'Highlights List', type: 'array', default: ['Outdoor Volleyball Court', 'Standard Cricket pitch net', 'Indoor table-tennis cabinet', 'Yoga instruction mats'] }
    ]
  }
};

const ABOUT_SECTIONS = {
  about: {
    label: 'About Gautam Budha Mahila College',
    fields: [
      { key: 'title', label: 'Main Title', type: 'text', default: 'About Gautam Budha Mahila College' },
      { key: 'text', label: 'Main Content Text', type: 'textarea', default: 'Established in 1953, Gautam Budha Mahila College, Gaya has grown to become one of the premier educational institutions in Bihar...' }
    ]
  },
  chairman: {
    label: "Vice Chancellor's Message",
    fields: [
      { key: 'name', label: 'VC Name', type: 'text', default: 'Prof. (Dr.) Dilip Kumar Kesari' },
      { key: 'designation', label: 'Designation', type: 'text', default: 'Vice Chancellor, Magadh University' },
      { key: 'message', label: 'VC Message Text', type: 'textarea', default: 'Welcome to Gautam Budha Mahila College. Education is not just about loading minds with facts...' }
    ],
    hasPhoto: true
  },
  director: {
    label: "Principal's Message",
    fields: [
      { key: 'name', label: 'Principal Name', type: 'text', default: 'Prof. (Dr.) Seema Patel' },
      { key: 'designation', label: 'Designation', type: 'text', default: 'Principal, Gautam Budha Mahila College' },
      { key: 'message', label: 'Principal Message Text', type: 'textarea', default: 'At Gautam Budha Mahila College, we have established a culture of academic rigor and student achievements...' }
    ],
    hasPhoto: true
  },
  principal: {
    label: "Patron's Message",
    fields: [
      { key: 'name', label: 'Patron Name', type: 'text', default: 'Dr. Sunita Sharma' },
      { key: 'designation', label: 'Designation', type: 'text', default: 'Patron, Gautam Budha Mahila College' },
      { key: 'message', label: 'Patron Message Text', type: 'textarea', default: 'It is an honor to lead this institution. We have structured a syllabus support framework...' }
    ],
    hasPhoto: true
  },
  vision: {
    label: 'Vision & Mission',
    fields: [
      { key: 'vision_text', label: 'Vision Statement', type: 'textarea', default: 'To become a premier center of higher education and research, transforming youth into self-reliant, highly ethical...' },
      { key: 'mission_points', label: 'Mission Points', type: 'array', default: ['To provide state-of-the-art laboratory and learning resources.', 'To implement advanced, industry-focused academic curricula.', 'To promote research, student workshops, and collaborations.', 'To encourage participation in community services (NSS) and sports.'] }
    ]
  },
  swoc: {
    label: 'SWOC Analysis',
    fields: [
      { key: 'strengths', label: 'Strengths (S)', type: 'textarea', default: 'Highly qualified faculty with PhDs, prime location in Gaya, and well-equipped science and computer labs.' },
      { key: 'weaknesses', label: 'Weaknesses (W)', type: 'textarea', default: 'Limited international student exchange programs and potential to expand corporate industry MoUs.' },
      { key: 'opportunities', label: 'Opportunities (O)', type: 'textarea', default: 'Launching more skill-based certification courses, starting PG courses in Physics, and developing a local incubation cell.' },
      { key: 'challenges', label: 'Challenges (C)', type: 'textarea', default: 'Rapid technological shifts requiring constant hardware upgrades and competition from national online degree providers.' }
    ]
  },
  distinctiveness: {
    label: 'Institutional Distinctiveness',
    fields: [
      { key: 'text', label: 'Content Text', type: 'textarea', default: 'Gautam Budha Mahila College Gaya stands out for its Gold Medalist Mentorship Programme...' }
    ]
  },
  egovernance: {
    label: 'E-Governance',
    fields: [
      { key: 'text', label: 'Description Text', type: 'textarea', default: 'We have implemented E-governance across all domains:' },
      { key: 'points', label: 'E-Governance Highlights', type: 'array', default: ['Administration: Online biometric and student portal databases.', 'Student Admission: Online application system & payment gateway simulation.', 'Examinations: Online portal for marks uploads, grade sheet generation, and results publication.'] }
    ]
  },
  administrative: {
    label: 'Administrative Setup',
    fields: [
      { key: 'text', label: 'Content Text', type: 'textarea', default: 'The college administration operates under the guidance of the Director and Principal...' }
    ]
  },
  perspective: {
    label: 'Institutional Perspective Plan',
    fields: [
      { key: 'text', label: 'Content Text', type: 'textarea', default: 'The 5-Year Institutional Perspective Plan concentrates on obtaining PG status for all biological and physical science departments...' }
    ]
  }
};

export default function PageContentManager() {
  const [activeTab, setActiveTab] = useState('infrastructure');
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState({});
  const [openSection, setOpenSection] = useState(null);
  const [uploadingImage, setUploadingImage] = useState({});

  const sections = activeTab === 'infrastructure' ? INFRASTRUCTURE_SECTIONS : ABOUT_SECTIONS;

  // Calculate backend API URL for previewing uploads
  const getBackendUrl = () => {
    return window.location.origin;
  };

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/public/page-content/${activeTab}`);
      setPageData(res.data || {});
    } catch (err) {
      toast.error('Failed to load page content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
    setOpenSection(null);
  }, [activeTab]);

  const handleFieldChange = (sectionKey, fieldKey, value) => {
    setPageData(prev => {
      const sectionContent = prev[sectionKey] || {};
      return {
        ...prev,
        [sectionKey]: {
          ...sectionContent,
          [fieldKey]: value
        }
      };
    });
  };

  const handleArrayElementChange = (sectionKey, fieldKey, index, value) => {
    setPageData(prev => {
      const sectionContent = prev[sectionKey] || {};
      const arr = [...(sectionContent[fieldKey] || [])];
      arr[index] = value;
      return {
        ...prev,
        [sectionKey]: {
          ...sectionContent,
          [fieldKey]: arr
        }
      };
    });
  };

  const addArrayElement = (sectionKey, fieldKey) => {
    setPageData(prev => {
      const sectionContent = prev[sectionKey] || {};
      const arr = [...(sectionContent[fieldKey] || [])];
      arr.push('');
      return {
        ...prev,
        [sectionKey]: {
          ...sectionContent,
          [fieldKey]: arr
        }
      };
    });
  };

  const removeArrayElement = (sectionKey, fieldKey, index) => {
    setPageData(prev => {
      const sectionContent = prev[sectionKey] || {};
      const arr = [...(sectionContent[fieldKey] || [])];
      arr.splice(index, 1);
      return {
        ...prev,
        [sectionKey]: {
          ...sectionContent,
          [fieldKey]: arr
        }
      };
    });
  };

  const handleImageUpload = async (e, sectionKey) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('page', activeTab);
    formData.append('section', sectionKey);

    setUploadingImage(prev => ({ ...prev, [sectionKey]: true }));
    const loadingToast = toast.loading('Uploading photo...');

    try {
      const res = await api.post('/page-content/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newImagePath = res.data.image_path;
      
      // Update state
      setPageData(prev => {
        const sectionContent = prev[sectionKey] || {};
        // For about page messages we use 'photo', for infra we use 'image'
        const imageField = activeTab === 'about' ? 'photo' : 'image';
        return {
          ...prev,
          [sectionKey]: {
            ...sectionContent,
            [imageField]: newImagePath
          }
        };
      });

      toast.success('Image uploaded and saved successfully!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to upload image.', { id: loadingToast });
    } finally {
      setUploadingImage(prev => ({ ...prev, [sectionKey]: false }));
    }
  };

  const handleSaveSection = async (sectionKey) => {
    const sectionConfig = sections[sectionKey];
    const rawContent = pageData[sectionKey] || {};
    
    // Fill in default values if not defined
    const finalContent = {};
    
    // Check fields
    sectionConfig.fields.forEach(field => {
      if (rawContent[field.key] !== undefined) {
        finalContent[field.key] = rawContent[field.key];
      } else {
        finalContent[field.key] = field.default;
      }
    });

    // Check image/photo fields
    const imageField = activeTab === 'about' ? 'photo' : 'image';
    if (rawContent[imageField]) {
      finalContent[imageField] = rawContent[imageField];
    } else if (rawContent['image']) {
      finalContent['image'] = rawContent['image'];
    }

    const saveToast = toast.loading('Saving changes...');
    try {
      await api.post('/page-content', {
        page: activeTab,
        section: sectionKey,
        content: finalContent
      });
      toast.success('Changes saved successfully!', { id: saveToast });
    } catch (err) {
      toast.error('Failed to save changes.', { id: saveToast });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <HiOutlineDocumentText className="text-blue-500" /> Page Content Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Modify text, points, and images on the public pages of the website.
          </p>
        </div>
      </div>

      {/* Tabs selector */}
      <div className="flex space-x-2 border-b border-dark-800">
        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'infrastructure'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HiOutlineOfficeBuilding /> Infrastructure Page
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'about'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HiOutlineInformationCircle /> About Us Page
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(sections).map(([key, config]) => {
            const isOpened = openSection === key;
            const content = pageData[key] || {};
            const hasImageField = activeTab === 'infrastructure' || config.hasPhoto;
            const imageField = activeTab === 'about' ? 'photo' : 'image';
            const currentImg = content[imageField];

            return (
              <div 
                key={key} 
                className="bg-dark-900/60 backdrop-blur-md border border-dark-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg"
              >
                {/* Header Toggle */}
                <button
                  onClick={() => setOpenSection(isOpened ? null : key)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-dark-800/40 transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white">{config.label}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Section Key: {key}</p>
                  </div>
                  <span className="text-slate-400 text-sm">
                    {isOpened ? 'Collapse' : 'Expand'}
                  </span>
                </button>

                {/* Edit Form Body */}
                <AnimatePresence initial={false}>
                  {isOpened && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-dark-800/60"
                    >
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          
                          {/* Left Column: Form Fields */}
                          <div className="lg:col-span-2 space-y-4">
                            {config.fields.map(field => {
                              const val = content[field.key] !== undefined ? content[field.key] : field.default;

                              return (
                                <div key={field.key} className="space-y-1.5">
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {field.label}
                                  </label>

                                  {field.type === 'text' && (
                                    <input
                                      type="text"
                                      value={val}
                                      onChange={(e) => handleFieldChange(key, field.key, e.target.value)}
                                      className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                      placeholder={`Enter ${field.label}...`}
                                    />
                                  )}

                                  {field.type === 'textarea' && (
                                    <textarea
                                      rows={5}
                                      value={val}
                                      onChange={(e) => handleFieldChange(key, field.key, e.target.value)}
                                      className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
                                      placeholder={`Enter ${field.label}...`}
                                    />
                                  )}

                                  {field.type === 'array' && (
                                    <div className="space-y-2">
                                      <div className="space-y-2">
                                        {(val || []).map((itemVal, idx) => (
                                          <div key={idx} className="flex gap-2 items-center">
                                            <input
                                              type="text"
                                              value={itemVal}
                                              onChange={(e) => handleArrayElementChange(key, field.key, idx, e.target.value)}
                                              className="flex-1 bg-dark-950 border border-dark-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                              placeholder={`Item ${idx + 1}...`}
                                            />
                                            <button
                                              type="button"
                                              onClick={() => removeArrayElement(key, field.key, idx)}
                                              className="p-2 bg-red-950/20 text-red-400 border border-red-900/30 rounded-xl hover:bg-red-950/40 transition-colors"
                                              title="Remove Item"
                                            >
                                              <HiOutlineTrash size={16} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => addArrayElement(key, field.key)}
                                        className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                      >
                                        <HiOutlinePlus size={14} /> Add Point
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Right Column: Image Manager */}
                          {hasImageField && (
                            <div className="lg:col-span-1 border border-dark-800 bg-dark-950/40 p-4 rounded-2xl flex flex-col items-center justify-center space-y-4 min-h-[220px]">
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider text-center w-full">
                                Section Photo
                              </label>

                              {currentImg ? (
                                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-dark-800 bg-dark-950 group">
                                  <img 
                                    src={currentImg.startsWith('http') ? currentImg : `${getBackendUrl()}/api${currentImg}`} 
                                    alt={config.label}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-white text-xs font-bold bg-dark-900/80 px-3 py-1.5 rounded-lg border border-dark-700">
                                      Hover to replace
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-40 border-2 border-dashed border-dark-800 rounded-xl flex flex-col items-center justify-center bg-dark-950/30">
                                  <HiOutlineUpload size={32} className="text-slate-600 mb-2" />
                                  <span className="text-xs text-slate-500">No Image Uploaded</span>
                                </div>
                              )}

                              <div className="relative w-full">
                                <input
                                  type="file"
                                  accept="image/*"
                                  id={`file-upload-${key}`}
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, key)}
                                  disabled={uploadingImage[key]}
                                />
                                <label
                                  htmlFor={`file-upload-${key}`}
                                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 border border-dark-800 rounded-xl text-xs font-bold text-slate-300 hover:bg-dark-800 hover:text-white cursor-pointer transition-colors ${
                                    uploadingImage[key] ? 'opacity-50 pointer-events-none' : ''
                                  }`}
                                >
                                  <HiOutlineUpload size={14} /> 
                                  {uploadingImage[key] ? 'Uploading...' : 'Choose File'}
                                </label>
                              </div>
                              <span className="text-[10px] text-slate-500 text-center">
                                Max Size: 5MB. Formats: JPG, PNG, WEBP, GIF.
                              </span>
                            </div>
                          )}

                        </div>

                        {/* Save Button Bar */}
                        <div className="flex justify-end pt-4 border-t border-dark-850">
                          <button
                            type="button"
                            onClick={() => handleSaveSection(key)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 shadow-md shadow-blue-900/20 active:scale-95 transition-all"
                          >
                            <HiOutlineSave size={18} /> Save Section Content
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
