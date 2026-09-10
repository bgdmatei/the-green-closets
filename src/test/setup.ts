import "@testing-library/jest-dom/vitest";

// Modules like `@/lib/image-hosts` read this at load time to decide whether to
// include Cloudinary in the optimizer's allow-list; pin a value so tests match
// what production sees. Individual tests can override before importing the
// module under test if they need to exercise the unset path.
process.env.NEXT_PUBLIC_CLOUDINARY_ACCOUNT ??= "hzhhirkt";
