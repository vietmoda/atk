/**
 * Loại chuyên mục
 */
export const NEW_CATEGORY_TYPE = {
    AUDIO: "Audio",
    ALBUM: "Album",
    VIDEO: "Video",
    NEWS: "News",
    WEBLINK: "Weblink",
}

export const STATUS_DISABLED = 0;
export const STATUS_ACTIVED = 1;
export const STATUS_DELETED = 2;

/**
 * Loại hiển thị weblink
 */
export const WEBLINK_VIEW_TYPE = {
    TITLE: "Title",
    IMAGE: "Image"
}

export const ACTION_TYPE = {
    DELETE: "DELETE",
    EDIT: "EDIT",
    ADD: "ADD",
    LOGIN: "LOGIN",
    STATUS: "STATUS"
}

/**
 * cac bang dung de truy xuat
 */
export const COLLECTION_NAME = {
    Users: "users",
    Newscategories: "newscategories",
    News: "news",
    Systemconfigs: "systemconfigs",
    Files: "files",
    Ordermenus: "ordermenus",
    Suggestedmenus: "suggestedmenus",
    Bookings: "bookings",
    Weblinks: "weblinks",
    Album: "album",
    Categories: "categories",
    Videos: "videos",
    Items: "items",
    s: "s",
    Groups: "groups",
    Roles: "roles"
}


/**
 * Trạng thái bản tin (Vừa tạo lập/Đã duyệt/Đã xuất bản)
 */
export const NEWS_STATUS = {
    CREATED: 0,     //Vừa tạo lập
    APPORVED: 1,    //Đã duyệt
    PUBLISHED: 2    //Đã xuất bản
}

/**
 * Trạng thái xử lý
 */
export const PROCESS_STATUS = {
    NEW: 0,         //Vừa tạo lập
    VISITED: 1,     //Đã xử lý
    PROCESSED: 2    //Đang xử lý
}