export interface NewsArticle {
    _id: string;
    heading: string;
    subheading: string;
    slug: string;
    author: string;
    description: string; // HTML content as string
    excerpt: string;
    image: string;

    gallery: string[]; // array of image URLs
    category: string; // category _id reference
    tags: string[];

    status: "draft" | "published" | "scheduled";
    isFeatured: boolean;
    scheduledAt: string | null;
    publishedAt: string | null;

    createdBy: string; // user _id reference
    sourceUrl: string | null;
    credibilityScore: number;

    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    canonicalUrl: string;

    ogTitle: string;
    ogDescription: string;
    ogImage: string;

    createdAt?: string; // optional (if backend adds timestamps)
    updatedAt?: string; // optional
}


export interface Comment {
    commentId: string
    commentText: string
    anonymousId?: string
    userId?: string
    createdAt: string
    parentCommentId?: string | null
    likesCount?: number
}



export interface TagInterface {
    _id: string;
    name: string;
    color?: string;
}
