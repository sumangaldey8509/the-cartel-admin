export interface CategoryInterface {
    _id: string,
    name: string,
    slug: string,
    description: string,
    parent: {
        _id: string,
        name: string
    },
    banner: string,
    metaTitle: string,
    metaDescription: string,
    isFeatured: boolean,
    icon: string,
    isActive: boolean,
    createdBy: {
        _id: string,
        email: string
    },
    createdAt: string,
    updatedAt: string,
    __v: Number
}


// {
//     name: { type: String, required: true, unique: true, trim: true },
//     slug: { type: String, unique: true, index: true },
//     description: { type: String, maxlength: 300, default: null },

//     // new
//     parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null, index: true },

//     // new
//     banner: { type: String, default: null },

//     // new 
//     metaTitle: { type: String, maxlength: 70, default: null },
//     metaDescription: { type: String, maxlength: 160, default: null },

//     // new
//     isFeatured: { type: Boolean, default: false },

//     icon: { type: String, default: null },
//     isActive: { type: Boolean, default: true },

//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// },