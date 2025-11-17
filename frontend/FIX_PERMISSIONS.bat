@echo off
echo ===============================================
echo  Frontend File Permissions Fix
echo ===============================================

echo Taking ownership of all files...
takeown /f . /r /d y >nul 2>&1

echo Resetting ACLs to default inherited permissions...
icacls . /reset /T /Q >nul 2>&1

echo Granting full control to current user...
icacls . /grant:r "%USERNAME%:(F)" /T /Q >nul 2>&1

echo Granting read/write access to essential directories...
icacls .\node_modules /grant:r "%USERNAME%:(F)" /T /Q >nul 2>&1
icacls .\.next /grant:r "%USERNAME%:(F)" /T /Q >nul 2>&1 2>nul
icacls .\app /grant:r "%USERNAME%:(F)" /T /Q >nul 2>&1
icacls .\lib /grant:r "%USERNAME%:(F)" /T /Q >nul 2>&1
icacls .\contexts /grant:r "%USERNAME%:(F)" /T /Q >nul 2>&1
icacls .\components /grant:r "%USERNAME%:(F)" /T /Q >nul 2>&1

echo Making package files writable...
attrib -r package.json >nul 2>&1
attrib -r package-lock.json >nul 2>&1
attrib -r *.js >nul 2>&1
attrib -r *.ts >nul 2>&1
attrib -r *.json >nul 2>&1

echo Setting folder permissions to read/write/execute...
icacls . /grant:r "%USERNAME%:(OI)(CI)(F)" /Q >nul 2>&1

echo ===============================================
echo File permissions fix completed successfully!
echo ===============================================

pause