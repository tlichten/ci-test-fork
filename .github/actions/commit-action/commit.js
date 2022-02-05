const {
  GITHUB_REPOSITORY,
  GITHUB_TOKEN
} = process.env;
// parsing the owner and repo name from GITHUB_REPOSITORY
const [owner, repo] = GITHUB_REPOSITORY.split('/');
const repoInfo = { owner, repo };
const branch = "master";
const createBranch = true;

console.log(repoInfo);


const { Octokit } = require("@octokit/core");
const {
  createOrUpdateTextFile,
  composeCreateOrUpdateTextFile,
} = require("@octokit/plugin-create-or-update-text-file");

const MyOctokit = Octokit.plugin(createOrUpdateTextFile);
const octokit = new MyOctokit();


const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
  try {
    const {
      updated,
      data: { commit },
    } = await octokit.createOrUpdateTextFile({
      owner,
      repo,
      path: "test.txt",
      content: "content here",
      message: "update test.txt",
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
