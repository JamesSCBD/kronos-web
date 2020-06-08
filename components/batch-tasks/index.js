import ExportEmails from '~/components/ExportEmails';
import MultiDeleteModal from '~/components/MultiDeleteModal';

export default {
  ExportEmails,
  MultiDeleteModal,
};

export function taskHasContexts(task, ...requiredContexts) {
  return (requiredContexts || []).every((c) => task.taskAttributes.contexts.includes(c));
}
