import './App.css'
// import DraggableList from './DraggableList';
import Layout from './Layout';
import { MantineProvider } from '@mantine/core';

function App() {

  return (
    <MantineProvider withCssVariables={false}>
      <div>
        <Layout />
        {/* <DraggableList/> */}
      </div>
    </MantineProvider>
  )
}

export default App
