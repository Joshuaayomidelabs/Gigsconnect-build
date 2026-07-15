import fs from 'fs';

const path = 'src/pages/Landing.tsx';
let content = fs.readFileSync(path, 'utf8');

const startStr = '{/* Right Side: Structured Professional Hero */}';
const endStr = '          </div>\n        </div>\n      </section>';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find start or end strings");
  process.exit(1);
}

const replacement = `{/* Right Side: Structured Professional Hero */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-6 relative w-full h-[550px] lg:h-[650px] hidden lg:block"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Main Hero Illustration */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
                  <img 
                    src={heroIllustrationUrl} 
                    className="w-full h-full max-w-full max-h-[110%] object-contain rounded-2xl drop-shadow-[0_20px_50px_rgba(108,59,255,0.15)]"
                    alt="GigsConnect Creator Ecosystem"
                  />
                </div>
              </div>
            </motion.div>

            {/* Mobile Fallback View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:hidden relative w-full mt-10 max-w-[90%] mx-auto"
            >
              <div className="bg-transparent z-20 overflow-hidden relative drop-shadow-[0_15px_35px_rgba(108,59,255,0.15)]">
                <img 
                  src={heroIllustrationUrl} 
                  className="w-full object-contain rounded-[20px]"
                  alt="GigsConnect Creator Ecosystem"
                />
              </div>
            </motion.div>
`;

content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(path, content);
console.log("Successfully updated the file");
