// Make sure this file ONLY contains the code below:

const supabaseUrl = 'https://skixfenlotxgocdoqxrx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNraXhmZW5sb3R4Z29jZG9xeHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDE2ODUsImV4cCI6MjA3NjExNzY4NX0.6c4gIUPcxdCDdRmXDTGRXpGngkLG7Uuak7-WMDRcAv0';

// The following line MUST use the global "supabase" object provided by the CDN
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);