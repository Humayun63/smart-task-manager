import React, { useState } from 'react';
import { Modal, Steps, message, Button, List, Tag } from 'antd';
import {
  CheckCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { taskService } from '../../services';
import { activityLogService } from '../../services/activityLog.service';
import type { Task, TeamMember } from '../../types';

interface ReassignTasksModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teamId: string;
  teamName: string;
  members: TeamMember[];
  tasks: Task[];
}

interface ReassignmentPlan {
  task: Task;
  fromMember: TeamMember;
  toMember: TeamMember;
  reason: string;
}

export const ReassignTasksModal: React.FC<ReassignTasksModalProps> = ({
  visible,
  onClose,
  onSuccess,
  teamId,
  teamName,
  members,
  tasks,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reassignmentPlan, setReassignmentPlan] = useState<ReassignmentPlan[]>([]);

  const calculateReassignmentPlan = (): ReassignmentPlan[] => {
    const plan: ReassignmentPlan[] = [];

    // Calculate current workload for each member
    const memberWorkload = new Map<string, number>();
    members.forEach((member) => {
      const taskCount = tasks.filter((task) => task.assignedMember?.id === member.id).length;
      memberWorkload.set(member.id, taskCount);
    });

    // Identify overloaded members (tasks > capacity)
    const overloadedMembers = members.filter((member) => {
      const workload = memberWorkload.get(member.id) || 0;
      return workload > member.capacity;
    });

    // Find members with free capacity
    const availableMembers = members.filter((member) => {
      const workload = memberWorkload.get(member.id) || 0;
      return workload < member.capacity;
    });

    if (availableMembers.length === 0) {
      return plan; // No members with free capacity
    }

    // For each overloaded member, move Low/Medium priority tasks
    overloadedMembers.forEach((overloadedMember) => {
      const memberTasks = tasks.filter(
        (task) => task.assignedMember?.id === overloadedMember.id
      );

      // Filter only Low and Medium priority tasks
      const reassignableTasks = memberTasks.filter(
        (task) => task.priority === 'Low' || task.priority === 'Medium'
      );

      // Sort by priority (Low first, then Medium)
      reassignableTasks.sort((a, b) => {
        const priorityOrder = { Low: 0, Medium: 1, High: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      // Reassign tasks until member is no longer overloaded
      let currentWorkload = memberWorkload.get(overloadedMember.id) || 0;

      for (const task of reassignableTasks) {
        if (currentWorkload <= overloadedMember.capacity) {
          break; // Member is no longer overloaded
        }

        // Find member with lowest workload
        let bestMember: TeamMember | undefined;
        let lowestWorkload = Infinity;

        for (const member of availableMembers) {
          const workload = memberWorkload.get(member.id) || 0;
          if (workload < member.capacity && workload < lowestWorkload) {
            lowestWorkload = workload;
            bestMember = member;
          }
        }

        if (bestMember) {
          plan.push({
            task,
            fromMember: overloadedMember,
            toMember: bestMember,
            reason: `${overloadedMember.name} is overloaded (${currentWorkload}/${overloadedMember.capacity})`,
          });

          // Update workload tracking
          memberWorkload.set(overloadedMember.id, currentWorkload - 1);
          memberWorkload.set(bestMember.id, (memberWorkload.get(bestMember.id) || 0) + 1);
          currentWorkload -= 1;
        } else {
          break; // No more available members
        }
      }
    });

    return plan;
  };

  const handleStartReassignment = () => {
    const plan = calculateReassignmentPlan();
    setReassignmentPlan(plan);

    if (plan.length === 0) {
      message.info('No reassignment needed. All members are within capacity or no available members.');
      onClose();
      return;
    }

    setCurrentStep(1);
  };

  const handleExecuteReassignment = async () => {
    if (reassignmentPlan.length === 0) return;

    setLoading(true);
    setCurrentStep(2);

    try {
      // Execute reassignments one by one
      for (const plan of reassignmentPlan) {
        await taskService.updateTask(plan.task.id, {
          assignedMember: plan.toMember.id,
        });

        // Log activity
        await activityLogService.createActivityLog({
          message: `Task "${plan.task.title}" reassigned from ${plan.fromMember.name} to ${plan.toMember.name}`,
          project: plan.task.project.id,
          task: plan.task.id,
          team: teamId,
        });
      }

      setCurrentStep(3);
      message.success(`Successfully reassigned ${reassignmentPlan.length} tasks`);

      setTimeout(() => {
        onSuccess();
        handleReset();
      }, 1500);
    } catch (error: any) {
      message.error('Failed to reassign tasks');
      console.error('Reassignment error:', error);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setReassignmentPlan([]);
    setLoading(false);
    onClose();
  };

  const steps = [
    {
      title: 'Confirm',
      icon: currentStep > 0 ? <CheckCircleOutlined /> : undefined,
    },
    {
      title: 'Review Plan',
      icon: currentStep > 1 ? <CheckCircleOutlined /> : currentStep === 1 ? undefined : undefined,
    },
    {
      title: 'Execute',
      icon: currentStep === 2 ? <LoadingOutlined /> : currentStep > 2 ? <CheckCircleOutlined /> : undefined,
    },
    {
      title: 'Complete',
      icon: currentStep === 3 ? <CheckCircleOutlined /> : undefined,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'blue';
      default:
        return 'default';
    }
  };

  return (
    <Modal
      title="Reassign Tasks"
      open={visible}
      onCancel={loading ? undefined : handleReset}
      width={700}
      footer={null}
      maskClosable={!loading}
      closable={!loading}
    >
      <div className="space-y-6">
        <Steps current={currentStep} items={steps} size="small" />

        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="flex mt-4 items-start gap-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <ExclamationCircleOutlined className="text-yellow-600 mt-1" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">About Task Reassignment</p>
                <ul className="text-yellow-700 space-y-1 ml-4 list-disc">
                  <li>Only <strong>Low</strong> and <strong>Medium</strong> priority tasks will be moved</li>
                  <li><strong>High</strong> priority tasks will never be reassigned</li>
                  <li>Tasks will be moved from overloaded members to those with free capacity</li>
                  <li>Each reassignment will be logged to the activity log</li>
                </ul>
              </div>
            </div>

            <p className="text-text-muted">
              Are you sure you want to reassign tasks for team <strong>{teamName}</strong>?
            </p>

            <div className="flex justify-end gap-2">
              <Button onClick={handleReset}>Cancel</Button>
              <Button type="primary" onClick={handleStartReassignment}>
                Analyze & Continue
              </Button>
            </div>
          </div>
        )}

        {currentStep === 1 && reassignmentPlan.length > 0 && (
          <div className="space-y-4">
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>{reassignmentPlan.length}</strong> task(s) will be reassigned
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <List
                dataSource={reassignmentPlan}
                renderItem={(plan) => (
                  <List.Item className="!px-4 !py-3 bg-gray-50 mb-2 rounded !bg-[#001529]">
                    <div className="w-full space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-text-primary">{plan.task.title}</p>
                          <p className="text-sm text-text-muted">{plan.task.project.name}</p>
                        </div>
                        <Tag color={getPriorityColor(plan.task.priority)}>{plan.task.priority}</Tag>
                      </div>
                      <div className="text-sm">
                        <p className="text-text-muted">
                          From: <strong>{plan.fromMember.name}</strong> →{' '}
                          To: <strong>{plan.toMember.name}</strong>
                        </p>
                        <p className="text-xs text-text-muted italic mt-1">{plan.reason}</p>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={handleReset} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleExecuteReassignment} disabled={loading}>
                Execute Reassignment
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center py-8">
            <LoadingOutlined className="text-4xl text-primary mb-4" />
            <p className="text-text-primary">Reassigning tasks...</p>
            <p className="text-text-muted text-sm mt-2">
              Processing {reassignmentPlan.length} task(s)
            </p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center py-8">
            <CheckCircleOutlined className="text-4xl text-green-500 mb-4" />
            <p className="text-text-primary font-medium">Reassignment Complete!</p>
            <p className="text-text-muted text-sm mt-2">
              Successfully reassigned {reassignmentPlan.length} task(s)
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
