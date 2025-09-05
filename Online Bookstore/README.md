# SoftwareEngineering
Repository for Software Engineering group project — deliverables, UML diagrams, use cases, and user stories



**Branching Strategy**

We can use a task-based branching model:

Each feature, or document gets its own branch.

Each team member creates their own branch for each task they're working on.



**Branch naming convention:**

```<type>/<task>-<your-name> ```

docs/useCase-createAccount-nima



**Examples:**

If nima is working on use case diagrams for user registration:
```
git checkout -b docs/use-case-registration-nima
```

This helps us avoid merge conflicts!




**Usefull commands:**


| Action                | Command                                      |
| --------------------- | -------------------------------------------- |
| Check current branch  | `git branch`                                 |
| Create new branch     | `git checkout -b branch-name`                |
| Switch to a branch    | `git checkout branch-name`                   |
| Add changes           | `git add .`                                  |
| Commit changes        | `git commit -m "message"`                    |
| Push branch to GitHub | `git push origin branch-name`                |
| Pull latest from main | `git checkout main` → `git pull origin main` |
