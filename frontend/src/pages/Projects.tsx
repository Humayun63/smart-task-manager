import React, { useState, useEffect } from 'react';
import { Button, Table, Typography, message, Tag, Dropdown, Modal, Card } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ProjectOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { projectService, activityLogService } from '../services';
import type { Project } from '../types';
import { CreateProjectModal, EditProjectModal } from '../components/projects';
import { formatDistanceToNow } from 'date-fns';

const { Title } = Typography;

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialTeamId, setInitialTeamId] = useState<string | undefined>(undefined);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      setProjects(response.data.projects);
    } catch (error: any) {
      message.error('Failed to load projects');
      console.error('Projects fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    
    // Check if navigated with selectedTeamId state
    const state = location.state as { selectedTeamId?: string };
    if (state?.selectedTeamId) {
      setInitialTeamId(state.selectedTeamId);
      setCreateModalVisible(true);
      // Clear the state to prevent reopening on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      setDeleteLoading(true);
      await projectService.deleteProject(projectToDelete.id);
      
      // Log activity
      await activityLogService.createActivityLog({
        message: `Project "${projectToDelete.name}" was deleted`,
        entity: 'project',
        entityId: projectToDelete.id,
        team: projectToDelete.team.id,
      });
      
      message.success('Project deleted successfully');
      setDeleteModalVisible(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to delete project';
      message.error(errorMsg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setEditModalVisible(true);
  };

  const handleView = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleProjectCreated = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const columns: ColumnsType<Project> = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Project) => (
        <div>
          <div className="flex items-center">
            <ProjectOutlined className="mr-2 text-primary" />
            <span 
              className="font-medium cursor-pointer hover:text-primary hover:underline"
              onClick={() => handleView(record.id)}
            >
              {name}
            </span>
          </div>
          <div className="text-sm text-text-muted mt-1 line-clamp-1">
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Team',
      dataIndex: ['team', 'name'],
      key: 'team',
      width: 200,
      responsive: ['md'] as any,
      render: (teamName: string, record: Project) => (
        <div className="flex items-center">
          <TeamOutlined className="mr-2 text-blue-500" />
          <span 
            className="cursor-pointer hover:text-primary hover:underline"
            onClick={() => navigate(`/teams/${record.team.id}`)}
          >
            {teamName}
          </span>
        </div>
      ),
    },
    {
      title: 'Owner',
      dataIndex: ['owner', 'name'],
      key: 'owner',
      width: 150,
      responsive: ['lg'] as any,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      responsive: ['md'] as any,
      render: (date: string) => formatDistanceToNow(new Date(date), { addSuffix: true }),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: Project) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                label: 'View Details',
                icon: <EyeOutlined />,
                onClick: () => handleView(record.id),
              },
              {
                key: 'edit',
                label: 'Edit Project',
                icon: <EditOutlined />,
                onClick: () => handleEdit(record),
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                label: 'Delete Project',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteClick(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <Title level={2} className="!mb-2 !text-xl md:!text-2xl">
            Projects
          </Title>
          <p className="text-text-muted text-sm md:text-base">
            Organize your work into projects
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setCreateModalVisible(true)}
          className="w-full sm:w-auto"
        >
          Create Project
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="id"
          loading={loading}
          scroll={{ x: 768 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} projects`,
            responsive: true,
          }}
        />
      </div>

      <CreateProjectModal
        visible={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false);
          setInitialTeamId(undefined);
        }}
        onSuccess={handleProjectCreated}
        initialTeamId={initialTeamId}
      />

      <EditProjectModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedProject(null);
        }}
        onSuccess={fetchProjects}
        project={selectedProject}
      />

      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-red-500" />
            <span>Delete Project</span>
          </div>
        }
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setProjectToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: deleteLoading }}
        cancelButtonProps={{ disabled: deleteLoading }}
        confirmLoading={deleteLoading}
        centered
      >
        <p className="text-text-primary my-4">
          Are you sure you want to delete <strong>{projectToDelete?.name}</strong>?
        </p>
        <p className="text-text-muted text-sm">
          This action cannot be undone. All tasks associated with this project will remain but will be unlinked.
        </p>
      </Modal>
    </div>
  );
};
