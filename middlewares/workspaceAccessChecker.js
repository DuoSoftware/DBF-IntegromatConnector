const ProjectWorker = require('../workers/project');

module.exports = function () {
  return async (req, res, next) => {
    if (req.user) {
      if (req.headers.hasOwnProperty("companyinfo")) {
          let [workspaceId, projectId] = req.headers["companyinfo"].split(':');
          workspaceId = parseInt(workspaceId);
          projectId = parseInt(projectId);
          
          let project = await ProjectWorker.GetOne({
            tenant: workspaceId,
            company: projectId,
            users: {$elemMatch: {userId: req.user["cognito:username"]}}
          });

          if (project) {
            req.user.workspaceId = workspaceId;
            req.user.projectId = projectId;
            req.user["project"] = project;
            next();
          } else {
            next(new Error(`Requested project not found or user doesn't have access permission for project`));
          }
      } else {
        next(new Error("companyInfo header not contains in the request."));
      }
    } else {
      next(new Error("No authenticated user found."));
    }
  };
}