const commentInput = document.getElementById('comment-input');
const postButton = document.getElementById('post-button');
const commentSection = document.getElementById('comment-section');
const toxicityScoreSpan = document.getElementById('toxicity-score');

// Replace with your actual Perspective API key
// const apiKey = Perspective_API_Key;

// Choose a suitable toxicity threshold (0.0 to 1.0)
const toxicityThreshold = 0.1; // Experiment to find the right balance

let currentText = ''; // Track the current text being typed
let lastToxicity = null; // Store the last known toxicity score
let isFetchingToxicity = false; // Flag to track ongoing API call

function analyzeText(text) {
  if (text === currentText) return; // Avoid redundant calls

  currentText = text; // Update tracked text
  isFetchingToxicity = true; // Set flag to indicate ongoing API call

  fetch('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=' + apiKey, {
    method: 'POST',
    body: JSON.stringify({
      comment: { text },
      languages: ['en'],
      requestedAttributes: { TOXICITY: {} },
    }),
  })
  .then(response => response.json())
  .then(data => {
    const toxicity = data.attributeScores.TOXICITY.summaryScore.value;
    console.log(toxicity);
    lastToxicity = toxicity;
    postButton.disabled = toxicity >= toxicityThreshold;
    isFetchingToxicity = false;  // Reset flag after successful API call
    const score = toxicity !== null ? toxicity : lastToxicity;
    updateToxicityScore(score);
  })
  .catch(error => {
    console.error(error);
    // Handle API errors gracefully (e.g., display a message to the user)
    isFetchingToxicity = false;  // Reset flag on error
  });
}

function updateToxicityScore(toxicity) {
  const textColor = toxicity >= toxicityThreshold ? 'red' : 'green';
  toxicityScoreSpan.textContent = `Toxicity Score: ${toxicity.toFixed(2)}`;
  toxicityScoreSpan.style.color = textColor;
}

commentInput.addEventListener('keyup', () => {
  const text = commentInput.value.trim();

  // Only initiate analysis if:
  // - There's no ongoing API call
  // - The text has changed significantly
  if (!isFetchingToxicity && Math.abs(text.length - currentText.length) >= 1) {
    analyzeText(text);
  } else {
    // If still waiting for API response (or text change is too small),
    // use the last known toxicity temporarily
    if (lastToxicity !== null) {
      postButton.disabled = lastToxicity >= toxicityThreshold;
      const score = toxicity !== null ? toxicity : lastToxicity;
      updateToxicityScore(score);
    }
  }
});

postButton.addEventListener('click', () => {
  const commentText = commentInput.value;

  // Create a new comment element with post and row IDs
  const comment = document.createElement('div');
  comment.classList.add('comment-container');
  const postId = document.getElementById('comment-section').childElementCount + 1;

  // Find an appropriate comment row to add the new comment
  let commentRow;
  const existingRows = document.querySelectorAll('.comment-row');

  // Check existing rows from left to right for available space
  for (const row of existingRows) {
    if (row.childElementCount < 3) {
      commentRow = row;
      break; // Exit the loop if a suitable row is found
    }
  }

  // If no row has less than 3 comments, create a new one
  if (!commentRow) {
    commentRow = document.createElement('div');
    commentRow.classList.add('comment-row');
    commentSection.insertBefore(commentRow, commentSection.firstChild); // Prepend for latest at top
  }

  // const rowId = Math.ceil(postId / 3); // Calculate row ID based on post count

  const postIdSpan = document.createElement('span');
  postIdSpan.classList.add('post-id');
  // postIdSpan.textContent = `post#${postId}`;
  const rowIdSpan = document.createElement('span');
  rowIdSpan.classList.add('row-id');
  // rowIdSpan.textContent = `row#${rowId}`;

  // Create elements for comment text
  const commentSpan = document.createElement('span');
  commentSpan.classList.add('comment-text');
  commentSpan.textContent = commentText;

  comment.appendChild(postIdSpan);
  comment.appendChild(rowIdSpan);
  comment.appendChild(commentSpan);

  // Prepend the new comment to the chosen row for left-side placement
  commentRow.insertBefore(comment, commentRow.firstChild);

  // Clear the input field and disable the post button again
  commentInput.value = '';
  postButton.disabled = true;
});