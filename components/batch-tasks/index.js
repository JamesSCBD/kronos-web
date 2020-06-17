import ExportEmails from './ExportEmails';
import MultiDelete from './MultiDelete';
import ExportToExcel from './ExportToExcel';

export default {
  ExportEmails,
  ExportToExcel,
  MultiDelete,
};

export function taskHasContexts(task, ...requiredContexts) {
  return (requiredContexts || []).every((c) => task.taskAttributes.contexts.includes(c));
}
