# Changes Summary

## Backend Changes

### 1. Added helper function to create URL-friendly slugs
- Function `createSlug()` converts titles to lowercase, removes accents, and replaces spaces with hyphens

### 2. Added POST endpoint for creating new posts
- **Endpoint:** `POST /api/posts`
- **Request body:** `{ title, summary, content, thumbnail? }`
- **Response:** Returns created post with auto-generated ID, slug, and creation date
- **Validation:** Requires title, summary, and content

## Frontend Changes

### 1. Created NewPost page component
- **Path:** `frontend/src/pages/NewPost.jsx`
- **Features:**
  - Form with fields: title, summary, content, thumbnail URL
  - Calls POST /api/posts to create new post
  - Redirects to home on success
  - Shows success/error messages
  - Loading state during submission

### 2. Updated MainLayout
- Removed `AdminRoute` import
- Removed `AdminPage` import
- Added `NewPost` import
- Removed `/admin` route that used AdminRoute
- Added route `/new-post` for creating new posts

### 3. Updated Navbar
- Removed admin-only link to `/admin`
- Added "Tạo bài viết" (Create post) link available to all authenticated users
- Link navigates to `/new-post`

### 4. Updated Stats page
- Now conditionally loads users list based on user role
- Only authenticated admins see the "Danh sách người dùng" section
- Shows all users (posts list) to everyone
- Optimized data fetching based on role

## Files Removed
- `AdminRoute.jsx` is no longer used but still exists
- `AdminPage.jsx` is no longer used but still exists (can be deleted if not needed)

## Usage

### Creating a new post:
1. User logs in
2. Click "Tạo bài viết" in navbar
3. Fill in the form (title, summary, content, optional thumbnail)
4. Click "Tạo bài viết" button
5. Post is created and user is redirected to home

### Viewing stats:
- Regular users: See posts list only
- Admin users: See posts list + users list

## To Delete (Optional)
- `frontend/src/components/AdminRoute.jsx`
- `frontend/src/pages/AdminPage.jsx`
