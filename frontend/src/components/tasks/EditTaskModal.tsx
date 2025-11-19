import React from 'react';
import { Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { TaskForm } from './TaskForm';
import type { Task } from '../../types';

interface EditTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: Task | null;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  visible,
  onClose,
  onSuccess,
  task,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center">
          <EditOutlined className="mr-2 text-primary" />
          <span>Edit Task</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <TaskForm
        mode="edit"
        task={task}
        onSuccess={() => {
          onSuccess();
          onClose();
        }}
      />
    </Modal>
  );
};
