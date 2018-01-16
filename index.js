module.exports = class Lib {

	constructor(options){
		this.url = "url" in  options ? options.url : null;
		this.token = "token" in options ? options.token : null;
		this.start_date = "start_date" in options ? options.start_date: null;
		this.end_date = "end_date" in options ? options.end_date: null;
	}

	/**
	 * @fetches_projects_with_recent_activity
	 */
	get_recent_projects(callback) {
		try {
			let start_date = this.start_date;
			let end_date = this.end_date;

			let gitlab = this.init_gitlab();
			gitlab.projects.all(function (projects) {
				/*let projects_filtered = projects.map(function (project) {
					return {
						project_id: project.id,
						name: project.name,
						last_activity_at: project.last_activity_at
					};
				});*/
				let projects_filtered = projects.filter(function (project) {
					if (new Date(project["last_activity_at"]) >= start_date && new Date(project["last_activity_at"]) <= end_date) {
						return project;
					}
				}).map(function (project) {
					return {
						project_id: project.id,
						name: project.name,
						last_activity_at: project.last_activity_at
					};
				});
				return callback(null, projects_filtered);
			});
		} catch (error) {
			return callback(error);
		}
	}

	/**
	 * @fetches_recent_commits_based_on_project_ids
	 */

	get_recent_commits(options, callback) {
		try {
			let start_date = this.start_date;
			let end_date = this.end_date;

			let gitlab = this.init_gitlab();
			gitlab.projects.listCommits({
				id: options.project_id
			}, function (commits) {
				let commits_filtered = commits.filter(function (commit) {
					if (new Date(commit["created_at"]) >= start_date && new Date(commit["created_at"]) <= end_date
						&& commit["author_email"] === options.email) {
						return commit;
					}
				});
				callback(null, commits_filtered);
			});
		} catch (error) {
			return callback(error);
		}
	}

	/**
	* @initializes_gitlab_account_with_credentials
	* */
	init_gitlab(){
		return require('gitlab')({
			url: this.url,
			token: this.token
		});
	}
};
