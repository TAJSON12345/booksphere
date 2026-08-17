import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Discussions from "./pages/Discussions";
import DiscussionDetail from "./pages/DiscussionDetail";
import Profile from "./pages/Profile";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import NewBook from "./pages/NewBook";
import EditBook from "./pages/EditBook";
import EditDiscussion from "./pages/EditDiscussion";
import NewDiscussion from "./pages/NewDiscussion";
import AdminBooks from "./pages/AdminBooks";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";


function AppContent() {

    const location = useLocation();

    const isLoginPage = location.pathname === "/login";

    return (
        <>
            {!isLoginPage && <Navbar />}

            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
    path="/register"
    element={<Register />}
/>

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/discussions"
                    element={
                        <ProtectedRoute>
                            <Discussions />
                        </ProtectedRoute>
                    }
                />


                <Route
    path="/books"
    element={
        <ProtectedRoute>
            <Books />
        </ProtectedRoute>
    }
/>

<Route
    path="/books/new"
    element={
        <ProtectedRoute>
            <NewBook />
        </ProtectedRoute>
    }
/>

<Route
    path="/books/:id"
    element={
        <ProtectedRoute>
            <BookDetail />
        </ProtectedRoute>
    }
/>

<Route
    path="/books/:id/edit"
    element={
        <ProtectedRoute>
            <EditBook />
        </ProtectedRoute>
    }
/>
<Route
    path="/discussions/new"
    element={
        <ProtectedRoute>
            <NewDiscussion />
        </ProtectedRoute>
    }
/>


                <Route
                    path="/discussions/:id"
                    element={
                        <ProtectedRoute>
                            <DiscussionDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
    path="/discussions/:id/edit"
    element={
        <ProtectedRoute>
            <EditDiscussion />
        </ProtectedRoute>
    }
/>
<Route
    path="/admin/books"
    element={
        <ProtectedRoute>
            <AdminBooks />
        </ProtectedRoute>
    }
/>

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>
        </>
    );
}


function App() {

    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;