# Inspect before editing or switching branches
git status
git switch -c feature/expense-validation
# Make and test the intended changes in your editor
git diff
git add expenses.py README.md
git diff --cached
git commit -m "Reject invalid expense amounts with a useful message"
git log -1 --oneline
