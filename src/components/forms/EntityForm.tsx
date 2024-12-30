import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Entity, ENTITY_TYPES } from '../../types/entity';
import { validateEntityForm } from '../../utils/validation';

interface EntityFormProps {
  onSuccess?: () => void;
  initialData?: Partial<Entity>;
}

interface FormErrors {
  entity_legal_name?: string;
  entity_type?: string;
  email1?: string;
  email2?: string;
  submit?: string;
}

export function EntityForm({ onSuccess, initialData }: EntityFormProps) {
  const [formData, setFormData] = useState<Partial<Entity>>(initialData || {});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validation = validateEntityForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('entities')
        .upsert([{
          ...formData,
          entity_legal_name: formData.entity_legal_name?.trim(),
          entity_type: formData.entity_type?.trim(),
          entity_uuid: formData.entity_uuid || `ENT-${Date.now()}`
        }])
        .select();

      if (error) throw error;
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error saving entity:', error);
      setErrors({
        submit: error.message || 'Failed to save entity'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-white">
            Legal Name
          </label>
          <input
            type="text"
            required
            value={formData.entity_legal_name || ''}
            onChange={(e) =>
              setFormData({ ...formData, entity_legal_name: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.entity_legal_name && (
            <p className="mt-1 text-sm text-red-400">{errors.entity_legal_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Entity Type
          </label>
          <select
            required
            value={formData.entity_type || ''}
            onChange={(e) =>
              setFormData({ ...formData, entity_type: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Type</option>
            {ENTITY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.entity_type && (
            <p className="mt-1 text-sm text-red-400">{errors.entity_type}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Country
          </label>
          <input
            type="text"
            value={formData.country_residence_or_incorporation || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                country_residence_or_incorporation: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Primary Email
          </label>
          <input
            type="email"
            value={formData.email1 || ''}
            onChange={(e) =>
              setFormData({ ...formData, email1: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email1 && (
            <p className="mt-1 text-sm text-red-400">{errors.email1}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Secondary Email
          </label>
          <input
            type="email"
            value={formData.email2 || ''}
            onChange={(e) =>
              setFormData({ ...formData, email2: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email2 && (
            <p className="mt-1 text-sm text-red-400">{errors.email2}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-white">
            Address
          </label>
          <textarea
            value={formData.address || ''}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {errors.submit && (
        <div className="rounded-md bg-red-900/50 border border-red-500/50 p-4">
          <p className="text-sm text-red-200">{errors.submit}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Entity'}
        </button>
      </div>
    </form>
  );
}