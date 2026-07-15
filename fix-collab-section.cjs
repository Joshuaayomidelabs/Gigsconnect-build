const fs = require('fs');
const path = 'src/pages/Landing.tsx';
let content = fs.readFileSync(path, 'utf8');

const startStr = '{/* Right Column (55%) */}';
const endStr = '{/* CTA Section */}';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find start or end strings for collab section");
  process.exit(1);
}

const replacement = `{/* Right Column (55%) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full lg:col-span-7 relative h-[600px] lg:h-[700px] flex items-center justify-center"
            >
              <div className="absolute inset-0 flex items-center justify-center relative w-full h-full">
                
                {/* Main Collaborative Illustration */}
                <div className="relative z-10 w-[80%] max-w-[500px] aspect-square rounded-[3rem] overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#faf9fc] to-white z-0"></div>
                  <img src="/src/assets/images/collab_illustration_1784145126690.jpg" alt="Creators Collaborating" className="w-full h-full object-contain relative z-10 mix-blend-multiply" />
                </div>

                {/* Floating Cards Array */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="absolute left-[5%] top-[10%] z-20"
                >
                  <div className="bg-white p-3 lg:p-4 rounded-[1.25rem] shadow-[0_15px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Creative Project</p>
                      <p className="text-sm font-black text-brand-black">Hiring Now</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 7, delay: 1, ease: "easeInOut" }}
                  className="absolute right-[5%] top-[20%] z-20"
                >
                  <div className="bg-white p-3 lg:p-4 rounded-[1.25rem] shadow-[0_15px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                      <p className="text-sm font-black text-brand-black">Verified Creator</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 8, delay: 0.5, ease: "easeInOut" }}
                  className="absolute left-[10%] bottom-[20%] z-20"
                >
                  <div className="bg-white p-3 lg:p-4 rounded-[1.25rem] shadow-[0_15px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">New Message</p>
                      <p className="text-sm font-black text-brand-black">Collab Request</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 5.5, delay: 2, ease: "easeInOut" }}
                  className="absolute right-[10%] bottom-[15%] z-20"
                >
                  <div className="bg-white p-3 lg:p-4 rounded-[1.25rem] shadow-[0_15px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Project Match</p>
                      <p className="text-sm font-black text-brand-black">98% Fit</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Tags */}
                <motion.div 
                  animate={{ y: [0, -5, 0], x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, delay: 1.5, ease: "easeInOut" }}
                  className="absolute top-[8%] right-[30%] z-30 hidden md:block"
                >
                  <div className="bg-brand-black text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
                    <Code className="w-3.5 h-3.5 text-brand-purple-light" /> Developer
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 5, delay: 2.5, ease: "easeInOut" }}
                  className="absolute bottom-[8%] left-[30%] z-30 hidden md:block"
                >
                  <div className="bg-white text-brand-black border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-brand-purple" /> Photography
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </div>

          `;

content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
fs.writeFileSync(path, content);
console.log("Successfully updated collab section");
