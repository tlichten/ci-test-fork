const {
  GITHUB_REPOSITORY,
  GITHUB_TOKEN
} = process.env;
// parsing the owner and repo name from GITHUB_REPOSITORY
const [owner, repo] = GITHUB_REPOSITORY.split('/');
const repoInfo = { owner, repo };
const branch = "PR-issue";
const createBranch = true;

let { Octokit } = require("@octokit/rest");
Octokit = Octokit.plugin(require("octokit-commit-multiple-files"));

const octokit = new Octokit();

const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
  try {
    const commits = await octokit.rest.repos.createOrUpdateFiles({
      owner,
      repo,
      branch,
      createBranch,
      changes: [
        {
          message: "This is a separate commit",
          files: {
            "second.md": "Where should we go today?",
          },
        },
      ],
    });
  } catch (error) {
      core.setFailed(error.message);
  }
};

main();
