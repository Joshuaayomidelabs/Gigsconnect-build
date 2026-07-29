const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace("import React\nimport { motion } from 'motion/react', { useState } from 'react';", "import React, { useState } from 'react';\nimport { motion } from 'motion/react';");
  fs.writeFileSync(file, code);
}
fix('src/pages/Login.tsx');
fix('src/pages/SignUp.tsx');
