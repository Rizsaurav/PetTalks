
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ghynglthihpdxzcgvdaz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoeW5nbHRoaWhwZHh6Y2d2ZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODAyNDMsImV4cCI6MjA2MDA1NjI0M30.MPTkyId9SlP_tYAcPj4mf-4Wi4Oywt4PtnTQQgaiIF4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
