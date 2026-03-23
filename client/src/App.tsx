import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LayoutProvider } from "./context/LayoutContext";
import { Spinner } from "./components/Spinner";
import { lazy, Suspense } from "react";
import { ReactFlowProvider } from "reactflow";
import { SidebarProvider } from "./context/Sidebarcontext";

const HomePage = lazy(() =>
  import("./pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const AboutPage = lazy(() =>
  import("./pages/About").then((module) => ({ default: module.AboutPage })),
);
const AuthPage = lazy(() =>
  import("./pages/AuthPage").then((module) => ({ default: module.AuthPage })),
);
const JoinCanvasPage = lazy(() =>
  import("./pages/JoinCanvasPage").then((module) => ({
    default: module.JoinCanvasPage,
  })),
);
const CanvasView = lazy(() =>
  import("./view/CanvasView").then((module) => ({
    default: module.CanvasView,
  })),
);
const PublicLayout = lazy(() =>
  import("./pages/PublicLayout").then((module) => ({
    default: module.PublicLayout,
  })),
);
const AppLayout = lazy(() =>
  import("./pages/AppLayout").then((module) => ({ default: module.AppLayout })),
);
const AppIndexRedirect = lazy(() =>
  import("./components/AppIndexRedirect").then((module) => ({
    default: module.AppIndexRedirect,
  })),
);

const NotFoundPage = lazy(() =>
  import("./pages/PageNotFound").then((module) => ({
    default: module.NotFoundPage,
  })),
);

const App = () => {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <LayoutProvider>
            <Suspense
              fallback={
                <div className="flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
                  <Spinner size="lg" text="Loading Synapse..." />
                </div>
              }
            >
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<AuthPage />} />
                </Route>
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <ReactFlowProvider>
                        <AppLayout />
                      </ReactFlowProvider>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AppIndexRedirect />} />
                  <Route path="/app/canvas/:_id" element={<CanvasView />} />
              </Route>
                <Route
                  path="/join/:_id/:inviteToken"
                  element={<JoinCanvasPage />}
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </LayoutProvider>
        </SidebarProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
