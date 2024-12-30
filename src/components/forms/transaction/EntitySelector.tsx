import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Entity } from '../../../types/entity';

interface EntitySelectorProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function EntitySelector({ label, value, onChange, required }: EntitySelectorProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntities() {
      try {
        const { data, error } = await supabase
          .from('entities')
          .select('*')
          .order('entity_legal_name');
        
        if (error) throw error;
        setEntities(data || []);
      } catch (error) {
        console.error('Error fetching entities:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntities();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-white">
        {label}
      </label>
      <select
        required={required}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">Select Entity</option>
        {entities.map((entity) => (
          <option key={entity.id} value={entity.id}>
            {entity.entity_legal_name}
          </option>
        ))}
      </select>
    </div>
  );
}