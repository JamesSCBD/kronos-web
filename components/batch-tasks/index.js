import ExportEmails from '~/components/ExportEmails';
import MultiDeleteModal from '~/components/MultiDeleteModal';
import ExportModal from '~/components/ExportModal';

export default {
  ExportEmails,
  MultiDeleteModal,
  ExportModal,
};

export function taskHasContexts(task, ...requiredContexts) {
  return (requiredContexts || []).every((c) => task.taskAttributes.contexts.includes(c));
}
