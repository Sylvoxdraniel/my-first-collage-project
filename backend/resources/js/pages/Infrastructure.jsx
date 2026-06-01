import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building, BookOpen, Microscope, Laptop, Award, 
  Droplet, Dumbbell, ShieldCheck 
} from 'lucide-react';
import api from '../api/axios';

export default function Infrastructure() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeItem = searchParams.get('item') || 'classrooms';
  const [apiContent, setApiContent] = useState({});

  useEffect(() => {
    api.get('/public/page-content/infrastructure')
      .then(res => setApiContent(res.data))
      .catch(() => {});
  }, []);

  const facilities = {
    classrooms: {
      name: 'Smart Classrooms',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
      desc: 'Spacious, well-ventilated, and equipped with smart interactive display systems, high-definition projectors, and audio-visual setups. Our seating arrangements stimulate team collaborations and comfortable study sessions.',
      highlights: ['Intercom Connectivity', 'Full Projector Facilities', 'Comfortable Seating Desk Units', 'High-speed Wi-Fi Access']
    },
    library: {
      name: 'College Library',
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop',
      desc: 'Our spacious central library holds over 15,000 reference books, national scientific journals, literature resources, and digital textbook subscriptions. Dedicated silent study zones allow students to read peacefully.',
      highlights: ['Digital Cataloging (OPAC)', 'CSIR UGC Reference Guides', 'Journals and Newspapers cabinets', 'E-Library access center']
    },
    labs: {
      name: 'Scientific Laboratories',
      image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop',
      desc: 'Fully loaded practical cabinets for Botany, Zoology, Chemistry, and Physics streams. Preserved specimens museum, safety fume hoods, spectrophotometers, and centrifuges allow rigorous empirical testing.',
      highlights: ['PG Research Cabinets', 'Spectrophotometer Units', 'Microscope setups for every student', 'Chemical safety cabinets and fire drills']
    },
    complabs: {
      name: 'High-speed Computer Center',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
      desc: 'Modern computer lab hosting 120+ desktop systems with dual-core processors. Dual redundant high-speed broadband lines provide round-the-clock access. Operating systems include Windows Server and Linux Linux.',
      highlights: ['Broadband 100 Mbps Line', 'Dedicated MySQL & Web Servers', 'UPS Battery backup systems', 'Fitted central air cooling systems']
    },
    seminar: {
      name: 'Audio-Visual Seminar Hall',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop',
      desc: 'Designed for guest lectures, seminars, child education training, and cultural events. Seats 200+ delegates comfortably with integrated acoustic systems and state-of-the-art presentations software.',
      highlights: ['Acoustic wood paneling', 'Modern microphone setups', 'Full Air Conditioning', 'A/V live feed recording cabinet']
    },
    water: {
      name: 'Central RO Water Plant',
      image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=1200&auto=format&fit=crop',
      desc: 'A central reverse osmosis (RO) purification plant ensures pure, chilled drinking water supply across all blocks, backed by strict periodic microbiological testing.',
      highlights: ['Micro-biological filtering', 'Chilled drinking desks', 'Continuous quality monitoring', '2,000 Litres hourly capacity']
    },
    sports: {
      name: 'Sports & NSS Grounds',
      image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1200&auto=format&fit=crop',
      desc: 'Large sports grounds suited for cricket, volleyball, kabaddi, and track tournaments. Indoor setups contain table-tennis tables, chess desks, and carrom boards.',
      highlights: ['Outdoor Volleyball Court', 'Standard Cricket pitch net', 'Indoor table-tennis cabinet', 'Yoga instruction mats']
    }
  };

  // Merge API content over defaults
  const mergedFacilities = {};
  for (const key of Object.keys(facilities)) {
    mergedFacilities[key] = { ...facilities[key] };
    if (apiContent[key]) {
      if (apiContent[key].name) mergedFacilities[key].name = apiContent[key].name;
      if (apiContent[key].desc) mergedFacilities[key].desc = apiContent[key].desc;
      if (apiContent[key].image) {
        const img = apiContent[key].image;
        mergedFacilities[key].image = img.startsWith('http') ? img : `/api${img}`;
      }
      if (apiContent[key].highlights && apiContent[key].highlights.length > 0) {
        mergedFacilities[key].highlights = apiContent[key].highlights;
      }
    }
  }

  const item = mergedFacilities[activeItem] || mergedFacilities.classrooms;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center space-y-3 mb-10">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-widest rounded">
          Campus Tour
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight">
          College Infrastructure & Facilities
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Take a look at our classrooms, library, modern laboratory facilities, and green campus assets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-2 sm:p-4 rounded-2xl shadow-sm h-fit flex flex-row lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-x-visible scrollbar-none whitespace-nowrap lg:whitespace-normal">
          {[
            { id: 'classrooms', label: 'Smart Classrooms', icon: Building },
            { id: 'library', label: 'College Library', icon: BookOpen },
            { id: 'labs', label: 'Scientific Laboratories', icon: Microscope },
            { id: 'complabs', label: 'Computer Labs', icon: Laptop },
            { id: 'seminar', label: 'Seminar Hall', icon: Award },
            { id: 'water', label: 'RO Water Plant', icon: Droplet },
            { id: 'sports', label: 'Sports Facilities', icon: Dumbbell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ item: tab.id })}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 lg:w-full text-center lg:text-left ${
                  activeItem === tab.id
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Showcase */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          {/* Cover Photo */}
          <div className="h-64 sm:h-80 w-full overflow-hidden relative">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow">{item.name}</h2>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              {item.desc}
            </p>

            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Key Facilities & Highlights</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.highlights.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs font-bold text-slate-700">
                    <ShieldCheck size={16} className="text-blue-900 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
