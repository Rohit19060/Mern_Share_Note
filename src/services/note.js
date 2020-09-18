import axios from "axios";

export const login = (user) => {
  return axios.post("/api/login", user);
};
export const register = (user) => {
  return axios.post("/api/register", user);
};

export const save = (note) => {
  return axios.post("/api/posts", note);
};

export const followuser = (followdetails) => {
  return axios.post("/api/follow", followdetails);
};

export const unfollowuser = (unfollowdetails) => {
  return axios.post("/api/unfollow", unfollowdetails);
};

export const allposts = () => {
  return axios.get("/api/posts");
};
export const alluser = () => {
  return axios.get("/api/users");
};

export const uniuser = (id) => {
  return axios.get(`/api/user/${id}`);
};
export const unipost = (id) => {
  return axios.get(`/api/posts/${id}`);
};

export const deletepost = (time) => {
  return axios.delete("/api/delpost?time=" + time);
};

export const likeupdate = (update) => {
  return axios.put("/api/likes", update);
};
