const fs = require('fs');
const content = fs.readFileSync('src/pages/Messages.tsx', 'utf-8');
const newContent = content.replace("import { handleError } from '../utils/errorHandler';", "import { handleError } from '../utils/errorHandler';\nimport { supabase } from '../services/supabaseClient';\nimport { useAuth } from '../context/AuthContext';");
fs.writeFileSync('src/pages/Messages.tsx', newContent, 'utf-8');
