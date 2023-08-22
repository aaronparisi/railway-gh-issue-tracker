if (!process.env.GH_USER || !process.env.GH_AUTH_TOKEN) {
  console.error('Missing required environment variables.');
  process.exit(1); // Exit with an error code
}

const labels = [
  'bug',
  'documentation',
  'duplicate',
  'enhancement',
  'good first issue',
  'help wanted',
  'invalid',
  'question',
  'wontfix',
];

const threshold = 100;
