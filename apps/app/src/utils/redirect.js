const AUTH_URL = process.env.REACT_APP_AUTH_URL;
const DASHBOARD_URL = process.env.REACT_APP_DASHBOARD_URL;

const getCreatePostRedirectPath = (currentUser) => {
    const NEXT_PATH = `${DASHBOARD_URL}/posts/new?step=category-select`;
    const NEXT_PARAM = encodeURIComponent(NEXT_PATH); // ✅ sécurisation

    if (!currentUser) {
        return `${AUTH_URL}/signin?next=${NEXT_PARAM}`;
    }

    if (!currentUser.emailVerified) {
        return `${AUTH_URL}/verify-email?next=${NEXT_PARAM}`;
    }

    if (!currentUser.isActive) {
        return `${AUTH_URL}/verify-account?next=${NEXT_PARAM}`;
    }

    return NEXT_PATH;
};

export default getCreatePostRedirectPath;