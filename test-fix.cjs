const fs = require('fs');
let content = fs.readFileSync('src/components/messages/ConversationCard.tsx', 'utf-8');
content = content.replace("            </span>\n          </div>\n        )}", "            </span>\n          </motion.div>\n        )}");
fs.writeFileSync('src/components/messages/ConversationCard.tsx', content, 'utf-8');
