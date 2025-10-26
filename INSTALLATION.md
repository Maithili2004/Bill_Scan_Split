# ✅ Installation Checklist

Follow these steps to get the Bill Split application running on your machine.

## Prerequisites Check

- [ ] Node.js 18+ installed
  ```powershell
  node --version
  # Should show v18.x.x or higher
  ```

- [ ] npm installed (comes with Node.js)
  ```powershell
  npm --version
  # Should show version number
  ```

- [ ] Git installed (optional, for version control)
  ```powershell
  git --version
  ```

## Step-by-Step Installation

### Step 1: Navigate to Project Directory

```powershell
cd c:\Users\User\Desktop\bill-split
```

### Step 2: Install Dependencies

```powershell
npm install
```

**Expected output:**
- Installation progress for all packages
- Should complete without errors
- Creates `node_modules/` folder
- May take 1-3 minutes

**If you see errors:**
```powershell
# Try clearing cache
npm cache clean --force
npm install
```

### Step 3: Verify Installation

```powershell
# Check if node_modules exists
Test-Path node_modules
# Should return: True

# Check package-lock.json was created
Test-Path package-lock.json
# Should return: True
```

### Step 4: Start Development Server

```powershell
npm run dev
```

**Expected output:**
```
> bill-split@0.1.0 dev
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Environments: ...

 ✓ Ready in Xms
```

### Step 5: Open in Browser

- [ ] Open your browser
- [ ] Navigate to: http://localhost:3000
- [ ] You should see the "Scan Your Bill" page

## Verification Tests

### Test 1: Upload Page Loads
- [ ] Page displays "Scan Your Bill" heading
- [ ] Upload area is visible
- [ ] No console errors (F12 → Console tab)

### Test 2: Upload an Image
- [ ] Click the upload area
- [ ] Select any image file
- [ ] Image preview appears
- [ ] "Scan Bill" button appears

### Test 3: Run Tests
```powershell
# In a new terminal window
npm test
```

- [ ] Tests run successfully
- [ ] All parser tests pass
- [ ] All calculator tests pass

### Test 4: Build for Production
```powershell
npm run build
```

- [ ] Build completes without errors
- [ ] Creates `.next/` folder
- [ ] Shows build statistics

## Troubleshooting

### Issue: `npm install` fails

**Solution 1: Clear npm cache**
```powershell
npm cache clean --force
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
```

**Solution 2: Use different registry**
```powershell
npm install --registry=https://registry.npmjs.org/
```

### Issue: Port 3000 already in use

**Solution: Use different port**
```powershell
npm run dev -- -p 3001
```

Then open: http://localhost:3001

### Issue: TypeScript errors on first run

**This is normal!** TypeScript errors will disappear after:
1. `npm install` completes
2. Development server starts
3. VS Code reloads TypeScript server

**To reload TypeScript in VS Code:**
- Press `Ctrl+Shift+P`
- Type "TypeScript: Restart TS Server"
- Press Enter

### Issue: "Cannot find module" errors

**Solution: Ensure all files are present**
```powershell
# Check project structure
dir -Recurse -Directory | Select-Object Name
```

Should include:
- app/
- components/
- lib/
- store/
- types/
- __tests__/

### Issue: Tests fail on first run

**Solution: Install test dependencies explicitly**
```powershell
npm install --save-dev @types/jest @types/node
npm test
```

## Post-Installation

### Configure VS Code (Recommended)

1. Install extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features

2. Open project in VS Code:
   ```powershell
   code .
   ```

3. Wait for TypeScript to initialize (bottom right status bar)

### Optional: Set Up Git

```powershell
git init
git add .
git commit -m "Initial commit"
```

### Optional: Set Up Environment Variables

```powershell
# Copy example environment file
copy .env.example .env.local

# Edit .env.local with your API keys (if using cloud OCR)
notepad .env.local
```

## Quick Test Workflow

Once installed, test the full workflow:

1. **Upload a bill** (use any image or screenshot)
2. **Click "Scan Bill"** (wait for OCR to complete)
3. **Review items** (should see extracted text, may need editing)
4. **Click "Next: Add People"**
5. **Add 2-3 people** (enter names and click "Add Person")
6. **Choose split mode** (try "Itemized Split")
7. **Assign items** (check boxes to assign items to people)
8. **Click "Calculate Split"**
9. **View summary** (should see per-person breakdown)
10. **Try "Download CSV"**

## Success Criteria

✅ You've successfully installed the app if:

- [ ] `npm install` completed without errors
- [ ] `npm run dev` starts the server
- [ ] Browser loads http://localhost:3000
- [ ] No console errors in browser
- [ ] Can upload an image
- [ ] Tests pass with `npm test`
- [ ] Build succeeds with `npm run build`

## Next Steps

After successful installation:

1. **Read QUICKSTART.md** - Quick start guide
2. **Read README.md** - Full documentation
3. **Try sample data** - Use receipts from `test-data/sample-receipts.md`
4. **Explore code** - Check out the components and pages
5. **Run tests** - Understand the test coverage
6. **Customize** - Modify styling or add features
7. **Deploy** - Follow DEPLOYMENT.md when ready

## Getting Help

If you encounter issues:

1. Check this checklist again
2. Review error messages carefully
3. Search for similar issues online
4. Check Node.js and npm versions
5. Try on a different network (if install fails)
6. Review troubleshooting section above

## Environment Info

Document your environment for troubleshooting:

```powershell
# Check versions
node --version
npm --version
npx --version

# Check OS
$PSVersionTable

# Check project files
dir
```

---

## Installation Complete! 🎉

If all checkboxes are checked, you're ready to use the app!

**Start developing:**
```powershell
npm run dev
```

**Run tests:**
```powershell
npm test
```

**Build for production:**
```powershell
npm run build
```

**Happy bill splitting! 💵**
