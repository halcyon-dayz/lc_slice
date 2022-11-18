import React, { useEffect, useState, useRef} from 'react';
import './App.css';
import { 
  Header, 
  Layout, 
  NavBarBue, 
  NavBar, 
  NavBarLeft, 
  NavItem,
  NavItemProps,
  Main,
} from './styles';

import {Container, Section, Bar} from "react-simple-resizer"
import { PathFindingVisualizer } from './components/PathFindingVisualizer';
import { Controls } from './components/Controls';
import { useDispatch } from 'react-redux';
import { changeGridCellSize } from './features/grids/gridsSlice';
import { useAppSelector } from './features/hooks';


const NavItemLeftList: NavItemProps[] = [

  {
    text: "",
    href:"http://www.leetcode.com",
    imageProps: {
      imageURLs: ["./orange-slice.svg"],
      height: 35,
      width: 35,
      margin: "7px 0px 0px 0px"
    }
  },
  {
    text: "Grid Problems"
  },
  {
    text: "Tree Problems"
  }
  //Try to maintain width height ratio of sv
]

type HeaderLayoutProps = {
  leftList: NavItemProps[]
}

const HeaderLayout = ({leftList}: HeaderLayoutProps) => {
  return (<Layout>
    <Header>
      <NavBarBue>
        <NavBar>
          <NavBarLeft>
            {leftList.map((li, idx) => (
              <NavItem
                key={idx}
                text={li.text}
                imageProps={li.imageProps}
                href={li.href}
                />
            ))}
          </NavBarLeft>
        </NavBar>
      </NavBarBue>
    </Header>
  </Layout>);
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
  //Need this to prevent scroll on each save
  const [logLength, setLogLength] = useState<number>(0);

  //# Ref Values #/
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);

  //const dispatch = useDispatch();
  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight - 44);
    });
  }, []);


  //Hopefully the behavior is to automatically scroll to the bottom by passing
  //an absurd number into top that cannot actually be scrolled to
  useEffect(() => {
    if (problemLog.length === logLength) {
      return;
    }
    setLogLength(problemLog.length);
    leftSectionRef.current?.scrollBy({top: 200, left: 0, behavior: "smooth"})
  }, [problemLog])

  /*const onSectionSizeChanged = () => {
    dispatch(changeGridCellSize)
  }

  const onRightSectionChange = (currentSize: number) => {
    console.log(currentSize);
  } */

  return (
    <div className="App">
      <HeaderLayout leftList={NavItemLeftList}/>
      <Main>
        <Container style={{position: "relative", height: `${height}px`}}>
        <Section innerRef={leftSectionRef} style={{
          background: 'rgb(240, 240, 240)',
          overflow: "auto",
        }} minSize={100}>
          <Controls />
        </Section>
        <Bar size={10} style={{ background: '#738228', cursor: 'col-resize' }} />
        <Section innerRef={rightSectionRef} style={{ 
          background: 'rgb(240, 240, 240)', 
          overflow: "auto",
          }} minSize={100}
        >
          <PathFindingVisualizer />
        </Section>
        </Container>
      </Main>    
    </div>
  );
}

export default App;
