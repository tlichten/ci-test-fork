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

    const issue_number = issue.number;
    
    const issue_raw = await octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issue_number,
      mediaType: {
        format: "html",
      }
    });
    
    console.log(issue_raw);
    
    const cheerio = require('cheerio');
    
    const $ = cheerio.load(issue_raw.data.body_html);
    let res = {};
    $('h3').each(function(i, elm) {
        const label = $(this).text().trim();
        console.log('Processing ' + label);
        const siblingContent = $(this).next();
        
        if (siblingContent.get(0).tagName.match(/^p$/)) {
          // single value 
          const value = siblingContent.text().trim();
          res[label] = value;
        } else {
          // value list
          let resList = {};
           siblingContent.children('li').each(function(i, elm) {
            const label = $(this).text().trim();
            if ($(elm).children('input').first().attr('checked'))
              resList[label] = true;
             else resList[label] = false;
           });
        }
    });
    
    console.log(res);
    const YAML = require('yaml');

    const doc = new YAML.Document();
    doc.contents = res;
    const {
      updated,
      data
    } = await octokit.createOrUpdateTextFile({
      owner,
      repo,
      path: "test.txt",
      content: doc.toString(),
      message: "update for issue " + issue_number,
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
