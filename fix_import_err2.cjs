const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace("import React\nimport { motion } from 'motion/react', { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { motion } from 'motion/react';");
  fs.writeFileSync(file, code);
}
fix('src/pages/SignUp.tsx');
