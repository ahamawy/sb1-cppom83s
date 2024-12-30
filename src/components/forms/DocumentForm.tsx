import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Document, Project, Entity, Transaction } from '../../types';

interface DocumentFormProps {
  onSuccess?: () => void;
  initialData?: Partial<Document>;
  defaultType?: 'PROJECT' | 'TRANSACTION' | 'KYC';
  defaultEntityId?: string;
  defaultProjectId?: string;
  defaultTransactionId?: string;
}

export function DocumentForm({ 
  onSuccess, 
  initialData,
  defaultType,
  defaultEntityId,
  defaultProjectId,
  defaultTransactionId
}: DocumentFormProps) {
  const [formData, setFormData] = useState<Partial<Document>>({
    ...initialData,
    document_type: defaultType || initialData?.document_type,
    entity_id: defaultEntityId || initialData?.entity_id,
    project_id: defaultProjectId || initialData?.project_id,
    transaction_id: defaultTransactionId || initialData?.transaction_id
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    const [
      { data: projectsData },
      { data: entitiesData },
      { data: transactionsData }
    ] = await Promise.all([
      supabase.from('projects').select('*'),
      supabase.from('entities').select('*'),
      supabase.from('fact_transactions').select('*')
    ]);

    setProjects(projectsData || []);
    setEntities(entitiesData || []);
    setTransactions(transactionsData || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Save document metadata to database
      const { data, error } = await supabase
        .from('documents')
        .upsert([{
          ...formData,
          document_id: formData.document_id || `DOC-${Date.now()}`,
          document_url: publicUrl,
          document_name: file.name
        }])
        .select();

      if (error) throw error;
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-white">
            Document Type
          </label>
          <select
            required
            value={formData.document_type || ''}
            onChange={(e) =>
              setFormData({ ...formData, document_type: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Type</option>
            <option value="PROJECT">Project Document</option>
            <option value="TRANSACTION">Transaction Document</option>
            <option value="KYC">KYC Document</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {(formData.document_type === 'PROJECT' || !formData.document_type) && (
          <div>
            <label className="block text-sm font-medium text-white">
              Related Project
            </label>
            <select
              value={formData.project_id || ''}
              onChange={(e) =>
                setFormData({ ...formData, project_id: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Project</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.project_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.document_type === 'TRANSACTION' && (
          <div>
            <label className="block text-sm font-medium text-white">
              Related Transaction
            </label>
            <select
              required
              value={formData.transaction_id || ''}
              onChange={(e) =>
                setFormData({ ...formData, transaction_id: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Transaction</option>
              {transactions?.map((transaction) => (
                <option key={transaction.id} value={transaction.id}>
                  {transaction.transaction_id}
                </option>
              ))}
            </select>
          </div>
        )}

        {(formData.document_type === 'KYC' || !formData.document_type) && (
          <div>
            <label className="block text-sm font-medium text-white">
              Related Entity
            </label>
            <select
              value={formData.entity_id || ''}
              onChange={(e) =>
                setFormData({ ...formData, entity_id: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Entity</option>
              {entities?.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.entity_legal_name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-white">
            Document File
          </label>
          <input
            type="file"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-white
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-600 file:text-white
              hover:file:bg-indigo-700"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
    </form>
  );
}