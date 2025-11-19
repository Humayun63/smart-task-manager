import React from 'react';
import { Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TaskForm } from './TaskForm';

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  visible,
  onClose,
  onSuccess,
  projectId,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center">
          <PlusOutlined className="mr-2 text-primary" />
          <span>Create New Task</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <TaskForm
        mode="create"
        preSelectedProjectId={projectId}
        onSuccess={() => {
          onSuccess();
          onClose();
        }}
      />
    </Modal>
  );
};
