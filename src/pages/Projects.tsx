import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../types/project';
import { PageHeader } from '../components/ui/PageHeader';
import { ProjectForm } from '../components/forms/ProjectForm';
import { formatCurrency } from '../utils/format';

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Projects" 
        description="Manage your investment projects"
      />

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg shadow-lg rounded-lg p-6 border border-white/10">
          <ProjectForm
            onSuccess={() => {
              setShowForm(false);
              fetchProjects();
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
                  Project ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Committed Capital
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
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-white">
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="text-white/90 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {project.project_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {project.project_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {project.project_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {project.project_seller || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(project.project_committed_capital_usd)}
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

export default Projects;