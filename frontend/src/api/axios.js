import axios from "axios";

const api = axios.create({
    baseURL:
        "http://localhost:8000/api/",
    withCredentials: true,
});

let csrfToken = null;

function getCookie(name) {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const [key, ...valueParts] = cookie.trim().split("=");

        if (key === name) {
            return decodeURIComponent(valueParts.join("="));
        }
    }

    return null;
}

export async function getCSRFToken() {
    try {
        const response = await api.get("accounts/csrf/");

        csrfToken =
            response.data.csrfToken ||
            getCookie("csrftoken");

        return csrfToken;

    } catch (error) {
        console.error("Could not get CSRF token:", error);
        throw error;
    }
}

api.interceptors.request.use(
    async (config) => {

        const method = config.method?.toLowerCase();

        // Only attach CSRF token to requests that need it
        if (
            method === "post" ||
            method === "put" ||
            method === "patch" ||
            method === "delete"
        ) {
            if (!csrfToken) {
                csrfToken = getCookie("csrftoken");
            }

            if (!csrfToken) {
                try {
                    csrfToken = await getCSRFToken();
                } catch (error) {
                    console.error(
                        "Could not obtain CSRF token:",
                        error
                    );
                }
            }

            if (csrfToken) {
                config.headers["X-CSRFToken"] = csrfToken;
            }
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default api;