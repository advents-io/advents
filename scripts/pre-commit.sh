#!/bin/sh

# Get a list of staged files
staged_files=$(git diff --cached --name-only)

# Check if any of the staged files match the pattern *.env*
for file in $staged_files; do
  case "$file" in
    *.env*)
      echo "Warning: You are about to commit changes to $file"
      echo "Please ensure that no sensitive information is being committed."
      printf "Do you want to proceed with the commit? (y/n) "
      read -n 1 choice < /dev/tty
      echo
      echo
      if [ "$choice" != "y" ]; then
        echo "Commit aborted."
        exit 1
      fi
      ;;
  esac
done

# If no *.env* files are staged, or the user chooses to proceed, allow the commit
exit 0
