import axios from "axios";
import instance from './axios'

//用户注册api
export const registerUser = (data) => {
    return axios.post('http://localhost:8000/users/register/', data);
};

export const loginUser = (data) => {
    return axios.post('http://localhost:8000/users/login/', data);
}

export const updateUser = (data) => {
    return instance.post('http://localhost:8000/users/update_user/', data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export const logoutUser = () => {
    return instance.post('http://localhost:8000/users/logout/');
}

export const getUserInfo = () => {
    return instance.get('http://localhost:8000/users/user/info')
}

export const getUserById = (user_id) => {
    return axios.get(`http://localhost:8000/users/user/${user_id}`)
}

export const postBlog = (data) => {
    return instance.post('http://localhost:8000/posts/create_post/',data);
}

export const getBlog = (post_id) => {
    return axios.get(`http://localhost:8000/posts/post/${post_id}`)
}

export const browseBlogs = (page) => {
    console.log("请求的页码：", page)
    return axios.get('http://localhost:8000/posts/browse', {
        params: { page }
    })
}

export const blogExhibition = () => {
    return axios.get('http://localhost:8000/posts/blog-exhibition')
}

export const getBlogForManagement = () => {
    return instance.get('http://localhost:8000/posts/blog-management')
}

export const updateBlog = (blog_id, data) => {
    return instance.put(`http://localhost:8000/posts/blog/update/${blog_id}/`,data )
}

export const deleteBlogById = (blog_id) => {
    return instance.delete(`http://localhost:8000/posts/blog/delete/${blog_id}/`)
}

export const addComment = (blog_id, data) => {
    return instance.post(`http://localhost:8000/posts/blog/${blog_id}/post_comment/`, data)
}

export const getCommentsById = (blog_id) => {
    return axios.get(`http://localhost:8000/posts/blog/${blog_id}/comments/`)
}

export const deleteComment = (comment_id) => {
    return instance.delete(`http://localhost:8000/posts/blog/${comment_id}/delete/`)
}

export const getRecentPost = (user_id) => {
    return axios.get(`http://localhost:8000/posts/blog/${user_id}/recent_posts/`)
}

export const LikePost = (post_id) => {
    return instance.post(`http://localhost:8000/posts/blog/${post_id}/liked/`)
}

export const getLikeStatus = (post_id) => {
    return instance.get(`http://localhost:8000/posts/blog/${post_id}/liked_status/`)
}

