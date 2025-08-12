import React from 'react';
import { FolderOpen, Plus, Calendar, Users as ProjectUsers } from 'lucide-react';
import { apiUtils } from '../services/api';

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: 'TechCorp Website Development',
      client: 'TechCorp USA',
      status: 'active',
      progress: 75,
      team: 4,
      deadline: '2025-03-15T00:00:00Z'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your active projects</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card">
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-6 w-6 text-purple-600" />
                </div>
                <span className="badge badge-success">{project.status}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-4">Client: {project.client}</p>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <ProjectUsers className="h-4 w-4 mr-1" />
                  {project.team} team members
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {apiUtils.formatDate(project.deadline)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;