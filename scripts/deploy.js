import { publish } from 'gh-pages';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

// Get the actual remote repository URL
function getRemoteUrl() {
  try {
    const remotes = execSync('git remote -v', { encoding: 'utf8' });
    const lines = remotes.trim().split('\n');
    for (const line of lines) {
      const [name, url] = line.split('\t');
      if (name === 'origin' && url.includes('github.com')) {
        return url.split(' ')[0];
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Configure gh-pages with dynamic remote detection
const remoteUrl = getRemoteUrl();

if (!remoteUrl) {
  console.error('❌ No GitHub remote repository found!');
  console.log('\n📋 To fix this:');
  console.log('1. Make sure your project is connected to a GitHub repository');
  console.log('2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git');
  console.log('3. Then run: npm run deploy');
  console.log('\n🔄 Or use manual deployment:');
  console.log('   git checkout gh-pages');
  console.log('   git rm -rf .');
  console.log('   Copy files from dist/ to root');
  console.log('   git add .');
  console.log('   git commit -m "Deploy to GitHub Pages"');
  console.log('   git push origin gh-pages');
  console.log('   git checkout main');
  process.exit(1);
}

const options = {
  dotfiles: false,
  add: false,
  src: ['**/*'],
  dest: '.',
  message: 'Deploy to GitHub Pages',
  silent: false,
  branch: 'gh-pages',
  repo: remoteUrl,
  user: {
    name: 'GitHub Action',
    email: 'action@github.com'
  },
  remove: '.',
  push: true,
  history: true
};

console.log('🚀 Starting deployment to GitHub Pages...');
console.log(`📍 Repository: ${remoteUrl}`);

publish('dist', options, (err) => {
  if (err) {
    console.error('❌ Deployment failed:', err.message);
    
    // Check if it's a remote issue
    if (err.message.includes('repository') || err.message.includes('origin')) {
      console.log('\n🔧 Setting up GitHub remote...');
      console.log('Please ensure:');
      console.log('1. You have a GitHub repository created');
      console.log('2. Your local repository is connected to GitHub');
      console.log('3. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git');
    }
    
    // Fallback to manual git deployment
    console.log('\n🔄 Trying manual git deployment...');
    try {
      // Check current git status
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status) {
        console.log('⚠️  You have uncommitted changes. Please commit them first.');
        console.log('Run: git add . && git commit -m "Your changes"');
        process.exit(1);
      }

      // Check if gh-pages branch exists
      try {
        execSync('git show-ref --verify --quiet refs/heads/gh-pages');
        console.log('📋 gh-pages branch exists, updating...');
      } catch {
        console.log('📋 Creating gh-pages branch...');
        execSync('git checkout --orphan gh-pages', { stdio: 'ignore' });
        execSync('git rm -rf .', { stdio: 'ignore' });
        execSync('git commit --allow-empty -m "Initial gh-pages commit"', { stdio: 'ignore' });
        execSync('git checkout main', { stdio: 'ignore' });
      }

      // Manual deployment steps
      console.log('\n📦 Manual deployment instructions:');
      console.log('1. git checkout gh-pages');
      console.log('2. git rm -rf .');
      console.log('3. Copy all files from dist/ to root directory');
      console.log('4. git add .');
      console.log('5. git commit -m "Deploy to GitHub Pages"');
      console.log('6. git push origin gh-pages');
      console.log('7. git checkout main');
      
    } catch (manualErr) {
      console.error('❌ Manual deployment also failed:', manualErr.message);
    }
  } else {
    console.log('✅ Successfully deployed to GitHub Pages!');
    console.log('🌐 Your site should be available at:');
    console.log('   https://sahilthakre215.github.io/LeafYGo-Goodness-that-Grows/');
  }
});
