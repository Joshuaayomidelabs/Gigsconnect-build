const fs = require('fs');

function buildHeroPanel() {
  return `        {/* LEFT PANEL */}
        <div className="w-full md:w-[45%] lg:w-[50%] p-8 md:p-12 lg:p-16 flex flex-col relative z-10 overflow-hidden bg-gradient-to-br from-white via-[#F8F5FF] to-[#EBE4FF] border-r border-[#7C3AED]/10">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C3AED]/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9333EA]/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          {/* Subtle Abstract Shapes / Patterns */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#7C3AED 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="relative z-10 flex-none mb-8 mt-2">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#7C3AED]/20 text-[11px] font-black text-[#7C3AED] uppercase tracking-[0.15em] w-fit mb-8 shadow-sm">
              Africa's Creator Ecosystem
            </span>
            <h2 className="text-4xl lg:text-[3.25rem] font-black text-[#111827] tracking-tight leading-[1.05] mb-6">
              Africa's Home for<br/>Every Creator
            </h2>
            <p className="text-[#111827]/70 text-base lg:text-lg font-medium leading-relaxed max-w-[420px]">
              Build your creative identity, showcase your work, discover opportunities, collaborate with brands, and grow your career across Africa—all from one platform.
            </p>
          </div>

          {/* Storytelling Scene (Desktop & Tablet) */}
          <div className="flex-1 relative w-full hidden md:block min-h-[400px] mt-4">
            
            {/* Connecting Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.4 }}>
              <path d="M 20% 30% C 40% 10%, 60% 40%, 75% 20%" stroke="#7C3AED" strokeWidth="1.5" fill="none" strokeDasharray="6 6" className="animate-pulse" />
              <path d="M 30% 70% C 50% 90%, 70% 60%, 85% 75%" stroke="#7C3AED" strokeWidth="1.5" fill="none" strokeDasharray="6 6" className="animate-pulse" style={{ animationDelay: '1s' }} />
              <path d="M 25% 40% C 50% 50%, 40% 70%, 65% 65%" stroke="#9333EA" strokeWidth="1" fill="none" strokeDasharray="4 4" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            </svg>

            {/* Central glowing hub */}
            <div className="absolute top-[45%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/40 rounded-full blur-2xl z-0"></div>

            {/* Creators Floating */}
            {/* Photographer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-[10%] left-[10%] w-[45%] max-w-[180px] z-20"
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/60 rounded-full blur-xl transform scale-75"></div>
                  <img src="/assets/illustrations/creators/photographer.svg" alt="Photographer" className="w-full h-auto relative drop-shadow-xl" />
                </div>
              </motion.div>
            </motion.div>

            {/* Web Creator */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute top-[5%] right-[5%] w-[40%] max-w-[160px] z-10"
            >
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/60 rounded-full blur-xl transform scale-75"></div>
                  <img src="/assets/illustrations/creators/web-creator.svg" alt="Web Creator" className="w-full h-auto relative drop-shadow-xl" />
                </div>
              </motion.div>
            </motion.div>

            {/* Content Creator / Media */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="absolute bottom-[10%] right-[15%] w-[50%] max-w-[200px] z-30"
            >
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/60 rounded-full blur-xl transform scale-75"></div>
                  <img src="/assets/illustrations/creators/content-creator.svg" alt="Content Creator" className="w-full h-auto relative drop-shadow-xl" />
                </div>
              </motion.div>
            </motion.div>
            
            {/* DJ / Music */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="absolute bottom-[5%] left-[5%] w-[35%] max-w-[140px] z-10"
            >
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/60 rounded-full blur-xl transform scale-75"></div>
                  <img src="/assets/illustrations/creators/dj-bro.svg" alt="Music Creator" className="w-full h-auto relative drop-shadow-xl" />
                </div>
              </motion.div>
            </motion.div>

            {/* Floating UI Elements / Geometric Shapes */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[40%] left-[45%] w-8 h-8 rounded-lg border-2 border-[#7C3AED]/30 z-0"></motion.div>
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-[25%] right-[35%] w-4 h-4 rounded-full bg-[#F59E0B]/40 z-0"></motion.div>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[35%] left-[30%] w-3 h-3 rounded-full bg-[#10B981]/40 z-0"></motion.div>

          </div>

          {/* Mobile Simplified Scene */}
          <div className="flex md:hidden relative w-full h-[240px] mt-4 items-center justify-center">
            <div className="absolute inset-0 bg-[#7C3AED]/5 rounded-[2rem] transform rotate-2"></div>
            <img src="/assets/illustrations/landing/teamwork.svg" alt="Creators" className="w-[80%] h-auto object-contain relative z-10 drop-shadow-lg" />
          </div>
        </div>

        {/* RIGHT PANEL (Form) */}
        <div className="w-full md:w-[55%] lg:w-[50%] flex flex-col justify-center px-6 py-12 md:px-12 lg:px-20 bg-white relative z-20">`;
}

function updateFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Need to import motion if not present
  if (!code.includes("import { motion }")) {
    code = code.replace(/import React/, "import React\nimport { motion } from 'motion/react'");
  }

  // Find the LEFT PANEL to replace
  const leftPanelStart = code.indexOf('{/* LEFT PANEL');
  const rightPanelStart = code.indexOf('{/* RIGHT PANEL');
  const innerRightPanel = code.indexOf('<div className="w-full max-w-[480px] mx-auto">', rightPanelStart);
  
  if (leftPanelStart !== -1 && rightPanelStart !== -1 && innerRightPanel !== -1) {
    const before = code.substring(0, leftPanelStart);
    const after = code.substring(innerRightPanel);
    
    code = before + buildHeroPanel() + '\n          ' + after;
    fs.writeFileSync(filePath, code);
    console.log("Updated", filePath);
  } else {
    console.log("Could not find boundaries in", filePath);
  }
}

updateFile('src/pages/Login.tsx');
updateFile('src/pages/SignUp.tsx');

