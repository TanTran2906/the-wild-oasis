
import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://ijzvdlcgvxyfrbcjjbvt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqenZkbGNndnh5ZnJiY2pqYnZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA2MzE0MjIsImV4cCI6MjAwNjIwNzQyMn0.vn-eD7nvJtJ5lrGmr9RffdgRlFEnkaoFEaULJFmhSb4'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase