import axios from "axios";

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

// Setup CSRF token
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
    axios.defaults.withCredentials = true;
} else {
    console.warn('HashtagCms: CSRF token not found. Add <meta name="csrf-token" content="..."> to your HTML head.');
}

// Only expose axios globally if not already defined
if (typeof window !== 'undefined' && !window.axios) {
    window.axios = axios;
}

export default axios;
