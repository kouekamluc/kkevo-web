import { test, expect } from '@playwright/test';

test.describe('Blog User Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to blog page before each test
    await page.goto('/blog');
  });

  test('should display blog posts list', async ({ page }) => {
    // Check if blog posts are displayed
    await expect(page.locator('[data-testid="blog-posts"]')).toBeVisible();
    
    // Check if at least one post is shown
    const posts = page.locator('[data-testid="blog-post"]');
    await expect(posts.first()).toBeVisible();
  });

  test('should navigate to blog post detail', async ({ page }) => {
    // Click on first blog post
    const firstPost = page.locator('[data-testid="blog-post"]').first();
    const postTitle = await firstPost.locator('h3').textContent();
    
    await firstPost.click();
    
    // Should navigate to post detail page
    await expect(page).toHaveURL(/\/blog\/.+/);
    
    // Post title should match
    await expect(page.locator('h1')).toContainText(postTitle || '');
  });

  test('should search for blog posts', async ({ page }) => {
    // Click search button or navigate to search page
    await page.goto('/blog/search');
    
    // Enter search term
    const searchInput = page.locator('input[placeholder*="search"]');
    await searchInput.fill('react');
    
    // Submit search
    await page.locator('button[type="submit"]').click();
    
    // Should show search results
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    // Click on a category filter
    const categoryFilter = page.locator('[data-testid="category-filter"]').first();
    const categoryName = await categoryFilter.textContent();
    
    await categoryFilter.click();
    
    // Should filter posts by category
    await expect(page.locator('[data-testid="blog-posts"]')).toBeVisible();
    
    // Check if category is applied (this might need adjustment based on actual implementation)
    await expect(page.locator('[data-testid="active-filters"]')).toContainText(categoryName || '');
  });

  test('should display author information', async ({ page }) => {
    // Navigate to a blog post
    const firstPost = page.locator('[data-testid="blog-post"]').first();
    await firstPost.click();
    
    // Check if author info is displayed
    await expect(page.locator('[data-testid="author-info"]')).toBeVisible();
    
    // Click on author name to go to author page
    const authorLink = page.locator('[data-testid="author-link"]');
    await authorLink.click();
    
    // Should navigate to author page
    await expect(page).toHaveURL(/\/blog\/author\/.+/);
  });

  test('should handle pagination', async ({ page }) => {
    // Check if pagination is present (if there are many posts)
    const pagination = page.locator('[data-testid="pagination"]');
    
    if (await pagination.isVisible()) {
      // Click next page
      const nextButton = page.locator('[data-testid="next-page"]');
      await nextButton.click();
      
      // Should show different posts
      await expect(page).toHaveURL(/page=2/);
    }
  });

  test('should display blog post metadata', async ({ page }) => {
    // Navigate to a blog post
    const firstPost = page.locator('[data-testid="blog-post"]').first();
    await firstPost.click();
    
    // Check for essential metadata
    await expect(page.locator('[data-testid="post-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="post-date"]')).toBeVisible();
    await expect(page.locator('[data-testid="reading-time"]')).toBeVisible();
    
    // Check for tags if present
    const tags = page.locator('[data-testid="post-tags"]');
    if (await tags.isVisible()) {
      await expect(tags).toBeVisible();
    }
  });

  test('should handle empty states', async ({ page }) => {
    // This test would need to be run in a scenario with no posts
    // or with specific search terms that return no results
    
    // Navigate to search with no results
    await page.goto('/blog/search?q=nonexistentterm');
    
    // Should show no results message
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
    
    // Should provide helpful suggestions
    await expect(page.locator('[data-testid="search-suggestions"]')).toBeVisible();
  });
});

test.describe('Blog Admin Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin blog page
    await page.goto('/admin/blog');
  });

  test('should display admin dashboard', async ({ page }) => {
    // Check if admin dashboard is visible
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    
    // Check for admin controls
    await expect(page.locator('[data-testid="create-post-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="posts-table"]')).toBeVisible();
  });

  test('should create new blog post', async ({ page }) => {
    // Click create post button
    await page.locator('[data-testid="create-post-button"]').click();
    
    // Should navigate to create post form
    await expect(page).toHaveURL('/admin/blog/new');
    
    // Fill in post details
    await page.locator('[data-testid="post-title-input"]').fill('Test Post');
    await page.locator('[data-testid="post-content-input"]').fill('Test content');
    await page.locator('[data-testid="post-excerpt-input"]').fill('Test excerpt');
    
    // Submit form
    await page.locator('[data-testid="submit-post-button"]').click();
    
    // Should redirect to posts list or show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('should edit existing blog post', async ({ page }) => {
    // Click edit button on first post
    const editButton = page.locator('[data-testid="edit-post-button"]').first();
    await editButton.click();
    
    // Should navigate to edit form
    await expect(page).toHaveURL(/\/admin\/blog\/.+\/edit/);
    
    // Update post title
    const titleInput = page.locator('[data-testid="post-title-input"]');
    await titleInput.clear();
    await titleInput.fill('Updated Post Title');
    
    // Save changes
    await page.locator('[data-testid="save-post-button"]').click();
    
    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('should delete blog post', async ({ page }) => {
    // Click delete button on first post
    const deleteButton = page.locator('[data-testid="delete-post-button"]').first();
    
    // Should show confirmation dialog
    await deleteButton.click();
    
    // Confirm deletion
    await page.locator('[data-testid="confirm-delete-button"]').click();
    
    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});






