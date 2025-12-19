import { createClient } from '@supabase/supabase-js';
import type { Config } from '@netlify/functions';

export default async (req: Request) => {
  try {
    const supabaseUrl = Netlify.env.get('SUPABASE_URL');
    const supabaseKey = Netlify.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return new Response(
        JSON.stringify({ error: 'Missing credentials' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('health_check')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase ping failed:', error.message);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const timestamp = new Date().toISOString();
    console.log(`Supabase ping successful: ${timestamp}`);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp,
        table: 'health_check',
        rowsChecked: data?.length || 0,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const config: Config = {
  schedule: '0 9 * * 1,3,5',
};
