import React, { useEffect, useState, useRef} from 'react';
import './App.css';
import { 
  Main,
  NavItemProps,
  NavItem
} from './styles';

import {Container as ResizeContainer, Bar, Section} from "react-simple-resizer"
import { Controls } from './components/Controls'
import { useDispatch } from 'react-redux';
import { useAppSelector } from './features/hooks';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { clearState } from './components/Controllers/controllerUtils';
import { DataStructureDisplay } from './components/RightDSDisplay';


type ProblemDropdownType = {
  title: string,
  action: () => void,
}

const constructProblemDropdown = (
  problems: string[], 
  dispatch: any
): ProblemDropdownType[] => {
  return problems.map((problem, idx) => {
    let number = parseInt(problem.split(".")[0]);
    return {
      title: problem, 
      action: () => {
        clearState(dispatch, number);
      }
    }
  })
}


type Coordinate = {
  x: number,
  y: number
}


/**
 * Layout of the application 
 * @Header Contains navigation elements for each problem.
 * @Left Contains controls and action log for each problem.
 * @Right Contains the actual data structures and a legend.
 */
function App() {
  //# Selectors #//
  const problemLog = useAppSelector(state => state.problem.problemLog);

  //# Local State Values #//
  const [height, setHeight] = useState<number>(window.innerHeight - 44);
  const [rightWidth, setRightWidth] = useState<number>(0);
  //Need this to prevent scroll on each save
  const [logLength, setLogLength] = useState<number>(0);

  //# Ref Values #/
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight - 44);
    });
  }, []);

  useEffect(() => {
    if (rightSectionRef.current !== null) {
      console.log(rightSectionRef.current.clientWidth)
      setRightWidth(rightSectionRef.current.clientWidth);
    }

  }, [rightSectionRef]);


  const GridProblems = constructProblemDropdown(
    [
      "733. Flood Fill", 
      "417. Pacific Atlantic Waterflow", 
      "21. All Paths to Cells",
      "934. Shortest Bridge"
    ],
    dispatch
  );
  //

  const GraphProblems = constructProblemDropdown(
    [
      "797. All Paths from Source to Target",
      "1129. Shortest Path with Alternating Colors"
    ],
    dispatch
  );

  return (
    <div className="App">
      <div id="navBarDiv">
        <Navbar bg="primary" variant="dark">
          <Container style={{"width": "100%", "marginLeft": "0px"}}>
            <Navbar.Brand href="#home">LC_SLICE</Navbar.Brand>
            <Nav className="me-auto">
              <NavDropdown title="Grid Problems">
                {GridProblems.map((problem, idx) => (
                  <NavDropdown.Item key={problem.title} onClick={problem.action}>{problem.title}</NavDropdown.Item>
                ))}
              </NavDropdown>
              <NavDropdown title="Graph Problems">
                {GraphProblems.map((problem, idx) => (
                  <NavDropdown.Item key={problem.title} onClick={problem.action}>{problem.title}</NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
          </Container>
        </Navbar>
      </div>
      <Main> {/*sdfsdfsfs*/}
        <ResizeContainer style={{position: "relative", height: `${height}px`}}>
        <Section innerRef={leftSectionRef} style={{
          background: 'rgb(240, 240, 240)',
          overflow: "auto",
        }} minSize={100}>
          <Controls />
        </Section>
        <Bar size={10} style={{ background: '#738228', cursor: 'col-resize' }} />
        <Section innerRef={rightSectionRef} 
          onSizeChanged={() => {
            if (rightSectionRef.current) {
              setRightWidth(rightSectionRef.current?.clientWidth);
            }
          }}
        style={{ 
          background: 'rgb(240, 240, 240)', 
          overflow: "auto",
          }} minSize={100}
        >
          <DataStructureDisplay rightWidth={rightWidth}/>
        </Section>
        </ResizeContainer>
      </Main>    
    </div>
  );
}

export default App;
