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
import { dragRefWith } from './utils/dragUtils';


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

function App() {

  const [height, setHeight] = useState<number>(window.innerHeight - 44);

  const testRefOne = useRef<HTMLDivElement>(null);

  //const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight - 44);
    });
  }, []);





  /*useEffect(() => {
    if (grids[0].startNodeRow === undefined) {
      return;
    }
    const endRow = grids[0].height - 1;
    const endCol = grids[0].width - 1;
    dispatch(changeGridCell({gridIndex: 0, row: endRow, col: endCol, data: grids[0].cells[endRow][endCol].data, status: "END"}))

  }, [grids[0].startNodeRow, grids[0].width, grids[0].height]) */


  /*const onRightSizeChange = (currentSize: number) => {
    if (currentSize < grids[0].cellStyleWidth * grids[0].width) {
      dispatch(changeGridCellSize({gridIndex: 0, width: 25, height: 25}))
    } else if (currentSize > grids[0].cellStyleWidth * grids[0].width && grids[0].cellStyleWidth < 50) {
      dispatch(changeGridCellSize({gridIndex: 0, width: 50, height: 50}))
    }
  } */

  useEffect(() => {
    dragRefWith(testRefOne, testRefOne);
  }, [])

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
          justifyContent: "center"
          }} minSize={100}
        >
          <div ref={testRefOne} style={{position: "relative", width: "100%", backgroundColor: "blue", height: "20px"}}></div>
          <PathFindingVisualizer />
        </Section>
        </Container>
      </Main>    
    </div>
  );
}

export default App;
