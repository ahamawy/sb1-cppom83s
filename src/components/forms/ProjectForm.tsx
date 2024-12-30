import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Project, PROJECT_TYPES } from '../../types/project';
import { validateProjectForm } from '../../utils/validation';

interface ProjectFormProps {
  onSuccess?: () => void;
  initialData?: Partial<Project>;
}

interface FormErrors {
  project_name?: string;
  project_type?: string;
  project_committed_capital_usd?: string;
  submit?: string;
}

export function ProjectForm({ onSuccess, initialData }: ProjectFormProps) {
  const [formData, setFormData] = useState<Partial<Project>>(initialData || {});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validation = validateProjectForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      // Prepare the data with correct column names
      const projectData = {
        project_name: formData.project_name?.trim(),
        project_type: formData.project_type?.trim(),
        project_seller: formData.project_seller?.trim(),
        project_committed_capital_usd: formData.project_committed_capital_usd,
        project_description: formData.project_description?.trim()
      };

      const { error } = await supabase
        .from('projects')
        .upsert([projectData])
        .select();

      if (error) throw error;
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error saving project:', error);
      setErrors({
        submit: error.message || 'Failed to save project'
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
            Project Name
          </label>
          <input
            type="text"
            required
            value={formData.project_name || ''}
            onChange={(e) =>
              setFormData({ ...formData, project_name: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.project_name && (
            <p className="mt-1 text-sm text-red-400">{errors.project_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Project Type
          </label>
          <select
            required
            value={formData.project_type || ''}
            onChange={(e) =>
              setFormData({ ...formData, project_type: e.target.value as Project['project_type'] })
            }
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Type</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.project_type && (
            <p className="mt-1 text-sm text-red-400">{errors.project_type}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Project Seller
          </label>
          <input
            type="text"
            value={formData.project_seller || ''}
            onChange={(e) =>
              setFormData({ ...formData, project_seller: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Committed Capital (USD)
          </label>
          <input
            type="number"
            value={formData.project_committed_capital_usd || ''}
            onChange={(e) =>
              setFormData({ 
                ...formData, 
                project_committed_capital_usd: parseFloat(e.target.value) 
              })
            }
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.project_committed_capital_usd && (
            <p className="mt-1 text-sm text-red-400">{errors.project_committed_capital_usd}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-white">
            Description
          </label>
          <textarea
            value={formData.project_description || ''}
            onChange={(e) =>
              setFormData({ ...formData, project_description: e.target.value })
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
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  );
}