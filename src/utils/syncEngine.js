
import { supabase } from '@/lib/supabaseClient';
import { loadData, saveData } from './localStorage';

const TABLE_NAME = 'user_backups';

export const syncEngine = {
    // Push local data to Supabase
    async push() {
        if (!navigator.onLine) return;

        const localData = loadData();
        const user = (await supabase.auth.getUser()).data.user;

        if (!user) return; // Must be logged in

        const { error } = await supabase
            .from(TABLE_NAME)
            .upsert({
                user_id: user.id,
                data: localData,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) console.error('Sync Push Error:', error);
        else console.log('☁️ Data Synced to Cloud');
    },

    // Pull cloud data and merge
    async pull() {
        if (!navigator.onLine) return;

        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return;

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error) {
            // No data found is fine for fresh users
            if (error.code !== 'PGRST116') console.error('Sync Pull Error:', error);
            return;
        }

        if (data && data.data) {
            // Simple strategy: Cloud wins? Or check timestamps?
            // For now: Overwrite local if cloud is newer (User needs to accept this?)
            // Let's just log it for now or auto-merge if simple.
            console.log('☁️ Cloud Data Found:', data);

            // OPTIONAL: Force overwrite local for "Restore" functionality
            // saveState(data.data); 
        }
    }
};
