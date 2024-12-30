import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Document } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { DocumentForm } from '../components/forms/DocumentForm';
import { formatDate } from '../utils/format';

function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          project:projects(project_name),
          entity:entities(entity_legal_name),
          transaction:fact_transactions(transaction_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const getRelatedItem = (doc: Document) => {
    if (doc.entity) return `Entity: ${(doc.entity as any).entity_legal_name}`;
    if (doc.project) return `Project: ${(doc.project as any).project_name}`;
    if (doc.transaction) return `Transaction: ${(doc.transaction as any).transaction_id}`;
    return '-';
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Documents" 
        description="Manage and track investment-related documents"
      />

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {showForm ? 'Cancel' : 'Upload Document'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg shadow-lg rounded-lg p-6 border border-white/10">
          <DocumentForm
            onSuccess={() => {
              setShowForm(false);
              fetchDocuments();
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
                  Document ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Related To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-white">
                    Loading...
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-white">
                    No documents found
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="text-white/90 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {doc.document_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {doc.document_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {doc.document_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getRelatedItem(doc)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(doc.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={doc.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        View
                      </a>
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

export default Documents;