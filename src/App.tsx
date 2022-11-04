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

import {Container, Section, Bar, BarActionType} from "react-simple-resizer"
import { PathFindingVisualizer } from './components/PathFindingVisualizer';
import { Controls } from './components/Controls';
import { dragRefWith } from './utils/dragUtils';
import { useDispatch } from 'react-redux';
import { changeGridCellSize } from './features/grids/gridsSlice';


const NavItemLeftList: NavItemProps[] = [

  {
    text: "",
    href:"http://www.leetcode.com",
    imageProps: {
      imageURLs: ["/orange-slice.svg", "/leetcode.svg"],
      height: 35,
      width: 35,
      margin: "7px 0px 0px 0px"
    }
  },
  {
    text: "Explore"
  },
  {
    text: "Problems"
  },
  {
    text: "Interview"
  },
  {
    text: "Contest"
  },
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

function App() {

  const [height, setHeight] = useState<number>(window.innerHeight - 44);
  const [barActivated, setBarActivated] = useState<boolean>(false);

  const testRefOne = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();


  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight - 44);
    });
  }, []);

  const onSectionSizeChanged = () => {
    dispatch(changeGridCellSize)
  }


  return (
    <div className="App">
      <HeaderLayout leftList={NavItemLeftList}/>
      <Main>
        <Container style={{position: "relative", height: `${height}px`}}>
        <Section style={{ overflow: "scroll", background: 'rgb(240, 240, 240)' }} minSize={100}>
          <Controls />
        </Section>
        <Bar size={10} style={{ background: '#738228', cursor: 'col-resize' }} />
        <Section style={{ 
          background: 'rgb(240, 240, 240)', 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "scroll"
          }} minSize={100}
        >
          <PathFindingVisualizer />
        </Section>
        </Container>
        {/**Container
        <div 
          style={{
            boxSizing: "border-box",
            height: "995.99px",
            position: "relative",
            display: "flex",
            textAlign: "center",

          }}
        >
          <div
            style={{
              display: "flex",
              minWidth: "100px",
              overflowY: "scroll",
              backgroundColor: "rgb(240, 240, 240)",
              flexGrow: 0.5
            }}
          >
          </div>
          <div 
            style={{
              backgroundColor: "rgb(115, 130, 40)",
              width: "10px",
              cursor: "col-resize"
            }}
          />
          <div
            style={{
              display: "flex",
              minWidth: "100px",
              overflowY: "scroll",
              backgroundColor: "rgb(240, 240, 240)",
              flexGrow: 0.5
            }}
          >
          </div>
          </div> */}
      </Main>    
    </div>
  );
}

export default App;
