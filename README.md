# votey-uppy

[Check out the live working version!](https://votey-uppy.vercel.app/)

Votey-uppy is an app to collect and vote on ideas.

The code is being developed in the open so follow along with the progress here!

## Development

1. Checkout the repo
1. `yarn` to install node dependencies
1. Start a MongoDB server
1. Create your local environment file:
   1. `cp .env.template .env.local`
   2. Create a [GitHub OAuth application](https://github.com/settings/applications/new)
      1. Homepage URL: `http://localhost:3000/`
      2. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   3. Fill in your GitHub ID and secret into your local environment file
1. `yarn dev` to start the Next.js

## Roadmap

### Milestone 1

- [x] [Scaffold Next.js](https://github.com/hswolff/votey-uppy/commit/503c03fbe02d8859bdc744435bd276f37eff0d29)
- [x] [Enable TypeScript for Next.js](https://github.com/hswolff/votey-uppy/commit/5caa9c17aac8efebbf6b809c1d0b53c958a85c04)
- [x] [Add ESLint](https://github.com/hswolff/votey-uppy/commit/405c41e32ada10431a99a0e4311c339c6208eef4)
- [x] [Add Tailwind](https://github.com/hswolff/votey-uppy/commit/9575635027875c90f95c619cdf1c900b8b5eb270)
- [x] [Add faker.js and fake rendering 10 items](https://github.com/hswolff/votey-uppy/commit/962044464ebe45eb2ec8ff50e0473bff7763bc3b)
- [x] [Support absolute paths](https://github.com/hswolff/votey-uppy/commit/a8921dd352152d9550c21ccbe02b55a4b929b42f)
  - Enable StrictMode
- [x] [Add NextAuth](https://github.com/hswolff/votey-uppy/commit/41186b196901649e9e9ce58dd1282b4504a8e3bb)
- [x] [Add react-query and first Next.js API endpoint](https://github.com/hswolff/votey-uppy/commit/58c542bc5e06649de1df8133c683f6b09291155c)
- [x] [Enable StrictMode, create some shared types](https://github.com/hswolff/votey-uppy/commit/9a23348f02731dfe42f4e5966a7fed5e5b1b90cb)
- [x] [Create shared Layout and Nav](https://github.com/hswolff/votey-uppy/commit/46cff213d26ae66fb819805d6a436d24e9447f91)
- [x] [Add MongoDB and expose via API](https://github.com/hswolff/votey-uppy/commit/4bd46490a27f7d0eed17083c52636b95ac050a92)
- [x] [Add Next.js incremental static regeneration](https://github.com/hswolff/votey-uppy/commit/62c46eda0b6670c4344bb29b8b709b1f362a612d)

### Milestone 2

- [x] Pull username from GitHub when user signs in
- [x] Make all forms of AddItemForm configurable
  - title, description, category
  - By default status is set to `pending`
- [x] Allow admin to view pending ideas
  - Create admin flag on User
  - Don't show pending in main feed
- [x] Create standalone Item page
- [x] Allow Admins to edit an existing Item
  - Able to promote `pending` items to `open`

### Milestone 3

- [x] Revise Item design
- [x] Switch to Formik
- [x] Revise Add new Item form
- [x] Revise Edit Item Form
- [x] Revise Profile design
- [x] Revise About design
- [x] Add docs on Add New Item page telling users it's been added to the queue and will be evaluated before being accepted
- [x] Show pending items on user's profile page

### Milestone 4

- [x] Let user edit their own Item while it's still 'pending'
- [x] Show the username of who created the Item in the item UI
- [x] Filter items by:
  - status
  - category
- [x] Make homepage sortable in asc/desc order by:
  - Votes
  - Created
- [x] Remove Admin page and replace with Pending support for admins on home page
- [x] Make description field take in Markdown and render as markdown
- [x] True mobile support
- [x] Upvoting on individual item page doesn't update count
- [x] Save the date of when an item moves status
  - Such that you can see when an item was submitted and when it was completed
- [x] Cleanup user.\_id and user.id usage

### Milestone 5

- [x] Let admins set status when creating a new item
- [x] Let admin delete an item
- [ ] Add pagination to list of Items
- [ ] Support export to json functionality
- [ ] Maybe support priority order of items within a list
- [ ] Let user edit their profile details
  - Can change their username
  - Make sure their username change reflects in Item
- [ ] Migrate to [Typegoose](https://github.com/typegoose/typegoose)
