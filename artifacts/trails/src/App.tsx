import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Interactive from "@/pages/Interactive";
import Community from "@/pages/Community";
import MapPage from "@/pages/Map";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Layout currentPageName="Interactive"><Interactive /></Layout>} />
      <Route path="/community" component={() => <Layout currentPageName="Community"><Community /></Layout>} />
      <Route path="/map" component={() => <Layout currentPageName="Map"><MapPage /></Layout>} />
      <Route path="/settings" component={() => <Layout currentPageName="Settings"><Settings /></Layout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
