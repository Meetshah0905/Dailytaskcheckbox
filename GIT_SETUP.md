# Git Setup Instructions

Follow these steps to commit and push your code to the "Dailytaskcheckbox" GitHub repository.

## Step 1: Navigate to the Project Directory

Open PowerShell or Command Prompt and navigate to the RoutineFlow folder:

```bash
cd "C:\Users\Meet's Den\Music\Day list check\RoutineFlow"
```

## Step 2: Initialize Git (if not already initialized)

```bash
git init
```

## Step 3: Add All Files

```bash
git add .
```

## Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: RoutineFlow app with Netlify deployment config"
```

## Step 5: Add Remote Repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/Dailytaskcheckbox.git
```

Or if you're using SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/Dailytaskcheckbox.git
```

## Step 6: Push to GitHub

If this is the first push:

```bash
git branch -M main
git push -u origin main
```

If the repository already exists and has content:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## Alternative: If Repository Already Exists

If you've already initialized the repository and just want to add/commit new files:

```bash
git add .
git commit -m "Add Netlify deployment configuration"
git push origin main
```

## Troubleshooting

### If you get "remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/Dailytaskcheckbox.git
```

### If you need to authenticate:
- GitHub now requires a Personal Access Token (PAT) instead of passwords
- Generate one at: https://github.com/settings/tokens
- Use the token as your password when prompted

### To check your current status:
```bash
git status
git remote -v
```

