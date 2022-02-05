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
    console.log("running");
    const issue = github.context.payload.issue;
    console.log(issue);
    const issue_number = issue.number;
    
    const issue_raw = await octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issue_number,
      mediaType: {
        format: "html",
      }
    });
    console.log(issue_raw.data);
   
    console.log(issue_raw.data.body_html);
    
    const cheerio = require('cheerio');
    
    const $ = cheerio.load(issue_raw.data.body_html);
    $('h3').each(function(i, elm) {
        console.log($(this).text());
        console.log($(this).next().text());
    });
    
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
