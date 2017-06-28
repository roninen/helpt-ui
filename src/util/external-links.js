
export default {
  github: {
    link: (task) => {
      return {
        url: `https://github.com/${task.workspace.origin_id}/issues/${task.origin_id}`,
        text: `task.workspace.origin_id/{task.origin_id}`
      };
    }
  },
  trello: {
    link: (task) => {
      return {
        url: `https://trello.com/c/${task.origin_id}`,
        text: task.workspace.name
      };
    }
  }
};
