export default [
  { path: "/issues", needLogin: false },
  { path: "/issues/:id", needLogin: false },
  { path: "/books", needLogin: false },
  { path: "/books/:id", needLogin: false },
  { path: "/articles", needLogin: false },
  { path: "/personal", needLogin: true },
  { path: "/addIssue", needLogin: true },
  { path: "/searchPage", needLogin: false },
  { path: "/", needLogin: false },
];
