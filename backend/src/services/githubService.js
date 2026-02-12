const { Octokit } = require("@octokit/rest");

const octokit = new Octokit(); 

function parsePRUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    
    if (pathParts.length < 4 || pathParts[2] !== "pull") {
      throw new Error("Invalid PR URL");
    }

    return {
      owner: pathParts[0],
      repo: pathParts[1],
      prNumber: parseInt(pathParts[3])
    };
  } catch (error) {
    throw new Error("Invalid GitHub URL format");
  }
}

async function fetchPRDiff(url) {
  const { owner, repo, prNumber } = parsePRUrl(url);

  console.log(`Fetching PR #${prNumber} from ${owner}/${repo}...`);

  const response = await octokit.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
    mediaType: {
      format: "diff" 
    }
  });

  return response.data; 
}

module.exports = { fetchPRDiff };