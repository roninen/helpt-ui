
export default {
  github: {
    link: (task) => {
      // Requires task.workspace to be expanded
      return `https://github.com/${task.workspace.organization}/${task.workspace.id}/issues/${task.origin_id}`;
    }
  },
  trello: {
  }
};
