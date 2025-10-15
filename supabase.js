<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.5/dist/umd/supabase.min.js"></script>

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://skixfenlotxgocdoqxrx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNraXhmZW5sb3R4Z29jZG9xeHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDE2ODUsImV4cCI6MjA3NjExNzY4NX0.6c4gIUPcxdCDdRmXDTGRXpGngkLG7Uuak7-WMDRcAv0';
const supabase = createClient(supabaseUrl, supabaseKey)