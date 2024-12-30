import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Entity } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { EntityForm } from '../components/forms/EntityForm';

function Entities() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEntities = async () => {
    try {
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntities(data || []);
    } catch (error) {
      console.error('Error fetching entities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entities"
        description="Manage investors, partners, and companies"
      />

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {showForm ? 'Cancel' : 'Add Entity'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg shadow-lg rounded-lg p-6 border border-white/10">
          <EntityForm
            onSuccess={() => {
              setShowForm(false);
              fetchEntities();
            }}
          />
        </div>
      )}

      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg shadow-lg rounded-lg border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Entity ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Legal Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Primary Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-white">
                    Loading...
                  </td>
                </tr>
              ) : entities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-white">
                    No entities found
                  </td>
                </tr>
              ) : (
                entities.map((entity) => (
                  <tr key={entity.id} className="text-white/90 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {entity.entity_uuid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {entity.entity_legal_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {entity.entity_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {entity.country_residence_or_incorporation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {entity.email1}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Entities;