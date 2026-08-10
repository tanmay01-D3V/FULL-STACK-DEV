const {createCLient} = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createCLient(supabaseUrl, supabaseKey);

module.exports = supabase;