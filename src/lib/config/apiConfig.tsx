type ApiEndPoints = {
    auth: {
        signin: string,
        refresh: string,
        logout: string,
        createUser: string,
        getUser: (search: string, page: string, limit: string, status: string | boolean, roleId: string[]) => string,
        update: string,
        delete: (ids: string[]) => string,
        resetPassword: string
    },
    wallet: {
        get: (search: string, page: string, limit: string) => string
    },
    coins: {
        create: string;
        get: (status: string, page: string, limit: string) => string;
        delete: (ids: string[]) => string,
        update: string
    },
    members: {
        get: (page: string, limit: string) => string,
        delete: (ids: string[]) => string
    },
    plan: {
        create: string,
        get: string,
        delete: (ids: string[]) => string
    },
    news: {
        create: string,
        get: (page: string, limit: string) => string,
        delete: (ids: string[]) => string,
        update: string,
        slug: (slug: string) => string
    },
    newsLike: {
        toggle: string,
        getCount: (newsId: string) => string
    },
    newsComment: {
        submitComments: string
    },
    request: {
        get: (page: string, limit: string) => string,
        delete: (ids: string[]) => string,
        action: string
    },
    category: {
        create: string,
        get: (search: string, page: string, limit: string) => string,
        delete: (ids: string[]) => string,
        update: string
    },
    tag: {
        get: string
    },
    cloudionary: {
        uploadPhoto: string,
        publisherPhotos: string,
        userPhotos: string
    },
    consultaion: {
        get: (page: string, limit: string) => string,
        delete: (ids: string[]) => string,
        action: string
    },
    publisher: {
        get: (page: string, limit: string) => string,
        delete: (ids: string[]) => string,
        action: string,
        verifyWebsiteMeta: string,
        generateToken: string
    },
    marketplace: {
        niches: {
            create: string,
            get: string,
            edit: string,
            delete: (ids: string[]) => string
        },
        category: {
            create: string,
            get: (page: string, limit: string, name: string) => string,
            edit: string,
            delete: (ids: string[]) => string
        }
    },
    roles: {
        create: string,
        get: string,
        update: string,
        delete: (ids: string[]) => string
    }
}

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS: ApiEndPoints = {
    auth: {
        signin: "/auth/sign-in",
        refresh: "/auth/refresh",
        logout: "/auth/logout",
        createUser: "/auth/create-user",
        getUser: (search, page, limit, status, roleId) => `/auth/get-user?search=${search}&page=${page}&limit=${limit}&isUserActive=${status === "all" ? "all" : status === "active" ? true : false}&roles=${encodeURIComponent(JSON.stringify(roleId))}`,
        update: "/auth/update",
        delete: (ids) => `/auth/delete-users?ids=${encodeURIComponent(JSON.stringify(ids))}`,
        resetPassword: "/auth/reset-password-by-admin"
    },
    wallet: {
        get: (search, page, limit) => `/wallet/get?search=${search}&page=${page}&limit=${limit}`
    },
    coins: {
        create: "/coins",
        get: (status, page, limit) => `/coins?status=${status}&page=${page}&limit=${limit}`,
        delete: (ids) => `/coins?ids=${encodeURIComponent(JSON.stringify(ids))}`,
        update: '/coins/update'
    },
    members: {
        get: (page, limit) => `/member?page=${page}&limit=${limit}`,
        delete: (ids) => `/member?ids=${encodeURIComponent(JSON.stringify(ids))}`
    },
    plan: {
        create: "/plans",
        get: "/plans",
        delete: (ids) => `/plans?ids=${encodeURIComponent(JSON.stringify(ids))}`,
    },
    news: {
        create: "/news",
        get: (page, limit) => `/news?page=${page}&limit=${limit}`,
        delete: (ids) => `/news?ids=${encodeURIComponent(JSON.stringify(ids))}`,
        update: "/news/update",
        slug: (slug) => `/news/slug?slug=${slug}`
    },
    newsLike: {
        toggle: "/news/like/",
        getCount: (newsId) => `/news/like/${newsId}`
    },
    newsComment: {
        submitComments: "/news/comment"
    },
    category: {
        create: "/category/create",
        get: (search, page, limit) => `/category?search=${search}&page=${page}&limit=${limit}`,
        delete: (ids) => `/category/delete?ids=${encodeURIComponent(JSON.stringify(ids))}`,
        update: "/category/update"
    },
    tag: {
        get: "/tag"
    },
    request: {
        get: (page, limit) => `/token-submission?page=${page}&limit=${limit}`,
        delete: (ids: string[]) => `/token-submission?ids=${encodeURIComponent(JSON.stringify(ids))}`,
        action: "/token-submission/update"
    },
    cloudionary: {
        uploadPhoto: "/cloudionary/photo-upload",
        publisherPhotos: "/cloudionary/publisher-photos",
        userPhotos: "/cloudionary/user-photos"
    },
    consultaion: {
        get: (page, limit) => `/consultation?page=${page}&limit=${limit}`,
        delete: (ids: string[]) => `/consultation?ids=${encodeURIComponent(JSON.stringify(ids))}`,
        action: "/consultation/update"
    },
    publisher: {
        get: (page, limit) => `/publisher/get?page=${page}&limit=${limit}`,
        delete: (ids: string[]) => `/publisher/delete?ids=${encodeURIComponent(JSON.stringify(ids))}`,
        action: `/publisher/update`,
        verifyWebsiteMeta: "/publisher/meta-verification",
        generateToken: "/publisher/generate-token"
    },
    marketplace: {
        niches: {
            create: "/niches",
            get: "/niches",
            edit: "/niches/update",
            delete: (ids) => `/niches?ids=${encodeURIComponent(JSON.stringify(ids))}`
        },
        category: {
            create: "/marketplace-category",
            get: (page, limit, name) => `/marketplace-category?page=${page}&limit=${limit}&search=${name}`,
            edit: "/marketplace-category/update",
            delete: (ids) => `/marketplace-category?ids=${encodeURIComponent(JSON.stringify(ids))}`
        }
    },
    roles: {
        create: "/role",
        get: "/role",
        update: "/role/update",
        delete: (ids) => `/role?ids=${encodeURIComponent(JSON.stringify(ids))}`
    }
} 
