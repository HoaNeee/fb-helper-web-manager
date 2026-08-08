import "./App.css";
import { Toaster } from "./components/ui/toast";
import LayoutDefault from "./layouts/LayoutDefault";
import "react-quill-new/dist/quill.snow.css";

function App() {
  return (
    <>
      <LayoutDefault />;
      <Toaster />
    </>
  );
}

export default App;
