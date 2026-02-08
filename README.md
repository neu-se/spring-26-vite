Helper for testing IP2. This may not work with all students' implementations,
but it should work with most of them.

Recommendation:

- Start the student's two dev servers
- Log in as `user1`/`pwd1111` and go to the most recent Nim game
- Run `npm run test` in this directory

This will:

- Cause all users to join the chat you're in and talk
- Cause all users to comment in the forum (to facilitate checking links on
  comments)
- Cause user1 to initialize ten Mine Finder games that can then be used to
  test

If you want to more easily test minesweeper, modify the student's code to
create 2 mines; their dev server will automatically restart and you can run
`npm run test` again.
