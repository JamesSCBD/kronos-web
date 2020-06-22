import ExportEmails from './ExportEmails';
import MultiDelete from './MultiDelete';
import ExportToExcel from './ExportToExcel';
import SelectAllRecords from './SelectAllRecords';

export default {
  ExportEmails,
  ExportToExcel,
  MultiDelete,
  SelectAllRecords,
};

export function taskHasContexts(task, ...requiredContexts) {
  return (requiredContexts || []).every((c) => task.taskAttributes.contexts.includes(c));
}
