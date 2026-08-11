// src/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL'),
      this.configService.get('SUPABASE_KEY'),
    );
  }

  async uploadM3u8(filename: string, content: string) {
    const { data, error } = await this.supabase.storage
      .from('bmovie-playlists') 
      .upload(filename, content, {
        contentType: 'application/vnd.apple.mpegurl',
        upsert: true, 
      });

    if (error) throw error;
    return data;
  }

  getPublicUrl(filename: string) {
    const { data } = this.supabase.storage
      .from('bmovie-playlists')
      .getPublicUrl(filename);
      
    return data.publicUrl;
  }
  async checkFileExists(filename: string): Promise<boolean> {
  const publicUrl = this.getPublicUrl(filename);
  try {
    const response = await fetch(publicUrl, { method: 'HEAD' });
    return response.ok; 
  } catch (error) {
    return false;
  }
}
}