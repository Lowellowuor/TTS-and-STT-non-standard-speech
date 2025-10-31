import React, { useState, useEffect, Suspense, lazy } from "react";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import ParticleBackground from "./components/Layout/ParticleBackground";
import "../css/main.css"; // Import main CSS file

// Lazy load feature modules
const DailyCommunicator = lazy(() => import("./components/solutions/DailyCommunicator"));
const VoicePersonalizer = lazy(() => import("./components/solutions/VoicePersonalizer"));
const ContentAmplifier = lazy(() => import("./components/solutions/ContentAmplifier"));
const SmartPredictor = lazy(() => import("./components/solutions/SmartPredictor"));
const SymbolBoard = lazy(() => import("./components/solutions/SymbolBoard"));
const EmergencyMode = lazy(() => import("./components/solutions/EmergencyMode"));

// Error Boundary with better error handling
function ComponentErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (errorEvent) => {
      console.error("Component error caught by boundary:", errorEvent.error);
      setHasError(true);
      setError(errorEvent.error);
    };

    const handleRejection = (rejectionEvent) => {
      console.error("Promise rejection caught by boundary:", rejectionEvent.reason);
      setHasError(true);
      setError(rejectionEvent.reason);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  if (hasError) {
    return React.isValidElement(fallback) 
      ? React.cloneElement(fallback, { error }) 
      : fallback;
  }

  return children;
}

// Global Loading Spinner
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-content animate-fadeIn">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading VoiceForge...</p>
      </div>
    </div>
  );
}

// Error fallback with enhanced error details
function ErrorFallback({ componentName, error }) {
  return (
    <div className="error-fallback">
      <div className="error-container animate-scaleIn">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Component Load Error</h2>
        <p className="error-description">
          Failed to load {componentName}. {error?.message || "Please try refreshing the page."}
        </p>
        <div className="error-actions">
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary animate-pulse"
          >
            Refresh Page
          </button>
          <button 
            onClick={() => window.history.back()} 
            className="btn-secondary"
          >
            Go Back
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="error-details">
            <summary>Error Details (Development)</summary>
            <pre>{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
  );
}

function App() {
  const [activeSolution, setActiveSolution] = useState("daily");
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({ 
    online: true, 
    battery: 90,
    lastUpdate: new Date().toISOString()
  });
  const [currentLanguage, setCurrentLanguage] = useState("en-KE");

  // Simulate initial load with better cleanup
  useEffect(() => {
    let mounted = true;
    
    const loadApp = async () => {
      // Simulate initial data loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (mounted) {
        setIsLoading(false);
      }
    };

    loadApp();

    return () => {
      mounted = false;
    };
  }, []);

  // Listen for hash changes in URL with debouncing
  useEffect(() => {
    let timeoutId;

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && solutionComponents[hash]) {
        // Debounce to prevent rapid changes
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setActiveSolution(hash);
        }, 50);
      }
    };

    // Initial hash check
    handleHashChange();
    
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  // Map solution keys to components
  const solutionComponents = {
    daily: { component: DailyCommunicator, name: "Daily Communicator" },
    personalizer: { component: VoicePersonalizer, name: "Voice Personalizer" },
    amplifier: { component: ContentAmplifier, name: "Content Amplifier" },
    predictor: { component: SmartPredictor, name: "Smart Predictor" },
    symbols: { component: SymbolBoard, name: "Symbol Board" },
    emergency: { component: EmergencyMode, name: "Emergency Mode" },
  };

  const handleSolutionChange = (solution) => {
    if (solutionComponents[solution]) {
      setActiveSolution(solution);
      // Update URL hash without causing page reload
      window.history.pushState(null, "", `#${solution}`);
    }
  };

  const renderSolution = () => {
    const currentSolution = solutionComponents[activeSolution] || solutionComponents.daily;
    const SolutionComponent = currentSolution.component;

    return (
      <ComponentErrorBoundary 
        fallback={<ErrorFallback componentName={currentSolution.name} />}
      >
        <Suspense
          fallback={
            <div className="component-loading animate-fadeIn">
              <div className="loading-spinner small"></div>
              <p className="loading-text">Loading {currentSolution.name}...</p>
            </div>
          }
        >
          <div className="solution-container animate-slideUp">
            <SolutionComponent />
          </div>
        </Suspense>
      </ComponentErrorBoundary>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app-layout">
      <ParticleBackground />

      {/* Fixed Header */}
      <Header
        activeSolution={activeSolution}
        setActiveSolution={handleSolutionChange}
        systemStatus={systemStatus}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
      />

      {/* Main Content with proper spacing for fixed header */}
      <div className="main-content-wrapper">
        <main className="main-content">
          {renderSolution()}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;