const fs = require('fs');
const path = 'src/components/PricingSection.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('import { supabase }')) {
  code = code.replace("import { toast } from 'sonner';", "import { toast } from 'sonner';\nimport { supabase } from '../services/supabaseClient';");
  fs.writeFileSync(path, code, 'utf8');
}
