import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import MapPage from "@/pages/Map";
import Entertainment from "@/pages/Entertainment";
import Interactive from "@/pages/Interactive";
import Community from "@/pages/Community";
import Profile from "@/pages/Profile";
import NatureExplorer from "@/pages/NatureExplorer";
import BirdWatching from "@/pages/BirdWatching";
import BucketList from "@/pages/BucketList";
import ForestTaste from "@/pages/ForestTaste";
import WaterQualityProtocol from "@/pages/WaterQualityProtocol";
import WaterQualitySteps from "@/pages/WaterQualitySteps";
import TaskSheet from "@/pages/TaskSheet";

const queryClient = new QueryClient();

const mainNavPages = ["", "entertainment", "interactive", "community", "profile"];

function pageNameFromPath(path: string) {
  const seg = path.replace(/^\//, "").split("?")[0];
  return seg || "Map";
}

function LayoutWrapper({ children, pageName }: { children: React.ReactNode; pageName: string }) {
  const isMainNav = mainNavPages.includes(pageName.toLowerCase()) ||
    pageName === "" || pageName === "Map" || pageName === "Entertainment" ||
    pageName === "Interactive" || pageName === "Community" || pageName === "Profile";
  if (isMainNav) {
    return <Layout currentPageName={pageName}>{children}</Layout>;
  }
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Layout currentPageName="Map"><MapPage /></Layout>} />
      <Route path="/entertainment" component={() => <Layout currentPageName="Entertainment"><Entertainment /></Layout>} />
      <Route path="/interactive" component={() => <Layout currentPageName="Interactive"><Interactive /></Layout>} />
      <Route path="/community" component={() => <Layout currentPageName="Community"><Community /></Layout>} />
      <Route path="/profile" component={() => <Layout currentPageName="Profile"><Profile /></Layout>} />
      <Route path="/NatureExplorer" component={NatureExplorer} />
      <Route path="/BirdWatching" component={BirdWatching} />
      <Route path="/BucketList" component={BucketList} />
      <Route path="/ForestTaste" component={ForestTaste} />
      <Route path="/WaterQualityProtocol" component={WaterQualityProtocol} />
      <Route path="/WaterQualitySteps" component={WaterQualitySteps} />
      <Route path="/TaskSheet" component={TaskSheet} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
        <Toaster />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
