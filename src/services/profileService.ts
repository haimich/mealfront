
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (data) {
      return {
        id: data.id,
        username: data.username,
        fullName: data.full_name,
        avatarUrl: data.avatar_url
      };
    }
    
    return null;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string, 
  updates: { username?: string; fullName?: string; avatarUrl?: string }
): Promise<Profile | null> => {
  try {
    // First convert the field names to match the database columns
    const dbUpdates: any = {};
    if (updates.username) dbUpdates.username = updates.username;
    if (updates.fullName) dbUpdates.full_name = updates.fullName;
    if (updates.avatarUrl) dbUpdates.avatar_url = updates.avatarUrl;
    
    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      toast.error(error.message);
      throw error;
    }
    
    if (data) {
      toast.success('Profile updated successfully');
      return {
        id: data.id,
        username: data.username,
        fullName: data.full_name,
        avatarUrl: data.avatar_url
      };
    }
    
    return null;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return null;
  }
};
