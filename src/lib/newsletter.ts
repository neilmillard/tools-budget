export type NewsletterPost = {
  id: string;
  title: string;
  date: string;
};

/**
 * Posts crossed into "published" since the last send, gated by publish date
 * (not generation date) so the automation matches the site's actual staggered
 * weekly release schedule rather than the batch the content was written in.
 */
export function getNewlyPublishedPosts(
  posts: NewsletterPost[],
  lastSentDate: string | null,
  today: Date = new Date()
): NewsletterPost[] {
  const since = lastSentDate ? new Date(lastSentDate) : new Date(0);

  return posts
    .filter((post) => {
      const publishDate = new Date(post.date);
      return publishDate > since && publishDate <= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
