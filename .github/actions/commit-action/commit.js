// working
const {
  GITHUB_REPOSITORY,
  GITHUB_TOKEN
} = process.env;
// parsing the owner and repo name from GITHUB_REPOSITORY
const [owner, repo] = GITHUB_REPOSITORY.split('/');

const { Octokit } = require("@octokit/rest");
const {
  createOrUpdateTextFile,
  composeCreateOrUpdateTextFile,
} = require("@octokit/plugin-create-or-update-text-file");

const MyOctokit = Octokit.plugin(createOrUpdateTextFile);
const octokit = new MyOctokit({auth: GITHUB_TOKEN});


const core = require('@actions/core');
const github = require('@actions/github');


const main = async () => {
  try {
    
    const issue = github.context.payload.issue
    if (!issue) return

    const [issue_id] = issue.id
    const issue_raw = await octokit.rest.issues.get({
      owner,
      repo,
      issue_id,
      mediaType: {
        format: "raw",
      }
    });
    console.log(issue_raw);
    
    const {
      updated,
      data
    } = await octokit.createOrUpdateTextFile({
      owner,
      repo,
      path: "test.txt",
      content: "content here",
      message: "update test.txt two",
    });

    if (updated) {
      console.log("test.txt updated via %s", data.commit.html_url);
    } else {
      console.log("test.txt already up to date");
    }
  } catch (error) {
      core.setFailed(error.message);
  }
};

main();
